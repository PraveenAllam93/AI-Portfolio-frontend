<script lang="ts">
	import { goto } from '$app/navigation';
	import { handleSignUp, handleConfirmSignUp } from '$lib/utils/auth';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let verificationCode = $state('');

	let loading = $state(false);
	let error = $state('');
	let success = $state('');
	let needsVerification = $state(false);

	async function onSignUp(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';
		success = '';

		// Validate password
		if (password.length < 8) {
			error = 'Password must be at least 8 characters long';
			loading = false;
			return;
		}
		if (!/[A-Z]/.test(password)) {
			error = 'Password must contain at least one uppercase letter';
			loading = false;
			return;
		}
		if (!/[a-z]/.test(password)) {
			error = 'Password must contain at least one lowercase letter';
			loading = false;
			return;
		}
		if (!/[0-9]/.test(password)) {
			error = 'Password must contain at least one number';
			loading = false;
			return;
		}

		const result = await handleSignUp({ name, email, password });

		if (result.success) {
			success = result.message || 'Account created successfully!';
			needsVerification = true;
		} else {
			error = result.error || 'Failed to create account';
		}

		loading = false;
	}

	async function onVerifyEmail(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const result = await handleConfirmSignUp(email, verificationCode);

		if (result.success) {
			success = 'Email verified! Redirecting to login...';
			setTimeout(() => goto('/login'), 2000);
		} else {
			error = result.error || 'Failed to verify email';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Sign Up — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-peach-50 px-6">
	<div class="w-full max-w-md">
		<div class="text-center">
			<a href="/" class="font-serif text-2xl font-bold text-charcoal">AIfolio</a>
			<h1 class="mt-6 font-serif text-3xl font-bold text-charcoal">
				{needsVerification ? 'Verify your email' : 'Create your AIfolio account'}
			</h1>
			<p class="mt-2 text-sm text-charcoal-light">
				{needsVerification ? 'Enter the verification code sent to your email' : 'Start building your portfolio website in minutes.'}
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

		{#if !needsVerification}
			<form class="mt-8 space-y-5" onsubmit={onSignUp}>
				<div>
					<label for="name" class="block text-sm font-medium text-charcoal">Full name</label>
					<input
						id="name"
						type="text"
						autocomplete="name"
						required
						bind:value={name}
						disabled={loading}
						class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral disabled:opacity-50"
						placeholder="Jane Doe"
					/>
				</div>

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
						autocomplete="new-password"
						required
						bind:value={password}
						disabled={loading}
						class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral disabled:opacity-50"
						placeholder="Create a password"
					/>
					<p class="mt-1.5 text-xs text-charcoal-light">
						At least 8 characters with uppercase, lowercase, and numbers
					</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-full bg-charcoal py-3.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Creating Account...' : 'Create Account'}
				</button>
			</form>
		{:else}
			<form class="mt-8 space-y-5" onsubmit={onVerifyEmail}>
				<div>
					<label for="code" class="block text-sm font-medium text-charcoal">Verification Code</label>
					<input
						id="code"
						type="text"
						required
						bind:value={verificationCode}
						disabled={loading}
						class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral disabled:opacity-50"
						placeholder="Enter 6-digit code"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-full bg-charcoal py-3.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Verifying...' : 'Verify Email'}
				</button>

				<button
					type="button"
					onclick={() => needsVerification = false}
					class="w-full text-sm text-charcoal-light hover:text-charcoal"
				>
					Back to signup
				</button>
			</form>
		{/if}

		<p class="mt-6 text-center text-sm text-charcoal-light">
			Already have an account?
			<a href="/login" class="font-semibold text-coral hover:text-coral-dark">Log in</a>
		</p>
	</div>
</div>
