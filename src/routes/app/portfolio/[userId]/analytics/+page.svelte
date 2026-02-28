<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { authStore } from '$lib/stores/auth';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import AppHeader from '$lib/components/common/AppHeader.svelte';
	import LoadingState from '$lib/components/common/LoadingState.svelte';
	import { getPortfolioAnalytics } from '$lib/services/portfolio';
	import { reveal } from '$lib/actions/animate';
	import type { PortfolioAnalytics, AnalyticsTimeline } from '$lib/types/portfolio';

	const userId: string = $derived($page.params.userId ?? '');

	$effect(() => {
		const authUser = $authStore.user;
		if (!$authStore.loading && authUser && authUser.userId !== userId) {
			goto('/app/dashboard');
		}
	});

	interface ExtendedAnalytics extends PortfolioAnalytics {
		uniqueVisitors?: number;
		avgTtfb?: number;
		cacheHitRate?: number;
		byHour?: Record<string, number>;
		byDayOfWeek?: Record<string, number>;
		byVersion?: Record<string, number>;
		bestTimeToShare?: {
			hour: number;
			dayOfWeek: string;
		};
	}

	let analytics: ExtendedAnalytics | null = $state(null);
	let loadingStatus: 'loading' | 'error' | 'done' = $state('loading');
	let errorMsg = $state('');
	let isChartExpanded = $state(false);
	let hoveredIndex: number | null = $state(null);

	// ── SVG chart constants ────────────────────────────────────────────────────
	const SVG_W = 1000;
	const SVG_H = 300;
	const PAD_L = 50;
	const PAD_R = 30;
	const PAD_T = 30;
	const PAD_B = 40;
	const CHART_W = SVG_W - PAD_L - PAD_R;
	const CHART_H = SVG_H - PAD_T - PAD_B;
	const CHART_BOTTOM = SVG_H - PAD_B;

	let timeline: AnalyticsTimeline[] = $state([]);
	let minV = $state(0);
	let maxV = $state(0);
	let range = $state(1);
	let linePath = $state('');
	let areaPath = $state('');
	let xLabels: Array<{ x: number; label: string }> = $state([]);
	let yLabels: Array<{ y: number; label: string }> = $state([]);
	
	let countryTotal = $state(0);
	let sourceTotal = $state(0);
	let deviceTotal = $state(0);
	let dayTotal = $state(0);

	function buildLinePath(tl: AnalyticsTimeline[], mn: number, rg: number): string {
		if (tl.length === 0) return '';
		return tl
			.map((d, i) => {
				const n = tl.length;
				const x = PAD_L + (n > 1 ? i / (n - 1) : 0.5) * CHART_W;
				const val = (d as any).count ?? d.views ?? 0;
				const y = CHART_BOTTOM - ((val - mn) / rg) * CHART_H;
				return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');
	}

	function buildAreaPath(tl: AnalyticsTimeline[], mn: number, rg: number): string {
		if (tl.length === 0) return '';
		const n = tl.length;
		const firstX = (PAD_L + (n > 1 ? 0 : 0.5) * CHART_W).toFixed(1);
		const lastX = (PAD_L + (n > 1 ? 1 : 0.5) * CHART_W).toFixed(1);
		const points = tl
			.map((d, i) => {
				const x = PAD_L + (n > 1 ? i / (n - 1) : 0.5) * CHART_W;
				const val = (d as any).count ?? d.views ?? 0;
				const y = CHART_BOTTOM - ((val - mn) / rg) * CHART_H;
				return `L${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');
		return `M${firstX},${CHART_BOTTOM} ${points} L${lastX},${CHART_BOTTOM} Z`;
	}

	let _chartRafId = 0;
	let _cachedChartRect: DOMRect | null = null;

	function onPointerMove(event: PointerEvent) {
		if (timeline.length === 0) return;
		if (_chartRafId) return;
		_chartRafId = requestAnimationFrame(() => {
			_chartRafId = 0;
			if (!_cachedChartRect) {
				_cachedChartRect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
			}
			const mouseX = event.clientX - _cachedChartRect.left;
			const svgX = (mouseX / _cachedChartRect.width) * SVG_W;

			let closestIdx = 0;
			let minDistance = Infinity;
			for (let i = 0; i < timeline.length; i++) {
				const x = PAD_L + (timeline.length > 1 ? i / (timeline.length - 1) : 0.5) * CHART_W;
				const dist = Math.abs(x - svgX);
				if (dist < minDistance) {
					minDistance = dist;
					closestIdx = i;
				}
			}
			hoveredIndex = closestIdx;
		});
	}

	function onPointerLeave() {
		if (_chartRafId) { cancelAnimationFrame(_chartRafId); _chartRafId = 0; }
		_cachedChartRect = null;
		hoveredIndex = null;
	}


	function buildXLabels(tl: AnalyticsTimeline[]): Array<{ x: number; label: string }> {
		if (tl.length === 0) return [];
		return [
			...new Set([0, Math.floor(tl.length/4), Math.floor(tl.length/2), Math.floor(tl.length*0.75), tl.length - 1].filter((i) => i < tl.length))
		].map((i) => ({
			x: PAD_L + (tl.length > 1 ? i / (tl.length - 1) : 0.5) * CHART_W,
			label: formatDate(tl[i].date)
		}));
	}

	function buildYLabels(mn: number, mx: number): Array<{ y: number; label: string }> {
		return [1, 0.5, 0].map((fraction) => ({
			y: PAD_T + (1 - fraction) * CHART_H,
			label: formatNumber(Math.round(mn + (mx - mn) * fraction))
		}));
	}

	function sumRecord(record: Record<string, number> | undefined): number {
		if (!record) return 0;
		return (Object.values(record) as number[]).reduce((a: number, b: number) => a + b, 0);
	}

	async function loadAnalytics() {
		loadingStatus = 'loading';
		errorMsg = '';
		const result = await getPortfolioAnalytics(userId);
		if (result.ok && result.data) {
			analytics = result.data as ExtendedAnalytics;
			const tl = result.data.timeline || [];
			
			const getVal = (d: any) => d.count ?? d.views ?? 0;
			const mn = 0; 
			const mx = tl.length ? Math.max(...tl.map(getVal)) : 0;
			const paddedMx = mx === 0 ? 10 : mx + Math.ceil(mx * 0.1); 
			const rg = paddedMx - mn || 1;
			
			timeline = tl;
			minV = mn;
			maxV = paddedMx;
			range = rg;
			linePath = buildLinePath(tl, mn, rg);
			areaPath = buildAreaPath(tl, mn, rg);
			xLabels = buildXLabels(tl);
			yLabels = buildYLabels(mn, paddedMx);
			
			countryTotal = sumRecord(result.data.byCountry);
			sourceTotal = sumRecord(result.data.bySource);
			deviceTotal = sumRecord(result.data.byDevice);
			dayTotal = sumRecord(analytics.byDayOfWeek);
			
			loadingStatus = 'done';
		} else {
			errorMsg = result.error ?? 'Failed to load analytics';
			loadingStatus = 'error';
		}
	}

	onMount(loadAnalytics);

	function topEntries(record: Record<string, number> | undefined, limit = 5): Array<[string, number]> {
		if (!record) return [];
		return (Object.entries(record) as Array<[string, number]>)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit);
	}

	function pct(value: number, total: number): number {
		return total === 0 ? 0 : Math.round((value / total) * 100);
	}

	function formatDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		} catch {
			return iso;
		}
	}

	function formatNumber(n: number): string {
		if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
		return String(n);
	}

	function countryDisplayName(code: string): string {
		try {
			return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code;
		} catch {
			return code;
		}
	}

	const sourceLabels: Record<string, string> = {
		linkedin: 'LinkedIn',
		google: 'Google',
		twitter: 'Twitter / X',
		github: 'GitHub',
		direct: 'Direct',
		other: 'Other'
	};

	const deviceLabels: Record<string, string> = {
		mobile: 'Mobile',
		desktop: 'Desktop',
		tablet: 'Tablet',
		other: 'Other'
	};
	
	function formatHour(h: number | string): string {
	    const hr = Number(h);
	    if (hr === 0) return '12 AM';
	    if (hr === 12) return '12 PM';
	    return hr > 12 ? `${hr - 12} PM` : `${hr} AM`;
	}

    function focusOnMount(node: HTMLElement) {
        node.focus();
        return { destroy() {} };
    }

    function getDayCount(day: string, record: Record<string, number> | undefined): number {
        if (!record) return 0;
        // Try exact match, then short version, case-insensitive
        const dayLower = day.toLowerCase();
        const dayShort = day.substring(0, 3).toLowerCase();
        for (const [key, val] of Object.entries(record)) {
            const kl = key.toLowerCase();
            if (kl === dayLower || kl === dayShort || kl.startsWith(dayShort)) return val;
        }
        return 0;
    }
</script>

<svelte:head>
	<title>Analytics — AIfolio</title>
</svelte:head>

<!-- Expanded Chart Modal -->
{#if isChartExpanded && timeline.length > 0}
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="chart-modal-title"
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-8"
		transition:fade={{ duration: 200 }}
		onkeydown={(e) => { if (e.key === 'Escape') isChartExpanded = false; }}
	>
		<div class="relative w-full max-w-6xl rounded-[2.5rem] bg-white p-6 shadow-2xl sm:p-10" transition:scale={{ start: 0.95, duration: 250, easing: cubicOut }}>
			<div class="mb-8 flex items-center justify-between">
				<div>
					<h2 id="chart-modal-title" class="font-serif text-3xl font-bold text-slate-900">Traffic Over Time</h2>
					<p class="mt-1 text-slate-500">A detailed view of your portfolio's historical performance. Hover points for counts.</p>
				</div>
				<button use:focusOnMount onclick={() => isChartExpanded = false} aria-label="Close chart" class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="w-full">
				{@render chartSvg("h-[50vh] min-h-[400px]")}
			</div>
		</div>
	</div>
{/if}

{#snippet chartSvg(cssClass: string)}
	<svg
		viewBox="0 0 {SVG_W} {SVG_H}"
		width="100%"
		height="100%"
		class="{cssClass} cursor-crosshair touch-none"
		preserveAspectRatio="none"
		aria-label="Portfolio views over time"
		onpointermove={onPointerMove}
		onpointerleave={onPointerLeave}
	>
		<defs>
			<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#0f172a" stop-opacity="0.15" />
				<stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
			</linearGradient>
			<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
				<circle cx="2" cy="2" r="1" fill="#f1f5f9" />
			</pattern>
		</defs>

		<rect width="100%" height="100%" fill="url(#grid)" />

		{#each yLabels as { y }}
			<line x1={PAD_L} y1={y} x2={SVG_W - PAD_R} y2={y} stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4" />
		{/each}

		<path d={areaPath} fill="url(#areaGrad)" />
		<path d={linePath} fill="none" stroke="#0f172a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />

		{#if hoveredIndex !== null}
			{@const d = timeline[hoveredIndex]}
			{@const x = PAD_L + (timeline.length > 1 ? hoveredIndex / (timeline.length - 1) : 0.5) * CHART_W}
			{@const val = (d as any).count ?? d.views ?? 0}
			{@const y = CHART_BOTTOM - ((val - minV) / range) * CHART_H}
			<line x1={x} y1={PAD_T} x2={x} y2={CHART_BOTTOM} stroke="#0f172a" stroke-width="1" stroke-dasharray="4 4" />
			<circle cx={x} cy={y} r="6" fill="#0f172a" stroke="white" stroke-width="2" />
			<g transform="translate({x > SVG_W - 130 ? x - 130 : x + 10}, {y > 50 ? y - 45 : y + 10})">
				<rect width="120" height="45" rx="8" fill="#0f172a" />
				<text x="10" y="20" fill="white" font-size="14" font-weight="bold">{val.toLocaleString()} views</text>
				<text x="10" y="36" fill="#94a3b8" font-size="11">{formatDate(d.date)}</text>
			</g>
		{/if}

		<line x1={PAD_L} y1={CHART_BOTTOM} x2={SVG_W - PAD_R} y2={CHART_BOTTOM} stroke="#cbd5e1" stroke-width="2" />

		{#each xLabels as { x, label }}
			<text x={x} y={SVG_H - 12} text-anchor="middle" font-size="12" fill="#64748b" font-weight="600" class="select-none">{label}</text>
		{/each}

		{#each yLabels as { y, label }}
			<text x={PAD_L - 10} {y} text-anchor="end" dominant-baseline="middle" font-size="12" fill="#64748b" font-weight="600" class="select-none">{label}</text>
		{/each}
	</svg>
{/snippet}

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<AppHeader />

	<main class="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
		<div use:reveal class="mb-6">
			<a href="/app/dashboard" class="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
				Back
			</a>
			<h1 class="font-serif text-3xl font-bold tracking-tight text-slate-900">Portfolio Analytics</h1>
		</div>

		{#if loadingStatus === 'loading'}
			<LoadingState size="lg" message="Loading metrics…" />
		{:else if loadingStatus === 'error'}
			<div class="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">
				<p class="text-xl font-serif font-bold text-slate-900">Failed to load analytics</p>
				<p class="mt-2 text-slate-500">{errorMsg}</p>
				<button onclick={loadAnalytics} class="mt-6 rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 shadow-lg">Retry</button>
			</div>
		{:else if analytics}
			<!-- Primary Stats -->
			<div use:reveal={{ delay: 60 }} class="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4 xl:grid-cols-6">
				{#each [
					{ label: 'Total Views', value: analytics.totalViews.toLocaleString(), icon: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' },
					{ label: 'Last 30 Days', value: analytics.last30Days.toLocaleString(), icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
					{ label: 'Last 7 Days', value: analytics.last7Days.toLocaleString(), icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
					{ label: 'Unique Visitors', value: (analytics.uniqueVisitors ?? 0).toLocaleString(), icon: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z' },
                    { label: 'Speed (TTFB)', value: analytics.avgTtfb ? `${Math.round(analytics.avgTtfb * 1000)}ms` : '–', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
                    { label: 'Cache Hit', value: analytics.cacheHitRate ? `${analytics.cacheHitRate}%` : '–', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387' }
				] as stat}
					<div class="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-slate-900" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d={stat.icon} />
							</svg>
						</div>
						<div>
							<p class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{stat.label}</p>
							<p class="font-serif text-xl font-bold text-slate-900">{stat.value}</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <!-- Main Timeline -->
                <div use:reveal={{ delay: 120 }} class="lg:col-span-2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <div class="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
						<div>
							<h2 class="font-serif text-xl font-bold text-slate-900">Traffic Over Time</h2>
							<p class="text-xs text-slate-500 mt-0.5">Daily view trends.</p>
						</div>
						<button onclick={() => isChartExpanded = true} aria-label="Expand chart" class="h-11 w-11 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 text-slate-400">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
							</svg>
						</button>
                    </div>
                    <div class="flex-1 min-h-[200px] flex flex-col justify-center">
                        {#if timeline.length === 0}
                            <p class="text-slate-400 text-sm italic text-center">No data available for timeline.</p>
                        {:else}
							{@render chartSvg("max-h-64")}
                        {/if}
                    </div>
                </div>

                <!-- Engagement -->
                <div use:reveal={{ delay: 150 }} class="rounded-[2rem] bg-slate-900 p-6 shadow-xl flex flex-col text-white justify-between relative overflow-hidden">
					<div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10 mb-6">
                        <h2 class="font-serif text-xl font-bold">Engagement</h2>
                        <p class="text-slate-400 text-xs">Peak activity periods.</p>
                    </div>

                    <div class="space-y-4 relative z-10">
                        {#if analytics.byDayOfWeek}
                            {@const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                            {@const dayVals = weekDays.map(d => getDayCount(d, analytics?.byDayOfWeek))}
                            {@const peakVal = Math.max(...dayVals, 1)}
                            {@const svgW = 200}
                            {@const svgH = 60}
                            {@const pad = 10}
                            {@const chartW = svgW - (pad * 2)}
                            {@const chartH = svgH - (pad * 2)}
                            
                            {@const points = dayVals.map((v, i) => ({
                                x: pad + (i * (chartW / 6)),
                                y: (svgH - pad) - ((v / peakVal) * chartH),
                                val: v,
                                day: weekDays[i]
                            }))}
                            
                            {@const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')}
                            {@const areaD = `${lineD} L${points[6].x},${svgH} L${points[0].x},${svgH} Z`}

                            <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div class="flex items-center justify-between mb-3">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Activity</p>
                                    <span class="text-[10px] font-bold text-emerald-400 uppercase">Trends</span>
                                </div>
                                
                                <div class="relative h-16 w-full">
                                    <svg viewBox="0 0 {svgW} {svgH}" width="100%" height="100%" preserveAspectRatio="none" class="overflow-visible">
                                        <defs>
                                            <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stop-color="#34d399" stop-opacity="0.2" />
                                                <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d={areaD} fill="url(#weekGrad)" />
                                        <path d={lineD} fill="none" stroke="#34d399" stroke-width="2" stroke-linejoin="round" />
                                        
                                        {#each points as p}
                                            {@const isPeak = p.val === peakVal && p.val > 0}
                                            <g class="group/pt">
                                                <circle cx={p.x} cy={p.y} r={isPeak ? 3 : 2} fill={isPeak ? "#34d399" : "#475569"} class="transition-all group-hover/pt:r-4 group-hover/pt:fill-white" />
                                                <title>{p.day}: {p.val} views</title>
                                            </g>
                                        {/each}
                                    </svg>
                                </div>
                                
                                <div class="flex justify-between mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                    {#each weekDays as day}
                                        <span>{day.charAt(0)}</span>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        {#if analytics.byHour}
                            {@const hourVals = Object.values(analytics.byHour)}
                            {@const peakHVal = Math.max(...hourVals, 1)}
                            <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Daily Pulse (24h)</p>
                                <div class="flex items-end justify-between gap-[1px] h-12">
                                    {#each Array.from({length: 24}, (_, i) => i.toString()) as hour}
                                        {@const count = analytics?.byHour?.[hour] ?? 0}
                                        {@const isPeak = count === peakHVal && count > 0}
                                        <div class="flex-1 {isPeak ? 'bg-emerald-400' : 'bg-slate-700/50'} rounded-t-[1px] relative group transition-all hover:bg-emerald-400" style="height: {Math.max((count / peakHVal) * 100, 5)}%">
                                            <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">{formatHour(hour)}: {count}</div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Versions Insights -->
            <div use:reveal={{ delay: 160 }} class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center flex flex-col justify-center">
                    <p class="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Total Versions</p>
                    <p class="font-serif text-5xl font-bold text-slate-900">{Object.keys(analytics.byVersion ?? {}).length}</p>
                </div>

                <div class="md:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col">
                    <div class="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                        <h2 class="font-serif text-xl font-bold text-slate-900">Version Performance</h2>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
                    </div>
                    {#if analytics.byVersion && Object.keys(analytics.byVersion).length > 0}
                        <div class="space-y-4 max-h-[160px] md:max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                            {#each Object.entries(analytics.byVersion).sort((a, b) => b[1] - a[1]) as [version, count]}
                                <div class="flex items-center gap-4 group">
                                    <span class="w-12 text-xs font-bold text-slate-900 uppercase group-hover:text-emerald-600 transition-colors">{version}</span>
                                    <div class="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                                        <div class="h-full bg-slate-900 group-hover:bg-emerald-500 transition-all duration-1000" style="width: {pct(count, analytics.totalViews)}%"></div>
                                    </div>
                                    <span class="w-24 text-right text-xs font-bold text-slate-500">{count.toLocaleString()} views</span>
                                    <span class="w-12 text-right text-xs font-bold text-slate-400">{pct(count, analytics.totalViews)}%</span>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-sm font-medium text-slate-400 text-center py-4 italic">No version data yet.</p>
                    {/if}
                </div>
            </div>

            <!-- Detailed Breakdowns -->
			<div use:reveal={{ delay: 180 }} class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-3">
				<!-- By Country -->
				<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
					<h2 class="mb-6 font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">By Country</h2>
					{#if countryTotal === 0}
						<p class="text-sm font-medium text-slate-400 py-4 text-center">No data yet.</p>
					{:else}
						<ul class="space-y-4">
							{#each topEntries(analytics.byCountry) as [code, count]}
								<li>
									<div class="mb-2 flex items-center justify-between text-sm">
										<span class="font-bold text-slate-900 flex items-center gap-2">
											<span class="text-lg leading-none">{new Intl.DisplayNames(['en'], {type: 'region'}).of(code) !== code ? String.fromCodePoint(...code.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))) : '🌐'}</span>
											{countryDisplayName(code)}
										</span>
										<span class="font-bold text-slate-500">{pct(count, countryTotal)}%</span>
									</div>
									<div class="h-2 overflow-hidden rounded-full bg-slate-100">
										<div class="h-full rounded-full bg-slate-900 transition-all duration-1000" style="width: {pct(count, countryTotal)}%"></div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- By Source -->
				<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
					<h2 class="mb-6 font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">By Source</h2>
					{#if sourceTotal === 0}
						<p class="text-sm font-medium text-slate-400 py-4 text-center">No data yet.</p>
					{:else}
						<ul class="space-y-4">
							{#each topEntries(analytics.bySource) as [key, count]}
								<li>
									<div class="mb-2 flex items-center justify-between text-sm">
										<span class="font-bold text-slate-900 capitalize">
											{sourceLabels[key] ?? key}
										</span>
										<span class="font-bold text-slate-500">{pct(count, sourceTotal)}%</span>
									</div>
									<div class="h-2 overflow-hidden rounded-full bg-slate-100">
										<div class="h-full rounded-full bg-slate-900 transition-all duration-1000" style="width: {pct(count, sourceTotal)}%"></div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- By Device -->
				<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
					<h2 class="mb-6 font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">By Device</h2>
					{#if deviceTotal === 0}
						<p class="text-sm font-medium text-slate-400 py-4 text-center">No data yet.</p>
					{:else}
						<ul class="space-y-4">
							{#each topEntries(analytics.byDevice) as [key, count]}
								<li>
									<div class="mb-2 flex items-center justify-between text-sm">
										<span class="font-bold text-slate-900 flex items-center gap-2">
											{#if key === 'mobile'}
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 text-slate-400"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
											{:else if key === 'desktop'}
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 text-slate-400"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>
											{:else}
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 text-slate-400"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
											{/if}
											{deviceLabels[key] ?? key}
										</span>
										<span class="font-bold text-slate-500">{pct(count, deviceTotal)}%</span>
									</div>
									<div class="h-2 overflow-hidden rounded-full bg-slate-100">
										<div class="h-full rounded-full bg-slate-900 transition-all duration-1000" style="width: {pct(count, deviceTotal)}%"></div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
