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
	<title>Log In — Portfolio.ai</title>
</svelte:head>

<div class="flex min-h-screen bg-surface-subtle">
	<!-- Left panel — Brand Side -->
	<div
		class="relative hidden flex-col items-center justify-center overflow-hidden border-r border-surface-muted bg-surface-subtle p-12 lg:flex lg:w-[45%]"
	>
		<!-- Background dot grid -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.03]"
			style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 40px 40px;"
		></div>

		<div class="relative z-10 text-center">
			<a
				href="/"
				class="group mb-8 inline-flex items-center gap-1.5 font-display text-4xl font-black tracking-tight text-ink"
				style="letter-spacing:-0.03em"
			>
				<div class="h-3 w-3 rounded-full bg-brand mr-1 shrink-0 transition-transform group-hover:scale-125"></div>
				Portfolio<span class="text-brand">.ai</span>
			</a>
			<p class="mt-4 text-lg leading-relaxed text-ink-soft">
				The easiest way to build your<br />professional presence online.
			</p>
		</div>

		<!-- Feature pills -->
		<div class="relative z-10 mt-14 flex flex-col gap-3">
			{#each [{ text: 'Upload your resume', icon: '📄' }, { text: 'AI writes your content', icon: '✨' }, { text: 'Instant public URL', icon: '🌐' }] as item}
				<div
					class="flex items-center gap-4 rounded-2xl border border-surface-muted bg-white px-6 py-4 text-sm font-bold text-ink-soft shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
				>
					<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-subtle text-lg">
						{item.icon}
					</span>
					<span class="tracking-wide">{item.text}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Right panel — Form -->
	<div class="relative flex flex-1 flex-col items-center justify-center bg-surface-subtle px-6 py-12">
		<div class="relative w-full max-w-md" use:reveal={{ y: 24, delay: 100 }}>
			<!-- Mobile logo -->
			<div class="mb-10 text-center lg:hidden">
				<a href="/" class="inline-flex items-center gap-1 font-display text-2xl font-black tracking-tight text-ink" style="letter-spacing:-0.03em">
					<div class="h-2.5 w-2.5 rounded-full bg-brand mr-0.5 shrink-0"></div>
					Portfolio<span class="text-brand">.ai</span>
				</a>
			</div>

			<div class="overflow-hidden rounded-[2.5rem] border border-surface-muted bg-white p-10 shadow-xl sm:p-12">
				<div class="mb-10">
					<h1 class="font-display text-4xl font-bold tracking-tight text-ink" style="letter-spacing:-0.02em">Welcome back</h1>
					<p class="mt-3 text-lg text-ink-soft">Log in to your workspace.</p>
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
						<label for="email" class="ml-1 text-xs font-bold tracking-widest text-ink-muted uppercase">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							disabled={isLoading}
							aria-describedby={errorMessage ? 'login-error' : undefined}
							class="w-full rounded-2xl border border-surface-muted bg-surface-subtle/50 px-6 py-4 text-base font-medium text-ink transition-all outline-none placeholder:text-ink-muted focus:border-brand/60 focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60"
							placeholder="you@example.com"
						/>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between px-1">
							<label for="password" class="text-xs font-bold tracking-widest text-ink-muted uppercase">Password</label>
							<a href="/forgot-password" class="text-xs font-bold text-brand transition-colors hover:text-brand-dark">
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
							class="w-full rounded-2xl border border-surface-muted bg-surface-subtle/50 px-6 py-4 text-base font-medium text-ink transition-all outline-none placeholder:text-ink-muted focus:border-brand/60 focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						aria-busy={isLoading}
						class="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-brand py-5 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 disabled:opacity-50"
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

				<div class="mt-10 border-t border-surface-muted pt-8 text-center">
					<p class="text-sm text-ink-soft">
						Don't have an account?
						<a href="/signup" class="ml-1 font-bold text-ink transition-colors hover:underline">Sign up</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
