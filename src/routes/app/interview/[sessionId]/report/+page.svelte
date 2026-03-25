<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getReport } from '$lib/services/interview';
	import type { InterviewReport } from '$lib/services/interview';
	import { reveal } from '$lib/actions/animate';
	import Spinner from '$lib/components/common/Spinner.svelte';

	const sessionId = $derived($page.params.sessionId);

	let report = $state<InterviewReport | null>(null);
	let sessionMeta = $state<{ mode: string; difficulty: string; createdAt: string } | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state('');

	onMount(async () => {
		const result = await getReport(sessionId);
		if (result.success && result.data) {
			report = result.data.report;
			sessionMeta = {
				mode: result.data.mode,
				difficulty: result.data.difficulty,
				createdAt: result.data.createdAt,
			};
		} else {
			errorMessage = result.error ?? 'Failed to load report.';
		}
		isLoading = false;
	});

	function formatDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString('en-US', {
				month: 'short', day: 'numeric', year: 'numeric',
			});
		} catch {
			return '';
		}
	}

	function pad(n: number): string {
		return n.toString().padStart(2, '0');
	}

	function scoreLabel(score: number): string {
		if (score >= 8) return 'Excellent';
		if (score >= 6) return 'Good';
		if (score >= 4) return 'Fair';
		return 'Needs Work';
	}

	// Sorted topics: highest → lowest
	const sortedTopics = $derived(
		report
			? Object.entries(report.topicScores).sort((a, b) => Number(b[1]) - Number(a[1]))
			: []
	);

	const bestTopic = $derived(sortedTopics.length > 0 ? sortedTopics[0] : null);
	const weakestTopic = $derived(sortedTopics.length > 1 ? sortedTopics[sortedTopics.length - 1] : null);
</script>

<svelte:head>
	<title>Interview Report — AIfolio</title>
</svelte:head>

