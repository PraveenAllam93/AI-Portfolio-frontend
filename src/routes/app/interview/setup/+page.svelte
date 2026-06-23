<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { startInterview } from '$lib/services/interview';
	import type { Difficulty, InterviewMode, InterviewSource } from '$lib/services/interview';
	import { listPortfolios, type PortfolioSummary } from '$lib/services/portfolio';
	import { authStore } from '$lib/stores/auth';
	import { reveal } from '$lib/actions/animate';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import AppHeader from '$lib/components/common/AppHeader.svelte';

	let difficulty = $state<Difficulty>('medium');
	let totalQuestions = $state<7 | 15 | 25>(15);
	let mode = $state<InterviewMode>('non-follow-up');
	let source = $state<InterviewSource>('resume');
	let roleInfo = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	// Portfolio selection — lets the user pick which resume/portfolio to base
	// questions on when they have more than one.
	let portfolios = $state<PortfolioSummary[]>([]);
	let selectedUploadId = $state<string>('');
	let portfoliosLoading = $state(true);

	onMount(async () => {
		const userId = $authStore.user?.userId;
		if (!userId) {
			portfoliosLoading = false;
			return;
		}
		const result = await listPortfolios(userId);
		if (result.ok && result.data?.portfolios) {
			portfolios = [...result.data.portfolios].sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			// Default to the most recent portfolio.
			selectedUploadId = portfolios[0]?.uploadId ?? '';
		}
		portfoliosLoading = false;
	});

	function portfolioLabel(p: PortfolioSummary): string {
		const category = (p.category || 'Portfolio')
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
		const template = (p.templateId || '')
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
		return template ? `${category} · ${template}` : category;
	}

	function formatDate(iso: string): string {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	async function handleStart(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';

		if (source === 'role' && !roleInfo.trim()) {
			errorMessage = 'Please enter a job role or description.';
			return;
		}

		if (source === 'resume' && !portfoliosLoading && portfolios.length === 0) {
			errorMessage = 'No portfolio found. Upload a resume first, or choose "Job Role" as the source.';
			return;
		}

		isLoading = true;
		const result = await startInterview({
			difficulty,
			totalQuestions,
			mode,
			source,
			roleInfo: roleInfo.trim() || undefined,
			uploadId: source === 'resume' && selectedUploadId ? selectedUploadId : undefined,
		});

		if (result.success && result.data) {
			await goto(`/app/interview/${result.data.sessionId}`, {
				state: {
					question: result.data.question,
					questionNumber: result.data.questionNumber,
					totalQuestions: result.data.totalQuestions,
					topic: result.data.topic,
				},
			});
		} else {
			errorMessage = result.error ?? 'Failed to start interview. Please try again.';
			isLoading = false;
		}
	}

	const difficultyOptions: { value: Difficulty; label: string; desc: string }[] = [
		{ value: 'easy', label: 'Easy', desc: 'Fundamentals and basic concepts' },
		{ value: 'medium', label: 'Medium', desc: 'Balanced depth and breadth' },
		{ value: 'hard', label: 'Hard', desc: 'Advanced topics and edge cases' },
		{ value: 'mix', label: 'Mix', desc: 'Variety across all levels' },
	];

	const questionCountOptions: { value: 7 | 15 | 25; label: string; desc: string }[] = [
		{ value: 7, label: '7', desc: 'Quick check (~10 min)' },
		{ value: 15, label: '15', desc: 'Standard session (~20 min)' },
		{ value: 25, label: '25', desc: 'Full interview (~35 min)' },
	];
</script>

<svelte:head>
	<title>Interview Setup — Portfolio.ai</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<AppHeader>
		<a href="/app/dashboard" class="text-sm font-medium text-ink-soft transition-colors hover:text-ink">
			← Dashboard
		</a>
	</AppHeader>

	<main class="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
		<div use:reveal={{ y: 20, delay: 50 }}>
			<div class="mb-10">
				<h1 class="font-display text-4xl font-bold tracking-tight text-ink" style="letter-spacing:-0.02em">Interview Setup</h1>
				<p class="mt-2 text-lg text-ink-soft">Configure your practice session and click Start.</p>
			</div>

			<form onsubmit={handleStart} class="space-y-8">
				{#if errorMessage}
					<div role="alert" aria-live="assertive" class="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600">
						<span class="mr-2" aria-hidden="true">⚠️</span>{errorMessage}
					</div>
				{/if}

				<!-- Difficulty -->
				<div class="space-y-3">
					<h2 class="text-xs font-bold tracking-widest text-ink-muted uppercase">Difficulty</h2>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{#each difficultyOptions as opt}
							<button
								type="button"
								onclick={() => (difficulty = opt.value)}
								class="relative flex flex-col rounded-2xl border p-4 text-left transition-all {difficulty === opt.value
									? 'border-2 border-brand bg-white shadow-sm'
									: 'border border-surface-muted bg-white text-ink-soft hover:border-brand/40'}"
							>
								{#if difficulty === opt.value}
									<span class="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">✓</span>
								{/if}
								<span class="text-sm font-bold text-ink">{opt.label}</span>
								<span class="mt-1 text-xs text-ink-soft">{opt.desc}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Question count -->
				<div class="space-y-3">
					<h2 class="text-xs font-bold tracking-widest text-ink-muted uppercase">Number of Questions</h2>
					<div class="grid grid-cols-3 gap-3">
						{#each questionCountOptions as opt}
							<button
								type="button"
								onclick={() => (totalQuestions = opt.value)}
								class="relative flex flex-col rounded-2xl border p-4 text-left transition-all {totalQuestions === opt.value
									? 'border-2 border-brand bg-white shadow-sm'
									: 'border border-surface-muted bg-white text-ink-soft hover:border-brand/40'}"
							>
								{#if totalQuestions === opt.value}
									<span class="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">✓</span>
								{/if}
								<span class="text-2xl font-black text-ink">{opt.label}</span>
								<span class="mt-1 text-xs text-ink-soft">{opt.desc}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Mode -->
				<div class="space-y-3">
					<h2 class="text-xs font-bold tracking-widest text-ink-muted uppercase">Interview Mode</h2>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<button
							type="button"
							onclick={() => (mode = 'non-follow-up')}
							class="relative flex flex-col rounded-2xl border p-5 text-left transition-all {mode === 'non-follow-up'
								? 'border-2 border-brand bg-white shadow-sm'
								: 'border border-surface-muted bg-white text-ink-soft hover:border-brand/40'}"
						>
							{#if mode === 'non-follow-up'}
								<span class="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">✓</span>
							{/if}
							<span class="text-sm font-bold text-ink">Standard</span>
							<span class="mt-1 text-xs text-ink-soft">Questions are pre-set. Ideal for structured practice.</span>
						</button>
						<button
							type="button"
							onclick={() => (mode = 'follow-up')}
							class="relative flex flex-col rounded-2xl border p-5 text-left transition-all {mode === 'follow-up'
								? 'border-2 border-brand bg-white shadow-sm'
								: 'border border-surface-muted bg-white text-ink-soft hover:border-brand/40'}"
						>
							{#if mode === 'follow-up'}
								<span class="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">✓</span>
							{/if}
							<span class="text-sm font-bold text-ink">Adaptive</span>
							<span class="mt-1 text-xs text-ink-soft">Questions adapt to your answers. Mimics a real interview.</span>
						</button>
					</div>
				</div>

				<!-- Source -->
				<div class="space-y-3">
					<h2 class="text-xs font-bold tracking-widest text-ink-muted uppercase">Question Source</h2>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<button
							type="button"
							onclick={() => (source = 'resume')}
							class="relative flex flex-col rounded-2xl border p-5 text-left transition-all {source === 'resume'
								? 'border-2 border-brand bg-white shadow-sm'
								: 'border border-surface-muted bg-white text-ink-soft hover:border-brand/40'}"
						>
							{#if source === 'resume'}
								<span class="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">✓</span>
							{/if}
							<span class="text-sm font-bold text-ink">My Resume</span>
							<span class="mt-1 text-xs text-ink-soft">Questions tailored to your actual skills and experience.</span>
						</button>
						<button
							type="button"
							onclick={() => (source = 'role')}
							class="relative flex flex-col rounded-2xl border p-5 text-left transition-all {source === 'role'
								? 'border-2 border-brand bg-white shadow-sm'
								: 'border border-surface-muted bg-white text-ink-soft hover:border-brand/40'}"
						>
							{#if source === 'role'}
								<span class="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">✓</span>
							{/if}
							<span class="text-sm font-bold text-ink">Job Role</span>
							<span class="mt-1 text-xs text-ink-soft">Questions based on a target role or job description.</span>
						</button>
					</div>

					{#if source === 'role'}
						<div class="mt-3">
							<input
								type="text"
								bind:value={roleInfo}
								placeholder="e.g. Senior Backend Engineer at a fintech startup"
								maxlength={500}
								class="w-full rounded-2xl border border-surface-muted bg-white px-5 py-4 text-sm font-medium text-ink outline-none transition-all placeholder:text-ink-muted focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
							/>
						</div>
					{/if}

					{#if source === 'resume'}
						{#if portfoliosLoading}
							<p class="mt-3 text-xs text-ink-muted">Loading your portfolios…</p>
						{:else if portfolios.length === 0}
							<div class="mt-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-4 text-sm font-medium text-amber-700">
								You don't have a portfolio yet. <a href="/app/resumes/upload" class="font-bold underline">Upload a resume</a> first, or choose "Job Role" above.
							</div>
						{:else if portfolios.length === 1}
							<p class="mt-3 text-xs text-ink-muted">
								Using <span class="font-bold text-ink-soft">{portfolioLabel(portfolios[0])}</span>
								{#if portfolios[0].createdAt}· created {formatDate(portfolios[0].createdAt)}{/if}.
							</p>
						{:else}
							<div class="mt-4 space-y-2">
								<p class="text-xs font-bold tracking-widest text-ink-muted uppercase">Which portfolio?</p>
								<div class="grid grid-cols-1 gap-2">
									{#each portfolios as p (p.uploadId)}
										<button
											type="button"
											onclick={() => (selectedUploadId = p.uploadId)}
											class="relative flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all {selectedUploadId === p.uploadId
												? 'border-2 border-brand bg-white shadow-sm'
												: 'border border-surface-muted bg-white hover:border-brand/40'}"
										>
											<span class="min-w-0">
												<span class="block truncate text-sm font-bold text-ink">{portfolioLabel(p)}</span>
												<span class="mt-0.5 block text-xs text-ink-soft">
													{#if p.isLive}<span class="font-bold text-emerald-600">Live</span> · {/if}Created {formatDate(p.createdAt)}
												</span>
											</span>
											{#if selectedUploadId === p.uploadId}
												<span class="ml-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white">✓</span>
											{/if}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					{/if}
				</div>

				<button
					type="submit"
					disabled={isLoading}
					aria-busy={isLoading}
					class="flex w-full items-center justify-center rounded-2xl bg-brand py-5 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-brand-dark active:scale-95 disabled:opacity-50"
				>
					{#if isLoading}
						<Spinner size="sm" />
						<span class="ml-2">Starting interview...</span>
					{:else}
						Start Interview
					{/if}
				</button>
			</form>
		</div>
	</main>
</div>
