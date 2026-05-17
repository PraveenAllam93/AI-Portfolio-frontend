<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { submitAnswer, exitInterview } from '$lib/services/interview';
	import type { Feedback, NextQuestion } from '$lib/services/interview';
	import Spinner from '$lib/components/common/Spinner.svelte';

	const sessionId = $derived($page.params.sessionId);

	// Seeded from navigation state (fast path from setup page)
	const navState = $derived(($page.state as Record<string, unknown>) ?? {});

	let question = $state((navState.question as string) ?? '');
	let questionNumber = $state((navState.questionNumber as number) ?? 1);
	let totalQuestions = $state((navState.totalQuestions as number) ?? 15);
	let currentTopic = $state((navState.topic as string) ?? '');
	let isLoadingSession = $state(!navState.question);

	onMount(async () => {
		// If nav state is missing (e.g. page refresh), fetch current session state
		if (!navState.question) {
			try {
				const res = await fetch(`/api/interview/${sessionId}`);
				if (res.ok) {
					const data = await res.json();
					// Active session — show current question
					if (data.status === 'active') {
						question = data.currentQuestion ?? '';
						totalQuestions = data.totalQuestions ?? 15;
						questionNumber = (data.questionsAsked ?? 0) + 1;
						currentTopic = data.currentTopic ?? '';
					} else {
						// Already completed — redirect to report
						await goto(`/app/interview/${sessionId}/report`, { replaceState: true });
					}
				}
			} catch {
				// ignore — user can still see empty question and will get error on submit
			}
			isLoadingSession = false;
		} else {
			isLoadingSession = false;
		}
	});

	let answer = $state('');
	let isSubmitting = $state(false);
	let isExiting = $state(false);
	let errorMessage = $state('');

	// After submission
	let feedback = $state<Feedback | null>(null);
	let showFeedback = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!answer.trim() && !confirm('Submit without an answer?')) return;

		errorMessage = '';
		isSubmitting = true;

		const result = await submitAnswer(sessionId, answer);

		if (!result.success || !result.data) {
			errorMessage = result.error ?? 'Failed to submit. Please try again.';
			isSubmitting = false;
			return;
		}

		feedback = result.data.feedback;
		showFeedback = true;
		isSubmitting = false;

		if (result.data.isComplete) {
			// Navigate to report after a short delay
			setTimeout(() => goto(`/app/interview/${sessionId}/report`), 300);
			return;
		}

		// Store next question for when user clicks Next
		if (result.data.nextQuestion) {
			_nextQuestion = result.data.nextQuestion;
		}
	}

	let _nextQuestion: NextQuestion | null = null;

	function handleNext() {
		if (!_nextQuestion) return;
		question = _nextQuestion.question;
		questionNumber = _nextQuestion.questionNumber;
		currentTopic = _nextQuestion.topic;
		answer = '';
		feedback = null;
		showFeedback = false;
		_nextQuestion = null;
	}

	async function handleExit() {
		if (!confirm('Exit the interview? A report will be generated from your answers so far.')) return;
		isExiting = true;
		const result = await exitInterview(sessionId);
		if (result.success) {
			await goto(`/app/interview/${sessionId}/report`);
		} else {
			errorMessage = result.error ?? 'Failed to exit. Please try again.';
			isExiting = false;
		}
	}

	const progress = $derived(Math.round(((questionNumber - 1) / totalQuestions) * 100));
</script>

