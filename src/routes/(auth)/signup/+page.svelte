<script lang="ts">
	import { goto } from '$app/navigation';
	import { register, confirmEmail, resendConfirmationCode } from '$lib/services/auth';
	import { reveal } from '$lib/actions/animate';

	// Step: 'register' | 'confirm'
	let step: 'register' | 'confirm' = $state('register');

	// Register form
	let name = $state('');
	let email = $state('');
	let password = $state('');

	// Confirm form
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

<div class="flex min-h-screen">
	<!-- Left panel — gradient brand side -->
	<div
		class="gradient-bg relative hidden flex-col items-center justify-center overflow-hidden p-12 lg:flex lg:w-[45%]"
	>
		<!-- Background depth blobs -->
		<div class="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
		<div class="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

		{#if step === 'register'}
			<!-- Register left panel -->
			<div class="relative z-10 text-center">
				<a href="/" class="inline-block font-serif text-4xl font-bold text-white">AIfolio</a>
				<p class="mt-4 text-lg leading-relaxed text-white/80">
					Your resume deserves a<br />beautiful home online.
				</p>
			</div>

			<div class="relative z-10 mt-12 flex flex-col gap-4">
				{#each [
					{ icon: '01', label: 'Upload your resume' },
					{ icon: '02', label: 'AI extracts your content' },
					{ icon: '03', label: 'Your portfolio goes live' }
				] as step_item}
					<div class="flex items-center gap-4">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
							{step_item.icon}
						</div>
						<p class="text-sm font-medium text-white/90">{step_item.label}</p>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Confirm left panel -->
			<div class="relative z-10 text-center">
				<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-10 w-10 text-white">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
					</svg>
				</div>
				<p class="mt-6 font-serif text-3xl font-bold text-white">Check your inbox</p>
				<p class="mt-3 text-sm leading-relaxed text-white/80">
					We sent a 6-digit code to<br />
					<span class="font-semibold text-white">{email}</span>
				</p>
			</div>

			<p class="relative z-10 mt-10 max-w-xs text-center text-xs text-white/60">
				The code expires in 10 minutes. Check your spam folder if you don't see it.
			</p>
		{/if}
	</div>

	<!-- Right panel — form -->
	<div class="flex flex-1 flex-col items-center justify-center bg-[#F5F3FF] px-6 py-12">
		<div class="w-full max-w-md" use:reveal={{ y: 18, delay: 80 }}>
			<!-- Mobile logo -->
			<div class="mb-8 text-center lg:hidden">
				<a href="/" class="font-serif text-2xl font-bold">
					<span class="gradient-text">AI</span><span class="text-[#1E1033]">folio</span>
				</a>
			</div>

			<div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
				{#if step === 'register'}
					<div class="mb-6">
						<h1 class="font-serif text-2xl font-bold text-[#1E1033]">Create your account</h1>
						<p class="mt-1.5 text-sm text-[#4B5563]">Start building your portfolio — it's free.</p>
					</div>

					{#if errorMessage}
						<div class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{errorMessage}
						</div>
					{/if}

					<form class="space-y-5" onsubmit={handleRegister}>
						<div>
							<label for="name" class="block text-sm font-medium text-[#1E1033]">Full name</label>
							<input
								id="name"
								type="text"
								autocomplete="name"
								required
								bind:value={name}
								disabled={isLoading}
								class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1033] placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none disabled:opacity-60 transition-colors"
								placeholder="Jane Doe"
							/>
						</div>

						<div>
							<label for="email" class="block text-sm font-medium text-[#1E1033]">Email</label>
							<input
								id="email"
								type="email"
								autocomplete="email"
								required
								bind:value={email}
								disabled={isLoading}
								class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1033] placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none disabled:opacity-60 transition-colors"
								placeholder="you@example.com"
							/>
						</div>

						<div>
							<label for="password" class="block text-sm font-medium text-[#1E1033]">Password</label>
							<input
								id="password"
								type="password"
								autocomplete="new-password"
								required
								minlength={8}
								bind:value={password}
								disabled={isLoading}
								class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1033] placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none disabled:opacity-60 transition-colors"
								placeholder="Create a password"
							/>
							<p class="mt-1.5 text-xs text-gray-400">Minimum 8 characters</p>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							class="gradient-bg flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
						>
							{#if isLoading}
								<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
								</svg>
								Creating account…
							{:else}
								Create Account
							{/if}
						</button>
					</form>

					<p class="mt-6 text-center text-sm text-[#4B5563]">
						Already have an account?
						<a href="/login" class="font-semibold text-violet-600 hover:text-violet-800 transition-colors">Log in</a>
					</p>
				{:else}
					<!-- Email Confirmation Step -->
					<div class="mb-6">
						<h1 class="font-serif text-2xl font-bold text-[#1E1033]">Verify your email</h1>
						<p class="mt-1.5 text-sm text-[#4B5563]">Enter the 6-digit code we sent to <span class="font-medium text-[#1E1033]">{email}</span>.</p>
					</div>

					{#if errorMessage}
						<div class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{errorMessage}
						</div>
					{/if}

					{#if successMessage}
						<div class="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
							{successMessage}
						</div>
					{/if}

					<form class="space-y-5" onsubmit={handleConfirm}>
						<div>
							<label for="code" class="block text-sm font-medium text-[#1E1033]">Verification code</label>
							<input
								id="code"
								type="text"
								inputmode="numeric"
								autocomplete="one-time-code"
								required
								maxlength={6}
								bind:value={confirmationCode}
								disabled={isLoading}
								class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-center font-mono text-2xl tracking-[0.6em] text-[#1E1033] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none disabled:opacity-60 transition-colors"
								placeholder="000000"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							class="gradient-bg flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
						>
							{#if isLoading}
								<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
								</svg>
								Verifying…
							{:else}
								Verify Email
							{/if}
						</button>
					</form>

					<p class="mt-6 text-center text-sm text-[#4B5563]">
						Didn&apos;t receive a code?
						<button
							onclick={handleResend}
							disabled={resendCooldown > 0}
							class="font-semibold text-violet-600 hover:text-violet-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
						>
							{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
						</button>
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
