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
		function onScroll() {
			scrolled = window.scrollY > 30;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300 {scrolled
		? 'border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md'
		: 'border-b border-transparent bg-transparent'}"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-0.5 text-2xl font-bold tracking-tight">
			<span class="{scrolled ? 'gradient-text' : 'text-white'}">AI</span><span
				class="{scrolled ? 'text-ink' : 'text-white/90'}"
			>folio</span>
		</a>

		<!-- Desktop nav links -->
		<div class="hidden items-center gap-8 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="group relative text-sm font-medium transition-colors {scrolled
						? 'text-ink-soft hover:text-brand'
						: 'text-white/80 hover:text-white'}"
				>
					{link.label}
					<span
						class="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full {scrolled
							? 'bg-brand'
							: 'bg-white'}"
					></span>
				</a>
			{/each}
		</div>

		<!-- Desktop CTAs -->
		<div class="hidden items-center gap-4 md:flex">
			<a
				href="/login"
				class="text-sm font-medium transition-colors {scrolled
					? 'text-ink-soft hover:text-ink'
					: 'text-white/80 hover:text-white'}"
			>
				Log In
			</a>
			<a
				href="/signup"
				class="{scrolled
					? 'gradient-bg text-white shadow-md hover:scale-[1.03] hover:shadow-lg'
					: 'bg-white text-brand shadow-lg hover:scale-[1.02] hover:shadow-xl'} rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
			>
				Get Started
			</a>
		</div>

		<!-- Mobile hamburger -->
		<button
			class="flex items-center justify-center transition-colors md:hidden {scrolled
				? 'text-ink-soft'
				: 'text-white'}"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileMenuOpen}
		>
			{#if mobileMenuOpen}
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			{:else}
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- Mobile menu dropdown -->
	{#if mobileMenuOpen}
		<div class="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
			<div class="flex flex-col gap-4">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium text-ink-soft hover:text-brand"
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<div
					class="h-px w-full"
					style="background: linear-gradient(90deg, #6D28D9, #A855F7, #EC4899); opacity: 0.3"
				></div>
				<a
					href="/login"
					class="text-sm font-medium text-ink-soft hover:text-ink"
					onclick={() => (mobileMenuOpen = false)}
				>
					Log In
				</a>
				<a
					href="/signup"
					class="gradient-bg inline-block rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white"
					onclick={() => (mobileMenuOpen = false)}
				>
					Get Started
				</a>
			</div>
		</div>
	{/if}
</nav>
