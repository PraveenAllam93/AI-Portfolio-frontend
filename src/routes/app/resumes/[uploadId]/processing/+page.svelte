<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { elasticOut, cubicOut } from 'svelte/easing';
	import { resumeProcessing } from '$lib/stores/resumeProcessing';
	import { authStore } from '$lib/stores/auth';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import BreadcrumbHeader from '$lib/components/common/BreadcrumbHeader.svelte';
	import ProcessingSteps from '$lib/components/common/ProcessingSteps.svelte';
	import type { FailureStage } from '$lib/services/resumeStatus';

	const uploadId: string = $page.params.uploadId ?? '';

	// COMPLETE = published live (normal users). DRAFT_READY = guest preview that
	// is generated but NOT publicly live until the guest creates an account.
	const isReady = $derived(
		$resumeProcessing.status === 'COMPLETE' || $resumeProcessing.status === 'DRAFT_READY'
	);
	const isGuestDraft = $derived(
		$resumeProcessing.status === 'DRAFT_READY' || $resumeProcessing.isDraft
	);

	// ─── Step definitions ────────────────────────────────────────────────────────
	const STEPS = [
		{
			statuses: ['UPLOADED', 'PENDING_UPLOAD', 'VALIDATING', 'VALIDATED'],
			label: 'Resume received',
			fallback: 'Your file is securely stored and queued.',
			iconPath:
				'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
		},
		{
			statuses: ['PARSING', 'EXTRACTING_TEXT', 'QUEUED_FOR_AI'],
			label: 'Parsing resume',
			fallback: 'Extracting your experience, skills, and achievements.',
			iconPath:
				'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
		},
		{
			statuses: ['AI_PROCESSING', 'AI_COMPLETE'],
			label: 'AI processing',
			fallback: 'AI is analysing and structuring your resume content.',
			iconPath:
				'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z'
		},
		{
			statuses: ['GENERATING'],
			label: 'Building portfolio',
			fallback: 'Assembling your personalised website.',
			iconPath:
				'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z'
		},
		{
			statuses: ['COMPLETE'],
			label: 'Portfolio ready!',
			fallback: 'Your portfolio is live.',
			iconPath:
				'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0'
		}
	] as const;

	// Step active/done logic now lives in the shared <ProcessingSteps> component.

	// Maps failureStage to a short badge label
	const STAGE_LABELS: Record<FailureStage, string> = {
		VALIDATION: 'File validation',
		AI_PROCESSING: 'AI analysis',
		PROCESSING: 'Portfolio generation'
	};

	// Copy portfolio URL to clipboard
	let copied = $state(false);
	async function copyUrl(url: string) {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// clipboard access denied — silently ignore
		}
	}

	// Auto-redirect to edit page 2 s after portfolio is ready
	let redirectCountdown = $state(2);
	$effect(() => {
		if (!isReady) return;
		const userId = $authStore.user?.userId;
		if (!userId) return;

		const editUrl = `/app/portfolio/${userId}/${uploadId}/edit`;
		const tick = setInterval(() => {
			redirectCountdown -= 1;
			if (redirectCountdown <= 0) {
				clearInterval(tick);
				goto(editUrl);
			}
		}, 1000);

		return () => clearInterval(tick);
	});

	// ─── Cancel ──────────────────────────────────────────────────────────────────
	async function handleCancel() {
		const ok = await resumeProcessing.cancel();
		if (ok) goto('/app/dashboard');
	}

	// ─── Lifecycle ───────────────────────────────────────────────────────────────
	onMount(() => resumeProcessing.start(uploadId));
	onDestroy(() => resumeProcessing.stop());
</script>

