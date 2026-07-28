<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import { reveal } from '$lib/actions/animate';
	import AppHeader from '$lib/components/common/AppHeader.svelte';
	import LoadingState from '$lib/components/common/LoadingState.svelte';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import { checkUsername } from '$lib/services/auth';
	import { normalizeUsername, validateUsername } from '$lib/username';

	interface Profile {
		username: string | null;
		name: string;
		/** ISO timestamp; non-null means the username is still in cooldown. */
		canChangeUsernameAt: string | null;
	}

	let profile = $state<Profile | null>(null);
	let loading = $state(true);
	let loadError = $state('');

	let name = $state('');
	let username = $state('');

	let savingName = $state(false);
	let savingUsername = $state(false);
	let nameMessage = $state('');
	let usernameError = $state('');
	let usernameSuccess = $state('');

	// ─── Availability check (same contract as signup) ─────────────────────────
	type UsernameState = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';
	let usernameState: UsernameState = $state('idle');
	let usernameHint = $state('');
	let checkTimer: ReturnType<typeof setTimeout> | undefined;
	let checkSeq = 0;

	const cooldownUntil = $derived(
		profile?.canChangeUsernameAt ? new Date(profile.canChangeUsernameAt) : null
	);
	const inCooldown = $derived(!!cooldownUntil && cooldownUntil > new Date());
	const usernameChanged = $derived(
		normalizeUsername(username) !== (profile?.username ?? '')
	);

	onMount(async () => {
		try {
			const res = await fetch('/api/profile');
			if (!res.ok) {
				loadError = 'Could not load your profile.';
				return;
			}
			profile = await res.json();
			name = profile?.name ?? $authStore.user?.name ?? '';
			username = profile?.username ?? '';
		} catch {
			loadError = 'Could not load your profile.';
		} finally {
			loading = false;
		}
	});

	function onUsernameInput() {
		clearTimeout(checkTimer);
		usernameError = '';
		usernameSuccess = '';

		const handle = normalizeUsername(username);

		if (handle === (profile?.username ?? '')) {
			usernameState = 'idle';
			usernameHint = '';
			return;
		}

		const formatError = validateUsername(handle);
		if (formatError) {
			usernameState = 'invalid';
			usernameHint = formatError;
			return;
		}

		usernameState = 'checking';
		usernameHint = 'Checking availability…';

		const seq = ++checkSeq;
		checkTimer = setTimeout(async () => {
			const result = await checkUsername(handle);
			if (seq !== checkSeq) return;

			if (result.unverified) {
				usernameState = 'idle';
				usernameHint = '';
			} else if (result.available) {
				usernameState = 'available';
				usernameHint = `portfolio.ai/u/${handle} is available`;
			} else {
				usernameState = 'taken';
				usernameHint = result.reason || 'That username is already taken.';
			}
		}, 400);
	}

	async function saveName(e: SubmitEvent) {
		e.preventDefault();
		nameMessage = '';
		savingName = true;

		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name })
			});
			const data = await res.json().catch(() => ({}));

			if (res.ok) {
				nameMessage = 'Saved.';
				if (profile) profile.name = name;
				if ($authStore.user) authStore.setUser({ ...$authStore.user, name });
			} else {
				nameMessage = data.message || data.error || 'Could not save.';
			}
		} catch {
			nameMessage = 'Could not save.';
		} finally {
			savingName = false;
		}
	}

	async function saveUsername(e: SubmitEvent) {
		e.preventDefault();
		usernameError = '';
		usernameSuccess = '';

		const handle = normalizeUsername(username);
		const formatError = validateUsername(handle);
		if (formatError) {
			usernameError = formatError;
			return;
		}

		savingUsername = true;

		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: handle })
			});
			const data = await res.json().catch(() => ({}));

			if (res.ok) {
				usernameSuccess = 'Username updated. Your portfolio links now use it.';
				usernameState = 'idle';
				usernameHint = '';
				if (profile) {
					profile.username = data.username ?? handle;
					// Server sets a fresh cooldown on every successful rename.
					profile.canChangeUsernameAt = new Date(
						Date.now() + 30 * 24 * 60 * 60 * 1000
					).toISOString();
				}
				if ($authStore.user) {
					authStore.setUser({ ...$authStore.user, username: data.username ?? handle });
				}
			} else {
				usernameError = data.message || data.error || 'Could not update username.';
			}
		} catch {
			usernameError = 'Could not update username.';
		} finally {
			savingUsername = false;
		}
	}

	function formatDate(d: Date): string {
		return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Settings — Portfolio.ai</title>
</svelte:head>

<div class="min-h-screen bg-surface-subtle">
	<AppHeader>
		<a
			href="/app/dashboard"
			class="rounded-xl px-4 py-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink"
		>
			Dashboard
		</a>
	</AppHeader>

	<main class="mx-auto max-w-3xl px-6 py-12">
		<div use:reveal={{ y: 20 }}>
			<h1
				class="font-display text-4xl font-bold tracking-tight text-ink"
				style="letter-spacing:-0.02em"
			>
				Settings
			</h1>
			<p class="mt-3 text-lg text-ink-soft">Manage your profile and public link.</p>
		</div>

		{#if loading}
			<LoadingState message="Loading your profile…" />
		{:else if loadError}
			<div
				role="alert"
				class="mt-10 rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600"
			>
				<span class="mr-2" aria-hidden="true">⚠️</span>{loadError}
			</div>
		{:else}
			<!-- ─── Public username ─────────────────────────────────────────── -->
			<section
				class="mt-10 overflow-hidden rounded-[2rem] border border-surface-muted bg-white p-8 shadow-sm sm:p-10"
				use:reveal={{ y: 20, delay: 60 }}
			>
				<h2 class="font-display text-2xl font-bold tracking-tight text-ink">Public username</h2>
				<p class="mt-2 text-sm text-ink-soft">
					This is the address people use to reach your portfolio.
				</p>

				<form class="mt-6 space-y-4" onsubmit={saveUsername}>
					<div class="space-y-2">
						<label
							for="settings-username"
							class="ml-1 text-xs font-bold tracking-widest text-ink-muted uppercase"
						>
							Username
						</label>
						<div class="relative">
							<span
								class="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 text-base font-medium text-ink-muted select-none"
								aria-hidden="true">/u/</span
							>
							<input
								id="settings-username"
								type="text"
								autocapitalize="none"
								spellcheck="false"
								maxlength={30}
								bind:value={username}
								oninput={onUsernameInput}
								disabled={savingUsername || inCooldown}
								aria-describedby="settings-username-hint"
								aria-invalid={usernameState === 'taken' || usernameState === 'invalid'}
								class="w-full rounded-2xl border bg-surface-subtle/50 py-4 pr-12 pl-14 text-base font-medium text-ink transition-all outline-none focus:bg-white focus:ring-2 disabled:opacity-60
									{usernameState === 'taken' || usernameState === 'invalid'
										? 'border-red-300 focus:border-red-400 focus:ring-red-100'
										: usernameState === 'available'
											? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
											: 'border-surface-muted focus:border-brand/60 focus:ring-brand/15'}"
								placeholder="janedoe"
							/>
							{#if usernameState === 'checking'}
								<span class="absolute top-1/2 right-5 -translate-y-1/2"><Spinner size="sm" /></span>
							{:else if usernameState === 'available'}
								<span
									class="absolute top-1/2 right-5 -translate-y-1/2 text-lg text-emerald-500"
									aria-hidden="true">✓</span
								>
							{:else if usernameState === 'taken' || usernameState === 'invalid'}
								<span
									class="absolute top-1/2 right-5 -translate-y-1/2 text-lg text-red-500"
									aria-hidden="true">✕</span
								>
							{/if}
						</div>
						<p
							id="settings-username-hint"
							aria-live="polite"
							class="ml-1 text-xs {usernameState === 'available'
								? 'text-emerald-600'
								: usernameState === 'taken' || usernameState === 'invalid'
									? 'text-red-600'
									: 'text-ink-muted'}"
						>
							{usernameHint ||
								(profile?.username
									? `Your portfolio lives at /u/${profile.username}`
									: 'Choose a username to get a public link.')}
						</p>
					</div>

					{#if inCooldown && cooldownUntil}
						<div
							class="rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-4 text-sm font-medium text-amber-800"
						>
							Changing your username breaks links you've already shared, so it can only be
							changed once every 30 days. You can change it again on
							<span class="font-bold">{formatDate(cooldownUntil)}</span>.
						</div>
					{:else}
						<p class="ml-1 text-xs text-ink-muted">
							Changing this breaks links you've already shared. Your old username keeps
							working for 30 days, then becomes available to others.
						</p>
					{/if}

					{#if usernameError}
						<div
							role="alert"
							class="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600"
						>
							<span class="mr-2" aria-hidden="true">⚠️</span>{usernameError}
						</div>
					{/if}
					{#if usernameSuccess}
						<div
							role="status"
							class="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-5 py-4 text-sm font-bold text-emerald-700"
						>
							<span class="mr-2" aria-hidden="true">✓</span>{usernameSuccess}
						</div>
					{/if}

					<button
						type="submit"
						disabled={savingUsername ||
							inCooldown ||
							!usernameChanged ||
							usernameState === 'taken' ||
							usernameState === 'invalid' ||
							usernameState === 'checking'}
						class="flex items-center justify-center gap-2 rounded-2xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-40 disabled:hover:bg-brand"
					>
						{#if savingUsername}
							<Spinner size="sm" /><span>Saving…</span>
						{:else}
							Update username
						{/if}
					</button>
				</form>
			</section>

			<!-- ─── Display name ────────────────────────────────────────────── -->
			<section
				class="mt-6 overflow-hidden rounded-[2rem] border border-surface-muted bg-white p-8 shadow-sm sm:p-10"
				use:reveal={{ y: 20, delay: 120 }}
			>
				<h2 class="font-display text-2xl font-bold tracking-tight text-ink">Display name</h2>
				<p class="mt-2 text-sm text-ink-soft">Shown in the app. Change it any time.</p>

				<form class="mt-6 space-y-4" onsubmit={saveName}>
					<div class="space-y-2">
						<label
							for="settings-name"
							class="ml-1 text-xs font-bold tracking-widest text-ink-muted uppercase"
						>
							Full name
						</label>
						<input
							id="settings-name"
							type="text"
							autocomplete="name"
							maxlength={100}
							bind:value={name}
							disabled={savingName}
							class="w-full rounded-2xl border border-surface-muted bg-surface-subtle/50 px-6 py-4 text-base font-medium text-ink transition-all outline-none focus:border-brand/60 focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60"
							placeholder="Jane Doe"
						/>
					</div>

					{#if nameMessage}
						<p class="ml-1 text-xs font-bold text-ink-soft" aria-live="polite">{nameMessage}</p>
					{/if}

					<button
						type="submit"
						disabled={savingName || !name.trim() || name === profile?.name}
						class="flex items-center justify-center gap-2 rounded-2xl bg-ink px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
					>
						{#if savingName}
							<Spinner size="sm" /><span>Saving…</span>
						{:else}
							Save name
						{/if}
					</button>
				</form>
			</section>
		{/if}
	</main>
</div>
