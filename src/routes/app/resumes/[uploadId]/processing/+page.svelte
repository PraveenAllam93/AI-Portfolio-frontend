<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { elasticOut, cubicOut } from 'svelte/easing';
	import { resumeProcessing } from '$lib/stores/resumeProcessing';
	import type { FailureStage } from '$lib/services/resumeStatus';

	const uploadId: string = $page.params.uploadId ?? '';

	// ─── Step definitions ────────────────────────────────────────────────────────
	const STEPS = [
		{
			statuses: ['UPLOADED'],
			label: 'Resume received',
			fallback: 'Your file is securely stored and queued.',
			iconPath:
				'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
		},
		{
			statuses: ['PARSING'],
			label: 'Parsing resume',
			fallback: 'Extracting your experience, skills, and achievements.',
			iconPath:
				'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
		},
		{
			statuses: ['AI_PROCESSING'],
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

	// ─── Helpers ─────────────────────────────────────────────────────────────────
	function activeStepIndex(status: string | null): number {
		if (!status) return 0;
		const idx = STEPS.findIndex((s) => (s.statuses as readonly string[]).includes(status));
		return idx === -1 ? 0 : idx;
	}

	function isStepDone(i: number, status: string | null): boolean {
		// COMPLETE means all steps finished — every step shows a checkmark
		if (status === 'COMPLETE') return true;
		return activeStepIndex(status) > i;
	}

	function isStepActive(i: number, status: string | null): boolean {
		// COMPLETE has no active step — avoids last step showing a spinner
		if (status === 'COMPLETE') return false;
		return activeStepIndex(status) === i;
	}

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

	// ─── Lifecycle ───────────────────────────────────────────────────────────────
	onMount(() => resumeProcessing.start(uploadId));
	onDestroy(() => resumeProcessing.stop());
</script>

<svelte:head>
	<title>Building your portfolio — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#fafafa]">
	<!-- Header -->
	<header class="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
			<a
				href="/app/dashboard"
				class="flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
					/>
				</svg>
				Dashboard
			</a>
			<span class="text-slate-300">/</span>
			<span class="text-sm font-bold text-slate-900">Processing</span>
		</div>
	</header>

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

					<h2 class="mt-5 font-serif text-2xl font-bold text-slate-900">Processing failed</h2>

					<!-- failureStage badge — shown when backend tells us where it broke -->
					{#if $resumeProcessing.failureStage}
						<span
							class="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-100"
						>
							Failed at: {STAGE_LABELS[$resumeProcessing.failureStage]}
						</span>
					{/if}

					<!-- failureReason is human-readable from backend — display directly -->
					<p class="mt-4 text-sm text-slate-500">
						{$resumeProcessing.failureReason ??
							'Something went wrong while processing your resume.'}
					</p>

					<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
						<a
							href="/app/resumes/upload"
							class="flex justify-center items-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
						>
							Try again
						</a>
						<a
							href="/app/dashboard"
							class="flex justify-center items-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 hover:bg-slate-100"
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
					<h2 class="mt-5 font-serif text-2xl font-bold text-slate-900">Connection lost</h2>
					<p class="mt-3 text-sm text-slate-500">
						Could not reach the server. Your portfolio may still be processing.
					</p>
					<button
						onclick={() => resumeProcessing.retry()}
						class="mt-8 flex w-full justify-center items-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
					>
						Retry
					</button>
				</div>
			</div>

			<!-- ── Normal: processing or complete ───────────────────────────────────── -->
		{:else}
			<div class="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl">
				<!-- Progress bar — driven by backend progress field (0–100) -->
				<div class="relative h-2 w-full overflow-hidden bg-slate-100">
					<div
						class="absolute inset-y-0 left-0 transition-all duration-700 ease-out bg-slate-900"
						style="width: {$resumeProcessing.progress}%;"
					></div>
					{#if $resumeProcessing.polling && $resumeProcessing.status !== 'COMPLETE'}
						<div class="shimmer absolute inset-0"></div>
					{/if}
				</div>

				<div class="p-10">
					<!-- Title -->
					<div class="mb-10 text-center">
						{#if $resumeProcessing.status === 'COMPLETE'}
							<div in:scale={{ duration: 400, easing: elasticOut, start: 0.8 }}>
								<p class="text-xs font-bold tracking-widest text-emerald-500 uppercase">
									All done
								</p>
								<h1 class="mt-2 font-serif text-3xl font-bold text-slate-900">
									Your portfolio is live!
								</h1>
							</div>
						{:else}
							<p class="text-xs font-bold tracking-widest text-slate-400 uppercase">
								Working on it
							</p>
							<h1 class="mt-2 font-serif text-3xl font-bold text-slate-900">
								Building your portfolio
							</h1>
						{/if}
					</div>

					<!-- Step list -->
					<ol class="space-y-0">
						{#each STEPS as step, i}
							{@const done = isStepDone(i, $resumeProcessing.status)}
							{@const active = isStepActive(i, $resumeProcessing.status)}
							<li class="flex gap-5">
								<div class="flex flex-col items-center">
									<div
										class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 border
										{done ? 'bg-slate-900 border-slate-900 text-white shadow-md' : active ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}"
									>
										{#if done}
											<span class="check-pop">
												<svg
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="2.5"
													stroke="currentColor"
													class="h-6 w-6"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="m4.5 12.75 6 6 9-13.5"
													/>
												</svg>
											</span>
										{:else if active}
											<svg
												class="h-5 w-5 animate-spin"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													class="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													stroke-width="4"
												></circle>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
												></path>
											</svg>
										{:else}
											<svg
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="h-5 w-5"
											>
												<path stroke-linecap="round" stroke-linejoin="round" d={step.iconPath} />
											</svg>
										{/if}
									</div>

									{#if i < STEPS.length - 1}
										<div
											class="my-2 w-0.5 flex-1 overflow-hidden rounded-full bg-slate-100"
											style="min-height: 2rem;"
										>
											<div
												class="w-full rounded-full transition-all duration-700 ease-out bg-slate-900"
												style="height: {done ? '100%' : '0%'};"
											></div>
										</div>
									{/if}
								</div>

								<div class="pb-8 {i === STEPS.length - 1 ? 'pb-2' : ''}">
									<p
										class="mt-3 text-base font-bold transition-colors duration-300
										{done ? 'text-slate-900' : active ? 'text-slate-900' : 'text-slate-400'}"
									>
										{step.label}
									</p>
									{#if active}
										<p
											in:fade={{ duration: 250 }}
											class="mt-1 text-sm leading-relaxed text-slate-500"
										>
											{$resumeProcessing.message ?? step.fallback}
										</p>
										{#if $resumeProcessing.status !== 'COMPLETE'}
											<div class="mt-3 flex gap-1.5">
												{#each [0, 1, 2] as dot}
													<div
														class="dot-bounce h-1.5 w-1.5 rounded-full bg-slate-400"
														style="animation-delay: {dot * 0.18}s"
													></div>
												{/each}
											</div>
										{/if}
									{:else if done}
										<p class="mt-1 text-sm text-slate-500">{step.fallback}</p>
									{/if}
								</div>
							</li>
						{/each}
					</ol>

					<!-- Portfolio URL reveal -->
					{#if $resumeProcessing.status === 'COMPLETE' && $resumeProcessing.portfolioPath}
						<div
							in:fly={{ y: 20, duration: 450, easing: cubicOut }}
							class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6"
						>
							<p class="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">
								Your portfolio URL
							</p>
							<div
								class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-5 w-5 shrink-0 text-slate-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
									/>
								</svg>
								<span class="flex-1 truncate text-sm font-bold text-slate-900">
									{$resumeProcessing.portfolioPath}
								</span>
								<button
									onclick={() => copyUrl($resumeProcessing.portfolioPath!)}
									class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all
									{copied ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}"
								>
									{copied ? 'Copied!' : 'Copy'}
								</button>
							</div>
							<div class="mt-5 flex flex-col gap-3 sm:flex-row">
								<a
									href={$resumeProcessing.portfolioPath}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
								>
									Visit Portfolio
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2.5"
										stroke="currentColor"
										class="h-4 w-4"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
										/>
									</svg>
								</a>
								<a
									href="/app/dashboard"
									class="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
								>
									Dashboard
								</a>
							</div>
						</div>
					{:else if $resumeProcessing.polling}
						<div class="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">
							<svg class="h-4 w-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
							<span class="text-xs font-bold text-slate-400">Checking for updates…</span>
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

	.check-pop {
		display: flex;
		animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
	}
	@keyframes pop-in {
		0% {
			transform: scale(0) rotate(-30deg);
			opacity: 0;
		}
		70% {
			transform: scale(1.2) rotate(5deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	.dot-bounce {
		animation: dot-bounce 1.2s ease-in-out infinite;
	}
	@keyframes dot-bounce {
		0%,
		80%,
		100% {
			transform: translateY(0);
			opacity: 0.4;
		}
		40% {
			transform: translateY(-5px);
			opacity: 1;
		}
	}
</style>
