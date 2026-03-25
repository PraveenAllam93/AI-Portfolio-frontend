<script lang="ts">
	import { goto } from '$app/navigation';
	import { forgotPassword, resetPassword } from '$lib/services/auth';
	import { reveal } from '$lib/actions/animate';
	import Spinner from '$lib/components/common/Spinner.svelte';

	type Step = 'request' | 'reset' | 'done';

	let step = $state<Step>('request');
	let email = $state('');
	let code = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);

	async function handleRequestCode(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		isLoading = true;

		const result = await forgotPassword(email);

		if (result.success) {
			step = 'reset';
		} else {
			errorMessage = result.error ?? 'Could not send reset email.';
		}

		isLoading = false;
	}

	async function handleResetPassword(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';

		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		if (newPassword.length < 8) {
			errorMessage = 'Password must be at least 8 characters.';
			return;
		}

		isLoading = true;

		const result = await resetPassword(email, code, newPassword);

		if (result.success) {
			step = 'done';
		} else {
			errorMessage = result.error ?? 'Password reset failed.';
		}

		isLoading = false;
	}
</script>

<svelte:head>
	<title>Reset Password — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen bg-surface-subtle">
	<!-- Left panel -->
	<div
		class="relative hidden flex-col items-center justify-center overflow-hidden border-r border-slate-200 bg-surface-subtle p-12 lg:flex lg:w-[45%]"
	>
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.03]"
			style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 40px 40px;"
		></div>

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
				Secure password reset.<br />Back to building your portfolio.
			</p>
		</div>

		<div class="relative z-10 mt-16 flex flex-col gap-4">
			{#each [{ text: 'Enter your email address', icon: '📧', active: step === 'request' }, { text: 'Enter the code from email', icon: '🔑', active: step === 'reset' }, { text: 'Set your new password', icon: '✅', active: step === 'done' }] as item}
				<div
					class="flex items-center gap-4 rounded-2xl border px-6 py-4 text-sm font-bold shadow-sm transition-all {item.active
						? 'border-slate-900 bg-slate-900 text-white'
						: 'border-slate-200 bg-white text-slate-500'}"
				>
					<span class="flex h-8 w-8 items-center justify-center rounded-lg {item.active ? 'bg-white/10' : 'bg-slate-50'} text-lg">
						{item.icon}
					</span>
					<span class="tracking-wide">{item.text}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Right panel -->
	<div class="relative flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
		<div class="relative w-full max-w-md" use:reveal={{ y: 24, delay: 100 }}>
			<!-- Mobile logo -->
			<div class="mb-10 text-center lg:hidden">
				<a href="/" class="inline-flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
						<span class="text-sm font-black">AI</span>
					</div>
					<span>folio</span>
				</a>
			</div>

			<div class="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl sm:p-12">

				{#if step === 'request'}
					<!-- Step 1: Enter email -->
					<div class="mb-10">
						<h1 class="font-serif text-4xl font-bold tracking-tight text-slate-900">Forgot password?</h1>
						<p class="mt-3 text-lg text-slate-500">Enter your email and we'll send a reset code.</p>
					</div>

					<form class="space-y-6" onsubmit={handleRequestCode} aria-label="Request password reset">
						{#if errorMessage}
							<div
								role="alert"
								aria-live="assertive"
								class="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600"
							>
								<span class="mr-2" aria-hidden="true">⚠️</span>
								{errorMessage}
							</div>
						{/if}

						<div class="space-y-2">
							<label for="email" class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								autocomplete="email"
								required
								bind:value={email}
								disabled={isLoading}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-base font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="you@example.com"
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
									<span>Sending code...</span>
								{:else}
									Send Reset Code
								{/if}
							</span>
						</button>
					</form>

				{:else if step === 'reset'}
					<!-- Step 2: Enter code + new password -->
					<div class="mb-10">
						<h1 class="font-serif text-4xl font-bold tracking-tight text-slate-900">Set new password</h1>
						<p class="mt-3 text-lg text-slate-500">
							Check <span class="font-bold text-slate-700">{email}</span> for the code.
						</p>
					</div>

					<form class="space-y-6" onsubmit={handleResetPassword} aria-label="Reset your password">
						{#if errorMessage}
							<div
								role="alert"
								aria-live="assertive"
								class="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600"
							>
								<span class="mr-2" aria-hidden="true">⚠️</span>
								{errorMessage}
							</div>
						{/if}

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
								bind:value={code}
								disabled={isLoading}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-center font-mono text-xl font-bold tracking-[0.5em] text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="000000"
							/>
						</div>

						<div class="space-y-2">
							<label for="new-password" class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
								New Password
							</label>
							<input
								id="new-password"
								type="password"
								autocomplete="new-password"
								required
								bind:value={newPassword}
								disabled={isLoading}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-base font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="Min. 8 characters"
							/>
						</div>

						<div class="space-y-2">
							<label for="confirm-password" class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
								Confirm Password
							</label>
							<input
								id="confirm-password"
								type="password"
								autocomplete="new-password"
								required
								bind:value={confirmPassword}
								disabled={isLoading}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-base font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="••••••••"
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
									<span>Resetting...</span>
								{:else}
									Reset Password
								{/if}
							</span>
						</button>

						<button
							type="button"
							onclick={() => { step = 'request'; errorMessage = ''; }}
							class="w-full text-center text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
						>
							← Use a different email
						</button>
					</form>

				{:else}
					<!-- Step 3: Success -->
					<div class="flex flex-col items-center py-4 text-center">
						<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-4xl text-white shadow-xl">
							✓
						</div>
						<h1 class="font-serif text-4xl font-bold tracking-tight text-slate-900">Password reset!</h1>
						<p class="mt-4 text-lg text-slate-500">
							Your password has been updated. You can now log in with your new password.
						</p>
						<button
							onclick={() => goto('/login')}
							class="mt-10 flex w-full items-center justify-center rounded-2xl bg-slate-900 py-5 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95"
						>
							Go to Login
						</button>
					</div>
				{/if}

			</div>

			<div class="mt-8 text-center">
				<p class="text-sm text-slate-500">
					Remember your password?
					<a href="/login" class="ml-1 font-bold text-slate-900 transition-colors hover:underline">
						Log in
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