<svelte:head>
	<title>Interview — Portfolio.ai</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<!-- Top bar — always visible -->
	<header class="sticky top-0 z-20 flex items-center justify-between border-b border-surface-muted bg-white/90 px-6 py-4 backdrop-blur">
		<div class="flex items-center gap-4">
			<span class="text-sm font-bold text-ink">{questionNumber} / {totalQuestions}</span>
			<div class="h-1.5 w-32 overflow-hidden rounded-full bg-surface-muted">
				<div
					class="h-full rounded-full bg-brand transition-all duration-500"
					style="width: {progress}%"
				></div>
			</div>
			{#if currentTopic}
				<span class="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-ink-soft">{currentTopic}</span>
			{/if}
		</div>

		<button
			onclick={handleExit}
			disabled={isExiting || isSubmitting}
			class="rounded-xl border border-surface-muted px-4 py-2 text-sm font-bold text-ink-soft transition-all hover:border-red-200 hover:text-red-600 disabled:opacity-40"
		>
			{#if isExiting}
				<Spinner size="sm" />
			{:else}
				Exit
			{/if}
		</button>
	</header>

	<main class="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
		{#if isLoadingSession}
			<div class="flex items-center justify-center py-20">
				<Spinner size="lg" />
			</div>
		{:else}
		{#if errorMessage}
			<div role="alert" aria-live="assertive" class="mb-6 rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600">
				<span class="mr-2" aria-hidden="true">⚠️</span>{errorMessage}
			</div>
		{/if}

		<!-- Question card -->
		<div class="mb-8 rounded-[2rem] border border-surface-muted bg-white p-8 shadow-xl">
			<p class="text-xs font-bold tracking-widest text-ink-muted uppercase mb-4">Question {questionNumber}</p>
			<p class="text-xl font-semibold leading-relaxed text-ink">{question}</p>
		</div>

		{#if !showFeedback}
			<!-- Answer form -->
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<label for="answer" class="text-xs font-bold tracking-widest text-ink-soft uppercase">Your Answer</label>
					<textarea
						id="answer"
						bind:value={answer}
						disabled={isSubmitting}
						rows={6}
						maxlength={2000}
						placeholder="Type your answer here..."
						class="w-full resize-none rounded-2xl border border-surface-muted bg-surface-subtle/50 px-6 py-4 text-base text-ink outline-none transition-all placeholder:text-ink-muted focus:border-brand/60 focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60"
					></textarea>
					<p class="text-right text-xs text-ink-muted">{answer.length}/2000</p>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
					class="flex w-full items-center justify-center rounded-2xl bg-brand py-5 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Spinner size="sm" />
						<span class="ml-2">Evaluating...</span>
					{:else}
						Submit Answer
					{/if}
				</button>
			</form>
		{:else if feedback}
			<!-- Feedback -->
			<div class="space-y-4">

				<!-- Score hero -->
				<div class="rounded-[1.5rem] bg-brand p-6 text-white">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-xs font-bold tracking-widest uppercase text-ink-muted">Your Score</p>
							<div class="mt-1 flex items-end gap-2">
								<span class="text-6xl font-black leading-none">{feedback.score}</span>
								<span class="mb-1 text-xl font-bold text-ink-muted">/10</span>
							</div>
						</div>
						<div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10">
							<span class="text-2xl">{feedback.score >= 8 ? '★' : feedback.score >= 5 ? '◎' : '△'}</span>
						</div>
					</div>
					<div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
						<div
							class="h-full rounded-full bg-white transition-all duration-700"
							style="width: {(feedback.score / 10) * 100}%"
						></div>
					</div>
				</div>

				<!-- Strengths + Weaknesses side by side -->
				{#if feedback.strengths.length > 0 || feedback.weaknesses.length > 0}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{#if feedback.strengths.length > 0}
							<div class="rounded-2xl border border-surface-muted bg-white p-5">
								<p class="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-ink-muted uppercase"><span class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[9px] font-black text-emerald-600 ring-1 ring-emerald-100">✓</span>What you got right</p>
								<ul class="space-y-2.5">
									{#each feedback.strengths as s, i}
										<li class="flex items-start gap-2.5">
											<span class="mt-0.5 text-xs font-black text-ink-muted tabular-nums">{(i + 1).toString().padStart(2, '0')}</span>
											<span class="text-sm leading-relaxed text-ink-soft">{s}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if feedback.weaknesses.length > 0}
							<div class="rounded-2xl border border-surface-muted bg-white p-5">
								<p class="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-ink-muted uppercase"><span class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-amber-50 text-[9px] font-black text-amber-600 ring-1 ring-amber-100">→</span>Could be stronger</p>
								<ul class="space-y-2.5">
									{#each feedback.weaknesses as w, i}
										<li class="flex items-start gap-2.5">
											<span class="mt-0.5 text-xs font-black text-ink-muted tabular-nums">{(i + 1).toString().padStart(2, '0')}</span>
											<span class="text-sm leading-relaxed text-ink-soft">{w}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Ideal answer -->
				<div class="rounded-2xl border-l-4 border-brand bg-white p-5 shadow-sm">
					<p class="mb-2 text-xs font-bold tracking-widest text-ink-muted uppercase">Model Answer</p>
					<p class="text-sm leading-relaxed text-ink-soft">{feedback.idealAnswer}</p>
				</div>

				<!-- Next button -->
				{#if _nextQuestion}
					<button
						onclick={handleNext}
						class="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-5 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95"
					>
						Next Question <span class="text-ink-muted">→</span>
					</button>
				{/if}
			</div>
		{/if}
		{/if}
	</main>
</div>
