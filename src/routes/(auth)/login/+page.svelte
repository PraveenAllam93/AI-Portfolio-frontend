<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/services/auth';
	import { authStore } from '$lib/stores/auth';
	import { reveal } from '$lib/actions/animate';

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

<div class="flex min-h-screen">
	<!-- Left panel — gradient brand side -->
	<div
		class="gradient-bg relative hidden flex-col items-center justify-center overflow-hidden p-12 lg:flex lg:w-[45%]"
	>
		<!-- Background depth blobs -->
		<div
			class="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
		></div>
		<div
			class="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
		></div>

		<!-- Wordmark -->
		<div class="relative z-10 text-center">
			<a href="/" class="inline-block font-serif text-4xl font-bold text-white">
				AIfolio
			</a>
			<p class="mt-4 text-lg leading-relaxed text-white/80">
				Turn your resume into a stunning<br />portfolio in minutes.
			</p>
		</div>

		<!-- Feature pills -->
		<div class="relative z-10 mt-12 flex flex-col gap-3">
			{#each ['✦ AI-powered extraction', '✦ Instant deployment', '✦ Share your unique URL'] as item}
				<div class="flex items-center gap-3 rounded-full bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
					{item}
				</div>
			{/each}
		</div>

		<!-- Testimonial card -->
		<div class="relative z-10 mt-12 w-full max-w-xs rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
			<p class="text-sm leading-relaxed text-white/90 italic">
				"I uploaded my resume and had a live portfolio site within 5 minutes. Absolutely incredible."
			</p>
			<div class="mt-4 flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-xs font-bold text-white">
					S
				</div>
				<div>
					<p class="text-xs font-semibold text-white">Sarah K.</p>
					<p class="text-xs text-white/60">Product Designer</p>
				</div>
			</div>
		</div>
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
				<div class="mb-6">
					<h1 class="font-serif text-2xl font-bold text-[#1E1033]">Welcome back</h1>
					<p class="mt-1.5 text-sm text-[#4B5563]">Log in to your AIfolio account.</p>
				</div>

				<form class="space-y-5" onsubmit={handleSubmit}>
					{#if errorMessage}
						<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{errorMessage}
						</div>
					{/if}

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
						<div class="flex items-center justify-between">
							<label for="password" class="block text-sm font-medium text-[#1E1033]">Password</label>
							<a href="/forgot-password" class="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
								Forgot password?
							</a>
						</div>
						<input
							id="password"
							type="password"
							autocomplete="current-password"
							required
							bind:value={password}
							disabled={isLoading}
							class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1033] placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none disabled:opacity-60 transition-colors"
							placeholder="Your password"
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
							Logging in…
						{:else}
							Log In
						{/if}
					</button>
				</form>

				<p class="mt-6 text-center text-sm text-[#4B5563]">
					Don&apos;t have an account?
					<a href="/signup" class="font-semibold text-violet-600 hover:text-violet-800 transition-colors">Sign up free</a>
				</p>
			</div>
		</div>
	</div>
</div>
