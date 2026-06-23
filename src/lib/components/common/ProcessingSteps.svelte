<script lang="ts">
	import { fade } from 'svelte/transition';
	import Spinner from '$lib/components/common/Spinner.svelte';

	interface ProcessingStep {
		/** Backend statuses that map to this step. */
		statuses: readonly string[];
		label: string;
		/** Sub-text shown when the step is active (if no live message) or done. */
		fallback: string;
		/** Heroicon path data. */
		iconPath: string;
	}

	let {
		steps,
		status = null,
		message = null,
		/** When true every step shows a checkmark and none is active (e.g. COMPLETE). */
		allDone = false
	}: {
		steps: readonly ProcessingStep[];
		status?: string | null;
		message?: string | null;
		allDone?: boolean;
	} = $props();

	function activeStepIndex(s: string | null): number {
		if (!s) return 0;
		const idx = steps.findIndex((step) => step.statuses.includes(s));
		return idx === -1 ? 0 : idx;
	}

	function isStepDone(i: number): boolean {
		if (allDone) return true;
		return activeStepIndex(status) > i;
	}

	function isStepActive(i: number): boolean {
		if (allDone) return false;
		return activeStepIndex(status) === i;
	}
</script>

<ol class="space-y-0">
	{#each steps as step, i}
		{@const done = isStepDone(i)}
		{@const active = isStepActive(i)}
		<li class="flex gap-5">
			<div class="flex flex-col items-center">
				<div
					class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 border
					{done ? 'bg-brand border-brand text-white shadow-md' : active ? 'bg-brand border-brand text-white' : 'bg-surface-subtle border-surface-muted text-ink-muted'}"
				>
					{#if done}
						<span class="check-pop">
							<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-6 w-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						</span>
					{:else if active}
						<Spinner size="sm" />
					{:else}
						<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
							<path stroke-linecap="round" stroke-linejoin="round" d={step.iconPath} />
						</svg>
					{/if}
				</div>

				{#if i < steps.length - 1}
					<div class="my-2 w-0.5 flex-1 overflow-hidden rounded-full bg-surface-muted" style="min-height: 2rem;">
						<div
							class="w-full rounded-full transition-all duration-700 ease-out bg-brand"
							style="height: {done ? '100%' : '0%'};"
						></div>
					</div>
				{/if}
			</div>

			<div class="pb-8 {i === steps.length - 1 ? 'pb-2' : ''}">
				<p class="mt-3 text-base font-bold transition-colors duration-300 {done || active ? 'text-ink' : 'text-ink-muted'}">
					{step.label}
				</p>
				{#if active}
					<p in:fade={{ duration: 250 }} class="mt-1 text-sm leading-relaxed text-ink-soft">
						{message ?? step.fallback}
					</p>
					<div class="mt-3 flex gap-1.5">
						{#each [0, 1, 2] as dot}
							<div class="dot-bounce h-1.5 w-1.5 rounded-full bg-brand/50" style="animation-delay: {dot * 0.18}s"></div>
						{/each}
					</div>
				{:else if done}
					<p class="mt-1 text-sm text-ink-soft">{step.fallback}</p>
				{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
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
