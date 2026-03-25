<script lang="ts">
	import { onMount } from 'svelte';

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	const navLinks = [
		{ label: 'Features', href: '#features' },
		{ label: 'How It Works', href: '#how-it-works' },
		{ label: 'Templates', href: '#templates' }
	];

	onMount(() => {
		let rafId = 0;
		function onScroll() {
			if (rafId) return;
			rafId = requestAnimationFrame(() => {
				scrolled = window.scrollY > 30;
				rafId = 0;
			});
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (rafId) cancelAnimationFrame(rafId);
		};
	});
</script>

<nav
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-500 {scrolled
		? 'glass border-b border-slate-200 py-3 shadow-sm'
		: 'bg-transparent py-5'}"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6">
		<!-- Logo -->
		<a href="/" class="group flex items-center gap-2 text-2xl font-bold tracking-tight">
			<div
				class="flex h-10 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md transition-transform group-hover:rotate-12"
			>
				<span class="text-sm font-black tracking-tighter">AI</span>
			</div>
			<span class="text-slate-900 transition-colors">folio</span>
		</a>

		<!-- Desktop nav links -->
		<div class="hidden items-center gap-2 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="group relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<!-- Desktop CTAs -->
		<div class="hidden items-center gap-4 md:flex">
			<a
				href="/login"
				class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
			>
				Log In
			</a>
			<a
				href="/signup"
				class="relative overflow-hidden rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-slate-800 active:scale-95 group"
			>
				<span class="relative z-10">Get Started</span>
			</a>
		</div>

		<!-- Mobile hamburger -->
		<button
			class="flex h-11 w-11 items-center justify-center text-slate-900 transition-colors md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileMenuOpen}
			aria-controls="mobile-nav"
		>
			{#if mobileMenuOpen}
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{:else}
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			{/if}
		</button>
	</div>

	<!-- Mobile menu dropdown -->
	{#if mobileMenuOpen}
		<div id="mobile-nav" class="border-t border-slate-100 bg-white px-6 py-4 md:hidden shadow-lg">
			<div class="flex flex-col gap-4">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium text-slate-600 hover:text-slate-900"
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<div class="h-px w-full bg-slate-100"></div>
				<a
					href="/login"
					class="text-sm font-medium text-slate-600 hover:text-slate-900"
					onclick={() => (mobileMenuOpen = false)}
				>
					Log In
				</a>
				<a
					href="/signup"
					class="block w-full rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white"
					onclick={() => (mobileMenuOpen = false)}
				>
					Get Started
				</a>
			</div>
		</div>
	{/if}
</nav>
