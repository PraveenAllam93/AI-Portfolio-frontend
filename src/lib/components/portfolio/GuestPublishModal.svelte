<script lang="ts">
	import { register, confirmEmail, resendConfirmationCode, login } from '$lib/services/auth';
	import { normalizeUsername, validateUsername } from '$lib/username';
	import { claimGuestPortfolio } from '$lib/services/guest';
	import { authStore } from '$lib/stores/auth';
	import Spinner from '$lib/components/common/Spinner.svelte';

	// The uploadId to publish live once the account exists.
	// onPublished receives the new REAL userId so the caller can navigate there.
	let {
		uploadId,
		onClose,
		onPublished
	}: {
		uploadId: string;
		onClose: () => void;
		onPublished: (realUserId: string) => void;
	} = $props();

	type Step = 'signup' | 'confirm' | 'working';
	let step = $state<Step>('signup');

	let name = $state('');
	let username = $state('');
	let email = $state('');
	let password = $state('');
	let code = $state('');

	let busy = $state(false);
	let errorMessage = $state('');
	let workingLabel = $state('Publishing your portfolio…');

	async function handleSignup(e: Event) {
		e.preventDefault();
		if (busy) return;
		errorMessage = '';
		if (!name || !username || !email || !password) {
			errorMessage = 'Please fill in every field.';
			return;
		}
		// The handle becomes this portfolio's public URL, so check the format
		// before signing up rather than surfacing it as a trigger error.
		const usernameError = validateUsername(username);
		if (usernameError) {
			errorMessage = usernameError;
			return;
		}
		busy = true;
		const result = await register({
			name,
			username: normalizeUsername(username),
			email,
			password
		});
		busy = false;
		if (!result.success) {
			errorMessage = result.error ?? 'Could not create your account.';
			return;
		}
		if (result.data?.needsConfirmation) {
			step = 'confirm';
		} else {
			// No email confirmation required — log in and claim immediately.
			await loginAndClaim();
		}
	}

	async function handleConfirm(e: Event) {
		e.preventDefault();
		if (busy) return;
		errorMessage = '';
		if (!code) {
			errorMessage = 'Enter the code we emailed you.';
			return;
		}
		busy = true;
		const confirmed = await confirmEmail(email, code);
		if (!confirmed.success) {
			busy = false;
			errorMessage = confirmed.error ?? 'That code did not work. Please try again.';
			return;
		}
		await loginAndClaim();
	}

	async function loginAndClaim() {
		step = 'working';
		workingLabel = 'Signing you in…';
		const loggedIn = await login({ identifier: email, password });
		if (!loggedIn.success || !loggedIn.data) {
			busy = false;
			step = 'confirm';
			errorMessage = loggedIn.error ?? 'Could not sign you in. Please try again.';
			return;
		}
		// Now authenticated as the real user — seed the store, then migrate.
		authStore.setUser(loggedIn.data);
		workingLabel = 'Publishing your portfolio…';
		const claimed = await claimGuestPortfolio(uploadId);
		busy = false;
		if (!claimed.success) {
			step = 'signup';
			errorMessage = claimed.error ?? 'Could not publish your portfolio. Please try again.';
			return;
		}
		onPublished(loggedIn.data.userId);
	}

	async function resend() {
		errorMessage = '';
		const res = await resendConfirmationCode(email);
		if (!res.success) {
			errorMessage = res.error ?? 'Could not resend the code.';
		}
	}
</script>

<div
	class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
	role="dialog"
	aria-modal="true"
	aria-label="Create an account to publish"
>
	<div class="w-full max-w-md overflow-hidden rounded-[2rem] border border-surface-muted bg-white p-8 shadow-2xl">
		{#if step === 'working'}
			<div class="flex flex-col items-center gap-4 py-6 text-center">
				<Spinner size="md" class="text-brand" />
				<p class="text-sm font-bold text-ink-soft">{workingLabel}</p>
			</div>
		{:else}
			<div class="mb-6 flex items-start justify-between">
				<div>
					<h2 class="font-display text-2xl font-bold text-ink" style="letter-spacing:-0.02em">
						{step === 'signup' ? 'Publish your portfolio' : 'Verify your email'}
					</h2>
					<p class="mt-1 text-sm text-ink-soft">
						{step === 'signup'
							? 'Create a free account to get your live, shareable link.'
							: `Enter the code we sent to ${email}.`}
					</p>
				</div>
				<button
					onclick={onClose}
					aria-label="Close"
					class="rounded-lg p-1 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink"
				>
					<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			{#if errorMessage}
				<div role="alert" class="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
					{errorMessage}
				</div>
			{/if}

			{#if step === 'signup'}
				<form onsubmit={handleSignup} class="flex flex-col gap-4">
					<input
						bind:value={name}
						type="text"
						autocomplete="name"
						placeholder="Your name"
						class="rounded-xl border border-surface-muted bg-surface-subtle px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
					/>
					<div class="relative">
						<span
							class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-ink-muted select-none"
							aria-hidden="true">/u/</span
						>
						<input
							bind:value={username}
							type="text"
							autocomplete="username"
							autocapitalize="none"
							spellcheck="false"
							maxlength={30}
							placeholder="username"
							aria-label="Username — becomes your public portfolio link"
							class="w-full rounded-xl border border-surface-muted bg-surface-subtle py-3 pr-4 pl-11 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
						/>
					</div>
					<input
						bind:value={email}
						type="email"
						autocomplete="email"
						placeholder="you@example.com"
						class="rounded-xl border border-surface-muted bg-surface-subtle px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
					/>
					<input
						bind:value={password}
						type="password"
						autocomplete="new-password"
						placeholder="Create a password"
						class="rounded-xl border border-surface-muted bg-surface-subtle px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
					/>
					<button
						type="submit"
						disabled={busy}
						class="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50"
					>
						{#if busy}<Spinner size="xs" />{/if}
						Create account & publish
					</button>
					<p class="text-center text-xs text-ink-muted">
						Your work is saved — creating an account just makes it live.
					</p>
				</form>
			{:else if step === 'confirm'}
				<form onsubmit={handleConfirm} class="flex flex-col gap-4">
					<input
						bind:value={code}
						type="text"
						inputmode="numeric"
						autocomplete="one-time-code"
						placeholder="6-digit code"
						class="rounded-xl border border-surface-muted bg-surface-subtle px-4 py-3 text-center text-lg font-bold tracking-widest text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
					/>
					<button
						type="submit"
						disabled={busy}
						class="flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50"
					>
						{#if busy}<Spinner size="xs" />{/if}
						Verify & publish
					</button>
					<button type="button" onclick={resend} class="text-center text-xs font-bold text-brand hover:underline">
						Resend code
					</button>
				</form>
			{/if}
		{/if}
	</div>
</div>