<svelte:head>
	<title>Building your portfolio — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<!-- Header -->
	<BreadcrumbHeader title="Processing" />

	<main class="mx-auto w-full max-w-lg flex-1 px-6 py-14">
		<!-- ── Error state — backend signals canRetry ─────────────────────────────── -->
		{#if $resumeProcessing.canRetry && !$resumeProcessing.polling}
			<div
				in:fly={{ y: 16, duration: 350, easing: cubicOut }}
				class="overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-xl"
			>
				<div class="h-2 w-full bg-red-500"></div>
				<div class="p-10 text-center">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.8"
							stroke="currentColor"
							class="h-8 w-8 text-red-500"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
							/>
						</svg>
					</div>

					<h2 class="mt-5 font-display text-2xl font-bold text-ink">Processing failed</h2>

					<!-- failureStage badge — shown when backend tells us where it broke -->
					{#if $resumeProcessing.failureStage}
						<span
							class="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-100"
						>
							Failed at: {STAGE_LABELS[$resumeProcessing.failureStage]}
						</span>
					{/if}

					<!-- failureReason is human-readable from backend — display directly -->
					<p class="mt-4 text-sm text-ink-soft">
						{$resumeProcessing.failureReason ??
							'Something went wrong while processing your resume.'}
					</p>

					<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
						<a
							href="/app/resumes/upload"
							class="flex justify-center items-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95"
						>
							Try again
						</a>
						<a
							href="/app/dashboard"
							class="flex justify-center items-center rounded-xl border border-surface-muted bg-surface-subtle px-6 py-3 text-sm font-bold text-ink-soft transition-colors hover:border-brand/30 hover:text-ink hover:bg-surface-muted"
						>
							Go to Dashboard
						</a>
					</div>
				</div>
			</div>

			<!-- ── Network error ─────────────────────────────────────────────────────── -->
		{:else if $resumeProcessing.networkError}
			<div
				in:fly={{ y: 16, duration: 350, easing: cubicOut }}
				class="overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-xl"
			>
				<div class="h-2 w-full bg-amber-500"></div>
				<div class="p-10 text-center">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.8"
							stroke="currentColor"
							class="h-8 w-8 text-amber-500"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</div>
					<h2 class="mt-5 font-display text-2xl font-bold text-ink">Connection lost</h2>
					<p class="mt-3 text-sm text-ink-soft">
						Could not reach the server. Your portfolio may still be processing.
					</p>
					<button
						onclick={() => resumeProcessing.retry()}
						class="mt-8 flex w-full justify-center items-center rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95"
					>
						Retry
					</button>
				</div>
			</div>

			<!-- ── Normal: processing or complete ───────────────────────────────────── -->
		{:else}
			<div class="overflow-hidden rounded-[2.5rem] border border-surface-muted bg-white shadow-xl">
				<!-- Progress bar — driven by backend progress field (0–100) -->
				<div class="relative h-2 w-full overflow-hidden bg-surface-muted">
					<div
						class="absolute inset-y-0 left-0 transition-all duration-700 ease-out bg-brand"
						style="width: {$resumeProcessing.progress}%;"
					></div>
					{#if $resumeProcessing.polling && $resumeProcessing.status !== 'COMPLETE'}
						<div class="shimmer absolute inset-0"></div>
					{/if}
				</div>

				<div class="p-10">
					<!-- Title -->
					<div class="mb-10 text-center">
						{#if isReady}
							<div in:scale={{ duration: 400, easing: elasticOut, start: 0.8 }}>
								<p class="text-xs font-bold tracking-widest text-emerald-500 uppercase">
									{isGuestDraft ? 'Preview ready' : 'Deployed'}
								</p>
								<h1 class="mt-2 font-display text-3xl font-bold text-ink" style="letter-spacing:-0.02em">
									{isGuestDraft ? 'Your preview is ready!' : 'Portfolio ready!'}
								</h1>
							</div>
						{:else}
							<p class="text-xs font-bold tracking-widest text-ink-muted uppercase">
								Working on it
							</p>
							<h1 class="mt-2 font-display text-3xl font-bold text-ink" style="letter-spacing:-0.02em">
								Building your portfolio
							</h1>
						{/if}
					</div>

					<!-- Step list (shared with the upload wizard's analyzing view) -->
					<ProcessingSteps
						steps={STEPS}
						status={$resumeProcessing.status}
						message={$resumeProcessing.message}
						allDone={isReady}
					/>

					<!-- Ready: confirmation + auto-redirect -->
					{#if isReady}
						<div
							in:fly={{ y: 20, duration: 450, easing: cubicOut }}
							class="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center"
						>
							<!-- Deployed icon -->
							<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
								<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-6 w-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
								</svg>
							</div>
							<p class="mt-3 text-sm font-bold text-emerald-700">
								{isGuestDraft ? 'Preview generated' : 'Portfolio deployed & live'}
							</p>
							<p class="mt-1 text-xs text-emerald-600">
								{isGuestDraft
									? `Opening editor in ${redirectCountdown}s — publish when you're ready.`
									: `Opening editor in ${redirectCountdown}s…`}
							</p>

							<div class="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
								<!-- Open public portfolio in new tab (live portfolios only — a
								     guest draft is not publicly live yet) -->
								{#if $resumeProcessing.portfolioPath && !isGuestDraft}
									<a
										href={$resumeProcessing.portfolioPath}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-50 active:scale-95"
									>
										<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
											<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
										</svg>
										Open Portfolio
									</a>
								{/if}
								<!-- Go to editor immediately -->
								{#if $authStore.user?.userId}
									<button
										onclick={() => goto(`/app/portfolio/${$authStore.user!.userId}/${uploadId}/edit`)}
										class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95"
									>
										<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
											<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
										</svg>
										Go to Editor
									</button>
								{/if}
							</div>
						</div>
					{:else if $resumeProcessing.polling}
						<div class="mt-6 flex items-center justify-between border-t border-surface-muted pt-6">
							<div class="flex items-center gap-2">
								<Spinner size="xs" class="text-ink-muted" />
								<span class="text-xs font-bold text-ink-muted">Checking for updates…</span>
							</div>
							<button
								onclick={handleCancel}
								disabled={$resumeProcessing.cancelling}
								class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
							>
								{#if $resumeProcessing.cancelling}
									<Spinner size="xs" />
									Cancelling…
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
									</svg>
									Cancel
								{/if}
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.shimmer {
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.4) 50%,
			transparent 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.8s ease-in-out infinite;
	}
	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>
