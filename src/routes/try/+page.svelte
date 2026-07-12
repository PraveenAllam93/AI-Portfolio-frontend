<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { authStore } from '$lib/stores/auth';
	import { startGuestSession } from '$lib/services/guest';
	import Spinner from '$lib/components/common/Spinner.svelte';

	const SITE_KEY = env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

	type Phase = 'verifying' | 'starting' | 'error';
	let phase = $state<Phase>('verifying');
	let errorMessage = $state('');
	let widgetEl: HTMLDivElement | null = $state(null);

	interface Turnstile {
		render: (el: HTMLElement, opts: Record<string, unknown>) => string;
		reset: (id?: string) => void;
	}
	function getTurnstile(): Turnstile | undefined {
		return (window as unknown as { turnstile?: Turnstile }).turnstile;
	}

	async function begin(token: string) {
		phase = 'starting';
		errorMessage = '';
		const result = await startGuestSession(token);
		if (result.success && result.data) {
			// Seed the auth store so the /app guard sees the (guest) session
			// immediately, without waiting for a re-fetch.
			authStore.setUser(result.data);
			await goto('/app/resumes/upload');
		} else {
			phase = 'error';
			errorMessage = result.error ?? 'Could not start a free session. Please try again.';
		}
	}

	function loadTurnstile(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (getTurnstile()) return resolve();
			const s = document.createElement('script');
			s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
			s.async = true;
			s.defer = true;
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('Failed to load verification'));
			document.head.appendChild(s);
		});
	}

	onMount(async () => {
		// No site key configured (e.g. local dev) — skip the challenge entirely.
		if (!SITE_KEY) {
			void begin('');
			return;
		}
		try {
			await loadTurnstile();
			const ts = getTurnstile();
			if (widgetEl && ts) {
				ts.render(widgetEl, {
					sitekey: SITE_KEY,
					callback: (token: string) => void begin(token),
					'error-callback': () => {
						phase = 'error';
						errorMessage = 'Verification failed. Please refresh and try again.';
					}
				});
			}
		} catch {
			phase = 'error';
			errorMessage = 'Could not load verification. Please refresh and try again.';
		}
	});

	function retry() {
		const ts = getTurnstile();
		if (SITE_KEY && ts) {
			phase = 'verifying';
			errorMessage = '';
			ts.reset();
		} else {
			void begin('');
		}
	}
</script>

<svelte:head>
	<title>Try Portfolio.ai — free, no signup</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-6">
	<div class="w-full max-w-md rounded-[2rem] border border-surface-muted bg-white p-8 sm:p-10 text-center shadow-xl">
		<h1 class="font-display text-3xl font-bold text-ink" style="letter-spacing:-0.02em">
			Build your portfolio — free
		</h1>
		<p class="mt-3 text-ink-soft">
			No account needed to start. Upload your resume and see your portfolio in seconds. You'll only
			sign up when you're ready to publish it live.
		</p>

		<div class="mt-8 flex flex-col items-center gap-4">
			{#if phase === 'starting'}
				<div class="flex items-center gap-3 text-sm font-bold text-ink-soft">
					<Spinner size="sm" class="text-brand" />
					Setting up your free session…
				</div>
			{:else if phase === 'error'}
				<div role="alert" class="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
					{errorMessage}
				</div>
				<button
					onclick={retry}
					class="inline-flex items-center justify-center rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95"
				>
					Try again
				</button>
			{:else}
				<!-- Turnstile renders here (invisible/managed widget) -->
				<div bind:this={widgetEl}></div>
				<p class="text-xs text-ink-muted">Verifying you're human…</p>
			{/if}
		</div>
	</div>

	<p class="mt-6 text-sm text-ink-muted">
		Already have an account?
		<a href="/login" class="font-bold text-brand hover:underline">Log in</a>
	</p>
</div>
