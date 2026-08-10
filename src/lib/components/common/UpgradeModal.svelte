<script lang="ts">
	import { resetsInLabel, type LimitError } from '$lib/services/entitlements';

	/**
	 * One modal for every plan limit in the app.
	 *
	 * Driven entirely by the 402 payload the backend returned, so the numbers
	 * shown are always the ones actually enforced — no limit is duplicated in
	 * frontend code. Pass `limitError` to open it; set it back to null to close.
	 */
	let {
		limitError = $bindable(null)
	}: { limitError: LimitError | null } = $props();

	const info = $derived(limitError?.limit ?? null);

	// Per-limit headline + supporting copy. Falls back to the backend's own
	// message for any limit added later that this map doesn't know about yet.
	const COPY: Record<string, { title: string; body: string }> = {
		portfolios: {
			title: 'You’ve used your portfolio',
			body: 'The free plan includes one portfolio. Delete the one you have to start over, or upgrade to keep several live at once.'
		},
		templates: {
			title: 'This is a premium theme',
			body: 'Your plan includes a selection of free themes. Upgrade to unlock every theme for your profession.'
		},
		ai_analyze: {
			title: 'No AI reviews left today',
			body: 'AI review reads your whole portfolio and suggests specific fixes. Upgrade for many more each day.'
		},
		ai_enhance: {
			title: 'No AI rewrites left today',
			body: 'Each suggestion you apply — and each ✦ button — uses one rewrite. Upgrade for many more each day.'
		},
		publish: {
			title: 'No publishes left today',
			body: 'Your changes are saved as a draft and nothing is lost. Upgrade to publish as often as you like.'
		},
		project_image: {
			title: 'No image generations left today',
			body: 'You can still upload your own images. Upgrade to generate more with AI each day.'
		},
		analytics: {
			title: 'Analytics is a paid feature',
			body: 'We’re already recording who views your portfolio — upgrade to see the traffic, sources and trends.'
		}
	};

	const copy = $derived(
		(info && COPY[info.name]) ?? {
			title: 'Your plan doesn’t include this',
			body: limitError?.error ?? 'Upgrade to unlock it.'
		}
	);

	const resetLabel = $derived(resetsInLabel(info?.resetsAt));

	function close() {
		limitError = null;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={onKeydown} />

{#if limitError}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={close}>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="card"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="upgrade-title"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="badge">Upgrade</div>

			<h2 id="upgrade-title">{copy.title}</h2>
			<p class="body">{copy.body}</p>

			{#if typeof info?.limit === 'number' && info.limit > 0}
				<div class="meter">
					<span class="meter-label">
						{info.used ?? info.limit} of {info.limit}
						{info.label} used
						{#if resetLabel}<span class="reset"> · resets in {resetLabel}</span>{/if}
					</span>
					<div class="track">
						<div
							class="fill"
							style="width: {Math.min(100, ((info.used ?? info.limit) / info.limit) * 100)}%"
						></div>
					</div>
				</div>
			{/if}

			<div class="actions">
				<button class="btn-ghost" onclick={close}>Not now</button>
				<a class="btn-primary" href="/#pricing">See plans</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgb(0 0 0 / 0.45);
		backdrop-filter: blur(3px);
	}

	.card {
		width: 100%;
		max-width: 27rem;
		border-radius: 1rem;
		background: var(--color-surface, #fff);
		padding: 1.75rem;
		box-shadow:
			0 20px 40px -12px rgb(0 0 0 / 0.3),
			0 0 0 1px rgb(0 0 0 / 0.05);
	}

	.badge {
		display: inline-block;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-brand, #4f46e5) 12%, transparent);
		padding: 0.2rem 0.6rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-brand, #4f46e5);
	}

	h2 {
		margin: 0.75rem 0 0.4rem;
		font-size: 1.3rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--color-ink, #111827);
	}

	.body {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--color-ink-soft, #4b5563);
	}

	.meter {
		margin-top: 1.1rem;
	}

	.meter-label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-ink-muted, #6b7280);
	}

	.reset {
		font-weight: 500;
	}

	.track {
		margin-top: 0.4rem;
		height: 0.375rem;
		border-radius: 999px;
		background: var(--color-surface-muted, #e5e7eb);
		overflow: hidden;
	}

	.fill {
		height: 100%;
		border-radius: 999px;
		background: var(--color-brand, #4f46e5);
	}

	.actions {
		margin-top: 1.5rem;
		display: flex;
		gap: 0.75rem;
	}

	.btn-ghost,
	.btn-primary {
		flex: 1;
		border: 0;
		border-radius: 0.7rem;
		padding: 0.75rem 1rem;
		text-align: center;
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.btn-ghost {
		background: var(--color-surface-subtle, #f3f4f6);
		color: var(--color-ink-soft, #4b5563);
	}

	.btn-ghost:hover {
		background: var(--color-surface-muted, #e5e7eb);
	}

	.btn-primary {
		background: var(--color-brand, #4f46e5);
		color: #fff;
	}

	.btn-primary:hover {
		filter: brightness(1.08);
	}
</style>
