<script lang="ts">
	import { goto } from '$app/navigation';
	import { startInterview } from '$lib/services/interview';
	import type { Difficulty, InterviewMode, InterviewSource } from '$lib/services/interview';
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

	async function handleStart(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';

		if (source === 'role' && !roleInfo.trim()) {
			errorMessage = 'Please enter a job role or description.';
			return;
		}

		isLoading = true;
		const result = await startInterview({
			difficulty,
			totalQuestions,
			mode,
			source,
			roleInfo: roleInfo.trim() || undefined,
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
