<script lang="ts">
	import { goto } from '$app/navigation';
	import { register, confirmEmail, resendConfirmationCode } from '$lib/services/auth';
	import { reveal } from '$lib/actions/animate';
import Spinner from '$lib/components/common/Spinner.svelte';

	let step: 'register' | 'confirm' = $state('register');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmationCode = $state('');
	let resendCooldown = $state(0);
	let errorMessage = $state('');
	let successMessage = $state('');
	let isLoading = $state(false);

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		isLoading = true;

		const result = await register({ name, email, password });

		if (result.success) {
			if (result.data?.needsConfirmation) {
				step = 'confirm';
				successMessage = `We've sent a verification code to ${email}`;
			} else {
				await goto('/app/dashboard');
			}
		} else {
			errorMessage = result.error ?? 'Sign up failed.';
		}

		isLoading = false;
	}

	async function handleConfirm(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		isLoading = true;

		const result = await confirmEmail(email, confirmationCode);

		if (result.success) {
			await goto('/login?confirmed=true');
		} else {
			errorMessage = result.error ?? 'Confirmation failed.';
		}

		isLoading = false;
	}

	async function handleResend() {
		if (resendCooldown > 0) return;
		errorMessage = '';
		successMessage = '';

		const result = await resendConfirmationCode(email);

		if (result.success) {
			successMessage = 'A new code has been sent to your email.';
			resendCooldown = 30;
			const interval = setInterval(() => {
				resendCooldown -= 1;
				if (resendCooldown <= 0) clearInterval(interval);
			}, 1000);
		} else {
			errorMessage = result.error ?? 'Could not resend code.';
		}
	}
</script>

