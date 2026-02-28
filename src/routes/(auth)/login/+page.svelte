<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/services/auth';
	import { authStore } from '$lib/stores/auth';
	import { reveal } from '$lib/actions/animate';
import Spinner from '$lib/components/common/Spinner.svelte';

	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		isLoading = true;

		const result = await login({ email, password });

		if (result.success && result.data) {
			authStore.setUser(result.data);
			await goto('/app/dashboard');
		} else {
			errorMessage = result.error ?? 'Login failed.';
		}

		isLoading = false;
	}
</script>

<svelte:head>
	<title>Log In — AIfolio</title>
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

		<!-- Wordmark -->
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
				The easiest way to build your<br />professional presence online.
			</p>
		</div>

		<!-- Feature pills — Clean style -->
		<div class="relative z-10 mt-16 flex flex-col gap-4">
			{#each [{ text: 'Upload your resume', icon: '📄' }, { text: 'AI writes your content', icon: '✨' }, { text: 'Instant public URL', icon: '🌐' }] as item}
				<div
					class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
				>
					<span
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-lg"
					>
						{item.icon}
					</span>
					<span class="tracking-wide">{item.text}</span>
				</div>
			{/each}
		</div>
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
				<div class="mb-10">
					<h1 class="font-serif text-4xl font-bold tracking-tight text-slate-900">Welcome back</h1>
					<p class="mt-3 text-lg text-slate-500">Log in to your workspace.</p>
				</div>

				<form class="space-y-6" onsubmit={handleSubmit} aria-label="Log in to your account">
					{#if errorMessage}
						<div
							id="login-error"
							role="alert"
							aria-live="assertive"
							class="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm font-bold text-red-600"
						>
							<span class="mr-2" aria-hidden="true">⚠️</span>
							{errorMessage}
						</div>
					{/if}

					<div class="space-y-2">
						<label
							for="email"
							class="ml-1 text-xs font-bold tracking-widest text-slate-500 uppercase"
							>Email Address</label
						>
						<div class="group relative">
							<input
								id="email"
								type="email"
								autocomplete="email"
								required
								bind:value={email}
								disabled={isLoading}
								aria-describedby={errorMessage ? 'login-error' : undefined}
								class="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-base font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/50 disabled:opacity-60"
								placeholder="you@example.com"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between px-1">
							<label
								for="password"
								class="text-xs font-bold tracking-widest text-slate-500 uppercase">Password</label
							>
							<a
								href="/forgot-password"
								class="text-xs font-bold text-slate-900 transition-colors hover:text-slate-600"
							>
								Forgot?
							</a>
						</div>
						<input
							id="password"
							type="password"
							autocomplete="current-password"
							required
							bind:value={password}
							disabled={isLoading}
							aria-describedby={errorMessage ? 'login-error' : undefined}
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
								<span>Logging in...</span>
							{:else}
								Log In
							{/if}
						</span>
					</button>
				</form>

				<div class="mt-10 border-t border-slate-100 pt-8 text-center">
					<p class="text-sm text-slate-500">
						Don't have an account?
						<a
							href="/signup"
							class="ml-1 font-bold text-slate-900 transition-colors hover:underline"
							>Sign up</a
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
