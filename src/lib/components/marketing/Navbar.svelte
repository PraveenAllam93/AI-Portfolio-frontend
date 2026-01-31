<script lang="ts">
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	const navLinks = [
		{ label: 'Features', href: '#features' },
		{ label: 'How It Works', href: '#how-it-works' },
		{ label: 'Templates', href: '#templates' }
	];
</script>

<nav
	class="fixed top-0 right-0 left-0 z-50 border-b border-peach-200/60 bg-peach-50/80 backdrop-blur-md"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<!-- Logo -->
		<a href="/" class="font-serif text-2xl font-bold tracking-tight text-charcoal">
			AIfolio
		</a>

		<!-- Desktop Nav -->
		<div class="hidden items-center gap-8 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-medium text-charcoal-light transition-colors hover:text-charcoal"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<!-- Desktop Auth Buttons -->
		<div class="hidden items-center gap-4 md:flex">
			<a
				href="/login"
				class="text-sm font-medium text-charcoal-light transition-colors hover:text-charcoal"
			>
				Log In
			</a>
			<a
				href="/signup"
				class="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light"
			>
				Get Started
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<button
			class="flex items-center justify-center md:hidden"
			onclick={toggleMobileMenu}
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileMenuOpen}
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

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-peach-200/60 bg-peach-50 px-6 py-4 md:hidden">
			<div class="flex flex-col gap-4">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium text-charcoal-light transition-colors hover:text-charcoal"
						onclick={closeMobileMenu}
					>
						{link.label}
					</a>
				{/each}
				<hr class="border-peach-200" />
				<a
					href="/login"
					class="text-sm font-medium text-charcoal-light transition-colors hover:text-charcoal"
					onclick={closeMobileMenu}
				>
					Log In
				</a>
				<a
					href="/signup"
					class="inline-block rounded-full bg-charcoal px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-charcoal-light"
					onclick={closeMobileMenu}
				>
					Get Started
				</a>
			</div>
		</div>
	{/if}
</nav>