<svelte:head>
	<title>Sign Up — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen bg-surface-subtle">
	<!-- Left panel — Clean Brand Side -->
	<div
		class="relative hidden flex-col items-center justify-center overflow-hidden border-r border-slate-200 bg-surface-subtle p-12 lg:flex lg:w-[45%]"
	>
		<!-- Background decoration -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.03]"
			style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 40px 40px;"
		></div>

		{#if step === 'register'}
			<div class="relative z-10 text-center">
				<a
					href="/"
					class="group mb-8 inline-flex items-center gap-2 text-4xl font-bold tracking-tight text-slate-900"
				>
					<div
						class="flex h-12 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition-transform group-hover:rotate-12"
					>
						<span class="text-lg font-black tracking-tighter">AI</span>
					</div>
					<span>folio</span>
				</a>
				<p class="mt-6 text-xl leading-relaxed text-slate-600">
					Create your professional online<br />presence in seconds.
				</p>
			</div>

			<div class="relative z-10 mt-16 flex flex-col gap-4">
				{#each [{ icon: '01', label: 'Upload your resume', desc: 'PDF or Word file' }, { icon: '02', label: 'Pick a template', desc: 'Tailored for your role' }, { icon: '03', label: 'Go live instantly', desc: 'Hosted on our fast edge network' }] as item}
					<div
						class="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
					>
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500"
						>
							{item.icon}
						</div>
						<div>
							<p class="text-sm font-bold text-slate-900">{item.label}</p>
							<p class="text-xs text-slate-500">{item.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="relative z-10 text-center">
				<div
					class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 border border-slate-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-10 w-10 text-slate-900"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
						/>
					</svg>
				</div>
				<p class="font-serif text-4xl font-bold text-slate-900">Verify Email</p>
				<p class="mt-4 text-lg text-slate-600">
					A 6-digit verification code<br />
					was sent to <span class="font-bold text-slate-900">{email}</span>
				</p>
			</div>
		{/if}
	</div>

	<!-- Right panel — Form -->
	<div class="relative flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
		<div class="relative w-full max-w-md" use:reveal={{ y: 24, delay: 100 }}>
			<!-- Mobile logo -->
			<div class="mb-10 text-center lg:hidden">
				<a href="/" class="inline-flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md"
					>
						<span class="text-sm font-black">AI</span>
					</div>
					<span>folio</span>
				</a>
			</div>

			<div class="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl sm:p-12">
				{#if step === 'register'}
					<div class="mb-10">
						<h1 class="font-serif text-4xl font-bold tracking-tight text-slate-900">Get Started</h1>
						<p class="mt-3 text-lg text-slate-500">Create your account for free.</p>
					</div>

					{#if errorMessage}
						<div
							id="register-error"
							role="alert"
							aria-live="assertive"
							class="mb-6 rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600"
						>
							<span class="mr-2" aria-hidden="true">⚠️</span>
							{errorMessage}
						</div>
					{/if}

					<form class="space-y-5" onsubmit={handleRegister} aria-label="Create your account">
						<div class="space-y-2">
							<label
								for="name"
								class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase"
								>Full Name</label
							>
							<input
								id="name"
								type="text"
								autocomplete="name"
								required
								bind:value={name}
								disabled={isLoading}
								aria-describedby={errorMessage ? 'register-error' : undefined}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-base font-medium text-slate-900 transition-all outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="Jane Doe"
							/>
						</div>

						<div class="space-y-2">
							<label
								for="signup-email"
								class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase"
								>Email Address</label
							>
							<input
								id="signup-email"
								type="email"
								autocomplete="email"
								required
								bind:value={email}
								disabled={isLoading}
								aria-describedby={errorMessage ? 'register-error' : undefined}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-base font-medium text-slate-900 transition-all outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="you@example.com"
							/>
						</div>

						<div class="space-y-2">
							<label
								for="signup-password"
								class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase"
								>Password</label
							>
							<input
								id="signup-password"
								type="password"
								autocomplete="new-password"
								required
								minlength={8}
								bind:value={password}
								disabled={isLoading}
								aria-describedby={errorMessage ? 'register-error' : 'password-hint'}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-base font-medium text-slate-900 transition-all outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="Create password"
							/>
							<p id="password-hint" class="ml-1 text-xs text-slate-400">Minimum 8 characters</p>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							aria-busy={isLoading}
							class="group relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 py-5 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95 disabled:opacity-50"
						>
							<span class="relative z-10 flex items-center gap-2">
								{#if isLoading}
									<Spinner size="sm" />
									<span>Creating...</span>
								{:else}
									Create Account
								{/if}
							</span>
						</button>
					</form>

					<div class="mt-10 border-t border-slate-100 pt-8 text-center">
						<p class="text-sm text-slate-500">
							Already have an account?
							<a
								href="/login"
								class="ml-1 font-bold text-slate-900 transition-colors hover:underline"
								>Log in</a
							>
						</p>
					</div>
				{:else}
					<div class="mb-10">
						<h1 class="font-serif text-4xl font-bold tracking-tight text-slate-900">Enter Code</h1>
						<p class="mt-3 text-lg text-slate-500">
							Please enter the 6-digit code sent to your email.
						</p>
					</div>

					{#if errorMessage}
						<div
							id="confirm-error"
							role="alert"
							aria-live="assertive"
							class="mb-6 rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600"
						>
							<span class="mr-2" aria-hidden="true">⚠️</span>
							{errorMessage}
						</div>
					{/if}
					{#if successMessage}
						<div
							id="confirm-success"
							role="status"
							aria-live="polite"
							class="mb-6 rounded-2xl border border-green-100 bg-green-50/50 px-5 py-4 text-sm font-bold text-green-600"
						>
							<span class="mr-2" aria-hidden="true">✅</span>
							{successMessage}
						</div>
					{/if}

					<form class="space-y-8" onsubmit={handleConfirm} aria-label="Verify your email">
						<div class="space-y-2">
							<label for="code" class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
								Verification Code
							</label>
							<input
								id="code"
								type="text"
								inputmode="numeric"
								autocomplete="one-time-code"
								required
								maxlength={6}
								bind:value={confirmationCode}
								disabled={isLoading}
								aria-describedby={errorMessage ? 'confirm-error' : successMessage ? 'confirm-success' : undefined}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-6 text-center font-mono text-3xl tracking-[0.6em] text-slate-900 transition-all outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="000000"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							aria-busy={isLoading}
							class="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 py-5 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95 disabled:opacity-50"
						>
							<span class="relative z-10 flex items-center gap-2">
								{#if isLoading}
									<Spinner size="sm" />
									<span>Verifying...</span>
								{:else}
									Verify Email
								{/if}
							</span>
						</button>
					</form>

					<div class="mt-10 border-t border-slate-100 pt-8 text-center">
						<button
							onclick={handleResend}
							disabled={resendCooldown > 0}
							aria-label={resendCooldown > 0 ? `Resend available in ${resendCooldown} seconds` : 'Resend verification code'}
							class="text-sm font-bold text-slate-500 transition-colors hover:text-slate-900 disabled:opacity-50 disabled:hover:text-slate-500"
						>
							{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
