<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { getPortfolioAnalytics } from '$lib/services/portfolio';
	import { reveal } from '$lib/actions/animate';
	import type { PortfolioAnalytics, AnalyticsTimeline } from '$lib/types/portfolio';

	// $page.params are string | undefined at the TypeScript level; the route
	// guarantees userId is always present at runtime.
	const userId: string = $derived($page.params.userId ?? '');

	// Ownership guard — only the portfolio owner can view their analytics
	$effect(() => {
		const authUser = $authStore.user;
		if (!$authStore.loading && authUser && authUser.userId !== userId) {
			goto('/app/dashboard');
		}
	});

	let analytics: PortfolioAnalytics | null = $state(null);
	let loadingStatus: 'loading' | 'error' | 'done' = $state('loading');
	let errorMsg = $state('');

	// ── SVG chart constants ────────────────────────────────────────────────────
	const PAD_L = 48;
	const PAD_R = 16;
	const PAD_T = 12;
	const PAD_B = 32;
	const SVG_W = 600;
	const SVG_H = 160;
	const CHART_W = SVG_W - PAD_L - PAD_R; // 536
	const CHART_H = SVG_H - PAD_T - PAD_B; // 116
	const CHART_BOTTOM = SVG_H - PAD_B; // 128

	// ── Chart state (populated in loadAnalytics) ───────────────────────────────
	// Avoid $derived on `analytics` — Svelte 5 compiles $state(null) such that
	// TypeScript infers the literal `null` type, causing property access in
	// $derived to resolve to `never`. Compute eagerly in loadAnalytics instead.
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

	// ── Pure chart computation helpers ────────────────────────────────────────
	function buildLinePath(tl: AnalyticsTimeline[], mn: number, rg: number): string {
		return tl
			.map((d, i) => {
				const n = tl.length;
				const x = PAD_L + (n > 1 ? i / (n - 1) : 0.5) * CHART_W;
				const y = CHART_BOTTOM - ((d.views - mn) / rg) * CHART_H;
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
				const y = CHART_BOTTOM - ((d.views - mn) / rg) * CHART_H;
				return `L${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');
		return `M${firstX},${CHART_BOTTOM} ${points} L${lastX},${CHART_BOTTOM} Z`;
	}

	function buildXLabels(tl: AnalyticsTimeline[]): Array<{ x: number; label: string }> {
		if (tl.length === 0) return [];
		return [
			...new Set([0, 15, 30, 45, 60, 75, tl.length - 1].filter((i) => i < tl.length))
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

	function sumRecord(record: Record<string, number>): number {
		return (Object.values(record) as number[]).reduce((a: number, b: number) => a + b, 0);
	}

	// ── Load + compute ────────────────────────────────────────────────────────
	async function loadAnalytics() {
		loadingStatus = 'loading';
		errorMsg = '';
		const result = await getPortfolioAnalytics(userId);
		if (result.ok && result.data) {
			analytics = result.data;
			const tl = result.data.timeline;
			const mn = tl.length ? Math.min(...tl.map((d) => d.views)) : 0;
			const mx = tl.length ? Math.max(...tl.map((d) => d.views)) : 0;
			const rg = mx - mn || 1;
			timeline = tl;
			minV = mn;
			maxV = mx;
			range = rg;
			linePath = buildLinePath(tl, mn, rg);
			areaPath = buildAreaPath(tl, mn, rg);
			xLabels = buildXLabels(tl);
			yLabels = buildYLabels(mn, mx);
			countryTotal = sumRecord(result.data.byCountry);
			sourceTotal = sumRecord(result.data.bySource);
			deviceTotal = sumRecord(result.data.byDevice);
			loadingStatus = 'done';
		} else {
			errorMsg = result.error ?? 'Failed to load analytics';
			loadingStatus = 'error';
		}
	}

	onMount(loadAnalytics);

	// ── Display helpers ────────────────────────────────────────────────────────
	function topEntries(record: Record<string, number>, limit = 5): Array<[string, number]> {
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
</script>

<svelte:head>
	<title>Analytics — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#F5F3FF]">
	<!-- Header -->
	<header class="sticky top-0 z-10 border-b border-gray-100 bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="/" class="font-serif text-xl font-bold">
				<span class="gradient-text">AI</span><span class="text-[#1E1033]">folio</span>
			</a>
			{#if $authStore.user}
				<div class="flex items-center gap-3">
					<div
						class="gradient-bg flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
					>
						{$authStore.user.name
							.split(' ')
							.slice(0, 2)
							.map((n) => n[0]?.toUpperCase() ?? '')
							.join('')}
					</div>
					<span class="hidden text-sm font-medium text-[#1E1033] sm:block">
						{$authStore.user.name}
					</span>
				</div>
			{/if}
		</div>
	</header>

	<main class="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
		<!-- Page title -->
		<div use:reveal class="mb-8">
			<a
				href="/app/dashboard"
				class="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1E1033]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
				Back to Dashboard
			</a>
			<h1 class="font-serif text-3xl font-bold text-[#1E1033]">Portfolio Analytics</h1>
			<p class="mt-1 text-[#4B5563]">See who's viewing your portfolio and where they're coming from.</p>
		</div>

		{#if loadingStatus === 'loading'}
			<div class="flex items-center gap-2 py-12 text-sm text-[#4B5563]">
				<svg class="h-4 w-4 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				Loading analytics…
			</div>
		{:else if loadingStatus === 'error'}
			<div class="rounded-2xl bg-red-50 px-6 py-8 text-center ring-1 ring-red-200">
				<p class="text-sm font-medium text-red-700">{errorMsg}</p>
				<button
					onclick={loadAnalytics}
					class="mt-4 rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
				>
					Retry
				</button>
			</div>
		{:else if analytics}
			<!-- Stats row -->
			<div use:reveal={{ delay: 60 }} class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{#each [
					{ label: 'Total Views', value: analytics.totalViews.toLocaleString(), icon: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
					{ label: 'Last 7 Days', value: analytics.last7Days.toLocaleString(), icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
					{ label: 'Last 30 Days', value: analytics.last30Days.toLocaleString(), icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' }
				] as stat}
					<div class="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl {stat.iconBg}"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6 {stat.iconColor}"
							>
								{#each stat.icon.split(' M ').filter(Boolean) as _, i}
									{#if i === 0}
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d={stat.icon.split(' M ')[0]}
										/>
									{:else}
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d={'M ' + stat.icon.split(' M ')[i]}
										/>
									{/if}
								{/each}
							</svg>
						</div>
						<div>
							<p class="text-xs font-medium uppercase tracking-wide text-[#4B5563]">{stat.label}</p>
							<p class="mt-0.5 font-serif text-2xl font-bold text-[#1E1033]">{stat.value}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- 90-day timeline chart -->
			<div
				use:reveal={{ delay: 120 }}
				class="mb-6 overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
			>
				<h2 class="mb-4 text-sm font-semibold text-[#1E1033]">90-Day View Timeline</h2>
				{#if timeline.length === 0}
					<p class="py-8 text-center text-sm text-[#9CA3AF]">No data yet.</p>
				{:else}
					<svg
						viewBox="0 0 {SVG_W} {SVG_H}"
						width="100%"
						height="160"
						preserveAspectRatio="none"
						aria-label="Portfolio views over the last 90 days"
					>
						<defs>
							<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#6D28D9" stop-opacity="0.25" />
								<stop offset="100%" stop-color="#6D28D9" stop-opacity="0" />
							</linearGradient>
						</defs>

						<!-- Horizontal grid lines -->
						{#each yLabels as { y }}
							<line
								x1={PAD_L}
								y1={y}
								x2={SVG_W - PAD_R}
								y2={y}
								stroke="#E5E7EB"
								stroke-width="1"
							/>
						{/each}

						<!-- Area fill -->
						<path d={areaPath} fill="url(#areaGrad)" />

						<!-- Line -->
						<path d={linePath} fill="none" stroke="#6D28D9" stroke-width="2" stroke-linejoin="round" />

						<!-- Data point dots (only render if ≤ 30 points to avoid clutter) -->
						{#if timeline.length <= 30}
							{#each timeline as d, i}
								{@const n = timeline.length}
								{@const cx = PAD_L + (n > 1 ? i / (n - 1) : 0.5) * CHART_W}
								{@const cy = CHART_BOTTOM - ((d.views - minV) / range) * CHART_H}
								<circle {cx} {cy} r="3" fill="#6D28D9" />
							{/each}
						{/if}

						<!-- X-axis baseline -->
						<line
							x1={PAD_L}
							y1={CHART_BOTTOM}
							x2={SVG_W - PAD_R}
							y2={CHART_BOTTOM}
							stroke="#D1D5DB"
							stroke-width="1"
						/>

						<!-- X-axis labels -->
						{#each xLabels as { x, label }}
							<text
								x={x}
								y={SVG_H - 8}
								text-anchor="middle"
								font-size="10"
								fill="#9CA3AF"
								font-family="Inter, sans-serif">{label}</text
							>
						{/each}

						<!-- Y-axis labels -->
						{#each yLabels as { y, label }}
							<text
								x={PAD_L - 6}
								{y}
								text-anchor="end"
								dominant-baseline="middle"
								font-size="10"
								fill="#9CA3AF"
								font-family="Inter, sans-serif">{label}</text
							>
						{/each}
					</svg>
				{/if}
			</div>

			<!-- Breakdown grid -->
			<div use:reveal={{ delay: 180 }} class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<!-- By Country -->
				<div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 class="mb-4 text-sm font-semibold text-[#1E1033]">By Country</h2>
					{#if countryTotal === 0}
						<p class="text-sm text-[#9CA3AF]">No data yet.</p>
					{:else}
						<ul class="space-y-3">
							{#each topEntries(analytics.byCountry) as [code, count]}
								<li>
									<div class="mb-1 flex items-center justify-between text-sm">
										<span class="font-medium text-[#1E1033]">{countryDisplayName(code)}</span>
										<span class="text-[#4B5563]">{pct(count, countryTotal)}%</span>
									</div>
									<div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
										<div
											class="h-full rounded-full bg-violet-500"
											style="width: {pct(count, countryTotal)}%"
										></div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- By Source -->
				<div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 class="mb-4 text-sm font-semibold text-[#1E1033]">By Source</h2>
					{#if sourceTotal === 0}
						<p class="text-sm text-[#9CA3AF]">No data yet.</p>
					{:else}
						<ul class="space-y-3">
							{#each topEntries(analytics.bySource) as [key, count]}
								<li>
									<div class="mb-1 flex items-center justify-between text-sm">
										<span class="font-medium text-[#1E1033]"
											>{sourceLabels[key] ?? key}</span
										>
										<span class="text-[#4B5563]">{pct(count, sourceTotal)}%</span>
									</div>
									<div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
										<div
											class="h-full rounded-full bg-blue-500"
											style="width: {pct(count, sourceTotal)}%"
										></div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- By Device -->
				<div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 class="mb-4 text-sm font-semibold text-[#1E1033]">By Device</h2>
					{#if deviceTotal === 0}
						<p class="text-sm text-[#9CA3AF]">No data yet.</p>
					{:else}
						<ul class="space-y-3">
							{#each topEntries(analytics.byDevice) as [key, count]}
								<li>
									<div class="mb-1 flex items-center justify-between text-sm">
										<span class="font-medium text-[#1E1033]">{deviceLabels[key] ?? key}</span>
										<span class="text-[#4B5563]">{pct(count, deviceTotal)}%</span>
									</div>
									<div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
										<div
											class="h-full rounded-full bg-emerald-500"
											style="width: {pct(count, deviceTotal)}%"
										></div>
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
