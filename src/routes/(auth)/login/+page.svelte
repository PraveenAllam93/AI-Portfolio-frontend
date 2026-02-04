<script lang="ts">
	import { goto } from '$app/navigation';
	import { handleSignIn } from '$lib/utils/auth';

	let email = $state('');
	let password = $state('');

	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	async function onLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';
		success = '';

		const result = await handleSignIn({ email, password });

		if (result.success) {
			success = 'Logged in successfully! Redirecting...';
			setTimeout(() => goto('/home'), 1000);
		} else {
			error = result.error || 'Failed to log in';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Log In — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-peach-50 px-6">
	<div class="w-full max-w-md">
		<div class="text-center">
			<a href="/" class="font-serif text-2xl font-bold text-charcoal">AIfolio</a>
			<h1 class="mt-6 font-serif text-3xl font-bold text-charcoal">Log in to your account</h1>
			<p class="mt-2 text-sm text-charcoal-light">
				Welcome back. Enter your credentials to continue.
			</p>
		</div>

		{#if error}
			<div class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
				{error}
			</div>
		{/if}

		{#if success}
			<div class="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
				{success}
			</div>
		{/if}

		<form class="mt-8 space-y-5" onsubmit={onLogin}>
			<div>
				<label for="email" class="block text-sm font-medium text-charcoal">Email</label>
				<input
					id="email"
					type="email"
					autocomplete="email"
					required
					bind:value={email}
					disabled={loading}
					class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral disabled:opacity-50"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-charcoal">Password</label>
				<input
					id="password"
					type="password"
					autocomplete="current-password"
					required
					bind:value={password}
					disabled={loading}
					class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral disabled:opacity-50"
					placeholder="Your password"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-full bg-charcoal py-3.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Logging In...' : 'Log In'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-charcoal-light">
			Don&apos;t have an account?
			<a href="/signup" class="font-semibold text-coral hover:text-coral-dark">Sign up</a>
		</p>
	</div>
</div>