<div class="min-h-screen bg-surface-subtle pb-20">
	<!-- Header -->
	<header class="border-b border-slate-100 bg-white px-6 py-5">
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<div>
				<h1 class="font-serif text-2xl font-bold text-slate-900">Interview Report</h1>
				{#if sessionMeta}
					<p class="mt-0.5 text-sm text-slate-400">
						{sessionMeta.mode === 'follow-up' ? 'Adaptive' : 'Standard'} ·
						{sessionMeta.difficulty.charAt(0).toUpperCase() + sessionMeta.difficulty.slice(1)} ·
						{formatDate(sessionMeta.createdAt)}
					</p>
				{/if}
			</div>
			<button
				onclick={() => goto('/app/dashboard')}
				class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:border-slate-400 hover:text-slate-900"
			>
				← Dashboard
			</button>
		</div>
	</header>

	<main class="mx-auto w-full max-w-4xl px-6 py-10">
		{#if isLoading}
			<div class="flex items-center justify-center py-24">
				<Spinner size="lg" />
			</div>
		{:else if errorMessage}
			<div role="alert" class="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600">
				<span class="mr-2" aria-hidden="true">⚠️</span>{errorMessage}
			</div>
		{:else if report}
			<div use:reveal={{ y: 16, delay: 50 }} class="space-y-6">

				<!-- ── Hero score card (dark) ── -->
				<div class="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl">
					<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
						<!-- Score -->
						<div class="flex items-end gap-3">
							<span class="text-8xl font-black leading-none tracking-tight">{report.overallScore}</span>
							<div class="mb-2">
								<span class="text-3xl font-bold text-slate-400">/10</span>
								<p class="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400">Overall Score</p>
							</div>
						</div>

						<!-- Divider on desktop -->
						<div class="hidden h-20 w-px bg-slate-700 sm:block"></div>

						<!-- Stats grid -->
						<div class="grid grid-cols-2 gap-4 sm:gap-6">
							<div>
								<p class="text-2xl font-black">{report.totalAnswered}</p>
								<p class="text-xs font-medium text-slate-400">Questions answered</p>
							</div>
							{#if sessionMeta}
								<div>
									<p class="text-2xl font-black capitalize">{sessionMeta.difficulty}</p>
									<p class="text-xs font-medium text-slate-400">Difficulty</p>
								</div>
								<div>
									<p class="text-2xl font-black">{sessionMeta.mode === 'follow-up' ? 'Adaptive' : 'Standard'}</p>
									<p class="text-xs font-medium text-slate-400">Mode</p>
								</div>
								<div>
									<p class="text-lg font-black">{formatDate(sessionMeta.createdAt)}</p>
									<p class="text-xs font-medium text-slate-400">Date</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Score bar + topic highlights -->
					<div class="mt-6 space-y-4 border-t border-slate-700 pt-5">
						<div class="flex items-center gap-3">
							<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
								<div
									class="h-full rounded-full bg-white transition-all duration-700"
									style="width: {(report.overallScore / 10) * 100}%"
								></div>
							</div>
							<span class="text-xs font-bold tracking-widest uppercase text-slate-300">{scoreLabel(report.overallScore)}</span>
						</div>

						{#if bestTopic || weakestTopic}
							<div class="flex flex-wrap gap-2">
								{#if bestTopic}
									<span class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
										<span class="text-slate-300">Best</span>
										{bestTopic[0]}
										<span class="ml-0.5 rounded bg-white/20 px-1 font-black">{bestTopic[1]}</span>
									</span>
								{/if}
								{#if weakestTopic}
									<span class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
										<span class="text-slate-300">Focus</span>
										{weakestTopic[0]}
										<span class="ml-0.5 rounded bg-white/20 px-1 font-black">{weakestTopic[1]}</span>
									</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<!-- ── Topic scores grid (sorted best → worst) ── -->
				{#if sortedTopics.length > 0}
					<div>
						<div class="mb-4 flex items-baseline gap-2">
							<h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase">Topic Breakdown</h2>
							<span class="text-xs text-slate-300">· scored out of 10</span>
						</div>
						<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{#each sortedTopics as [topic, score], i (topic)}
								<div class="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
									<!-- Rank chip + topic name -->
									<div class="mb-3 flex items-center justify-between">
										<p class="truncate text-xs font-bold tracking-wide text-slate-400 uppercase pr-2">{topic}</p>
										<span class="flex-shrink-0 text-[10px] font-black text-slate-200 tabular-nums">#{i + 1}</span>
									</div>
									<!-- Score number -->
									<p class="text-4xl font-black text-slate-900 leading-none">{score}</p>
									<!-- Bar -->
									<div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											class="h-full rounded-full bg-slate-900 transition-all duration-500"
											style="width: {(Number(score) / 10) * 100}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- ── Strengths & Weaknesses ── -->
				{#if report.strengths.length > 0 || report.weaknesses.length > 0}
					<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{#if report.strengths.length > 0}
							<div class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
								<div class="mb-5 flex items-center gap-3">
									<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-600 ring-1 ring-emerald-100">✓</div>
									<h2 class="text-xs font-bold tracking-widest text-slate-500 uppercase">What went well</h2>
								</div>
								<ul class="space-y-3">
									{#each report.strengths as s, i}
										<li class="flex items-start gap-3">
											<span class="mt-0.5 text-xs font-black text-slate-300 tabular-nums">{pad(i + 1)}</span>
											<span class="text-sm leading-relaxed text-slate-700">{s}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if report.weaknesses.length > 0}
							<div class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
								<div class="mb-5 flex items-center gap-3">
									<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xs font-black text-amber-600 ring-1 ring-amber-100">→</div>
									<h2 class="text-xs font-bold tracking-widest text-slate-500 uppercase">Areas to improve</h2>
								</div>
								<ul class="space-y-3">
									{#each report.weaknesses as w, i}
										<li class="flex items-start gap-3">
											<span class="mt-0.5 text-xs font-black text-slate-300 tabular-nums">{pad(i + 1)}</span>
											<span class="text-sm leading-relaxed text-slate-700">{w}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				{/if}

				<!-- ── Suggestions ── -->
				{#if report.suggestions.length > 0}
					<div class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
						<div class="mb-5 flex items-center gap-3">
							<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xs font-black text-slate-500 border border-slate-200">★</div>
							<div>
								<h2 class="text-xs font-bold tracking-widest text-slate-500 uppercase">Action Plan</h2>
								<p class="text-xs text-slate-400 mt-0.5">Focus on these to improve your score</p>
							</div>
						</div>
						<ul class="divide-y divide-slate-50">
							{#each report.suggestions as s, i}
								<li class="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
									<span class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">{i + 1}</span>
									<span class="text-sm leading-relaxed text-slate-700">{s}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- ── CTA ── -->
				<div class="flex flex-col gap-3 pt-2 sm:flex-row">
					<button
						onclick={() => goto('/app/interview/setup')}
						class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95"
					>
						Practice Again
					</button>
					<button
						onclick={() => goto('/app/dashboard')}
						class="flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-700 transition-all hover:border-slate-400 active:scale-95"
					>
						Go to Dashboard
					</button>
				</div>

			</div>
		{/if}
	</main>
</div>
