<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { listSessions } from '$lib/services/interview';
	import type { SessionSummary } from '$lib/services/interview';
	import Spinner from '$lib/components/common/Spinner.svelte';

	let sessions = $state<SessionSummary[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state('');

	onMount(async () => {
		const result = await listSessions();
		if (result.success && result.data) {
			sessions = result.data.sessions;
		} else {
			errorMessage = result.error ?? 'Failed to load interview history.';
		}
		isLoading = false;
	});

	function formatDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		} catch { return ''; }
	}

	function scoreColor(score: number): string {
		if (score >= 7) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
		if (score >= 4) return 'text-amber-700 bg-amber-50 border-amber-100';
		return 'text-red-600 bg-red-50 border-red-100';
	}

	function statusLabel(s: SessionSummary): string {
		if (s.status === 'completed') return 'Completed';
		if (s.status === 'active') return 'In Progress';
		return s.status;
	}
</script>

<svelte:head>
	<title>Interview History — Portfolio.ai</title>
</svelte:head>

<div class="min-h-screen bg-surface-subtle pb-20">
	<header class="border-b border-surface-muted bg-white px-6 py-5">
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<div>
				<h1 class="font-display text-2xl font-bold text-ink">Interview History</h1>
				<p class="mt-0.5 text-sm text-ink-muted">All your past practice sessions</p>
			</div>
			<div class="flex gap-3">
				<button
					onclick={() => goto('/app/interview/setup')}
					class="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white transition-all hover:bg-brand-dark"
				>
					New Interview
				</button>
				<button
					onclick={() => goto('/app/dashboard')}
					class="rounded-xl border border-surface-muted px-4 py-2 text-sm font-bold text-ink-soft transition-all hover:border-brand/40 hover:text-ink"
				>
					← Dashboard
				</button>
			</div>
		</div>
	</header>

	<main class="mx-auto w-full max-w-4xl px-6 py-10">
		{#if isLoading}
			<div class="flex items-center justify-center py-24">
				<Spinner size="lg" />
			</div>
		{:else if errorMessage}
			<div role="alert" class="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600">
				⚠️ {errorMessage}
			</div>
		{:else if sessions.length === 0}
			<div class="flex flex-col items-center justify-center py-24 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-muted bg-white text-2xl shadow-sm">
					🎤
				</div>
				<h2 class="text-lg font-bold text-ink">No interviews yet</h2>
				<p class="mt-1 text-sm text-ink-muted">Start your first practice session to see results here.</p>
				<button
					onclick={() => goto('/app/interview/setup')}
					class="mt-6 rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-dark"
				>
					Start Interview
				</button>
			</div>
		{:else}
			<div class="space-y-3">
				{#each sessions as session (session.sessionId)}
					{@const isComplete = session.status === 'completed'}
					<button
						onclick={() => isComplete && goto(`/app/interview/${session.sessionId}/report`)}
						disabled={!isComplete}
						class="group w-full rounded-2xl border border-surface-muted bg-white p-5 text-left shadow-sm transition-all hover:border-brand/30 hover:shadow-md disabled:cursor-default disabled:opacity-70"
					>
						<div class="flex items-start gap-4">
							<!-- Score or status badge -->
							<div class="flex-shrink-0 pt-0.5">
								{#if isComplete && session.overallScore != null}
									<span class="inline-flex items-baseline gap-0.5 rounded-xl border px-3 py-1.5 text-lg font-black {scoreColor(session.overallScore)}">
										{session.overallScore}
										<span class="text-xs font-bold opacity-60">/10</span>
									</span>
								{:else}
									<span class="inline-flex items-center rounded-xl border border-surface-muted bg-surface-subtle px-3 py-1.5 text-xs font-bold text-ink-muted">
										{statusLabel(session)}
									</span>
								{/if}
							</div>

							<!-- Details -->
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-2 mb-1.5">
									<span class="text-sm font-bold text-ink">
										{session.roleInfo || (session.source === 'resume' ? 'Resume-based' : 'General')}
									</span>
									<span class="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
										{session.mode === 'follow-up' ? 'Adaptive' : 'Standard'}
									</span>
									<span class="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
										{session.difficulty}
									</span>
								</div>
								<p class="text-xs text-ink-muted">
									{session.questionsAnswered} / {session.totalQuestions} questions ·
									{formatDate(session.createdAt)}
								</p>
								{#if isComplete && Object.keys(session.topicScores).length > 0}
									<div class="mt-2.5 flex flex-wrap gap-1.5">
										{#each Object.entries(session.topicScores).sort((a, b) => Number(b[1]) - Number(a[1])) as [topic, score]}
											<span class="inline-flex items-center gap-1 rounded-lg border border-surface-muted bg-surface-subtle px-2 py-0.5 text-[10px] font-bold text-ink-soft">
												{topic}
												<span class="font-black text-ink">{score}</span>
											</span>
										{/each}
									</div>
								{/if}
							</div>

							{#if isComplete}
								<span class="flex-shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100">→</span>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</main>
</div>
