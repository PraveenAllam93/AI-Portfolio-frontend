<script lang="ts">
	import { onMount } from 'svelte';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	onMount(() => {
		const handler = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handler, { passive: true });
		return () => window.removeEventListener('scroll', handler);
	});

	function smoothScroll(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
		mobileOpen = false;
	}
</script>

<nav class="nav" class:scrolled>
	<div class="nav-in">
		<a class="logo" href="/">
			<div class="logo-dot"></div>
			Portfolio<span>.ai</span>
		</a>

		<div class="nav-links">
			<a href="#how" onclick={() => smoothScroll('how')}>How It Works</a>
			<a href="#who" onclick={() => smoothScroll('who')}>Who It's For</a>
			<a href="#pricing" onclick={() => smoothScroll('pricing')}>Pricing</a>
		</div>

		<div class="nav-r">
			<a href="/login" class="btn-ghost-sm">Log in</a>
			<a href="/signup" class="btn-nav">Get Started Free</a>
		</div>

		<button
			class="hamburger"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileOpen}
		>
			{#if mobileOpen}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
				</svg>
			{:else}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
				</svg>
			{/if}
		</button>
	</div>

	{#if mobileOpen}
		<div class="mobile-menu">
			<a href="#how" onclick={() => smoothScroll('how')}>How It Works</a>
			<a href="#who" onclick={() => smoothScroll('who')}>Who It's For</a>
			<a href="#pricing" onclick={() => smoothScroll('pricing')}>Pricing</a>
			<div class="mobile-divider"></div>
			<a href="/login" class="mobile-login">Log in</a>
			<a href="/signup" class="mobile-cta">Get Started Free</a>
		</div>
	{/if}
</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 200;
		background: rgba(245, 240, 234, 0.97);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid transparent;
		transition: border-color 0.3s;
		padding: 0 48px;
	}
	.nav.scrolled {
		border-color: var(--color-warm-border);
	}
	.nav-in {
		max-width: 1160px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 62px;
	}
	.logo {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 17px;
		color: var(--color-warm-ink);
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 3px;
		letter-spacing: -0.02em;
	}
	.logo-dot {
		width: 7px;
		height: 7px;
		background: var(--color-warm-coral);
		border-radius: 50%;
		margin-right: 2px;
	}
	.logo span {
		color: var(--color-warm-coral);
	}
	.nav-links {
		display: flex;
		gap: 28px;
	}
	.nav-links a {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-warm-muted);
		text-decoration: none;
		transition: color 0.2s;
	}
	.nav-links a:hover {
		color: var(--color-warm-ink);
	}
	.nav-r {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.btn-ghost-sm {
		font-family: var(--font-body-dm);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-warm-muted);
		background: none;
		border: none;
		cursor: pointer;
		padding: 7px 14px;
		border-radius: 100px;
		text-decoration: none;
		transition: color 0.2s;
	}
	.btn-ghost-sm:hover {
		color: var(--color-warm-ink);
	}
	.btn-nav {
		font-family: var(--font-body-dm);
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		background: var(--color-warm-ink);
		border: none;
		cursor: pointer;
		padding: 9px 20px;
		border-radius: 100px;
		text-decoration: none;
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.btn-nav:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}
	.hamburger {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-warm-ink);
		padding: 4px;
	}
	.mobile-menu {
		border-top: 1px solid var(--color-warm-border);
		background: rgba(245, 240, 234, 0.98);
		padding: 16px 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.mobile-menu a {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-warm-muted);
		text-decoration: none;
	}
	.mobile-menu a:hover {
		color: var(--color-warm-ink);
	}
	.mobile-divider {
		height: 1px;
		background: var(--color-warm-border);
	}
	.mobile-login {
		font-weight: 600 !important;
	}
	.mobile-cta {
		background: var(--color-warm-ink);
		color: #fff !important;
		font-weight: 700 !important;
		padding: 10px 16px;
		border-radius: 100px;
		text-align: center;
	}
	@media (max-width: 768px) {
		.nav {
			padding: 0 24px;
		}
		.nav-links,
		.nav-r {
			display: none;
		}
		.hamburger {
			display: flex;
		}
	}
</style>
