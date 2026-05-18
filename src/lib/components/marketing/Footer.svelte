<footer>
	<div class="foot-in">
		<div class="foot-logo">Portfolio<span>.ai</span></div>
		<div class="foot-links">
			<a href="#how">How It Works</a>
			<a href="#who">Who It's For</a>
			<a href="#pricing">Pricing</a>
			<a href="/privacy">Privacy</a>
			<a href="/terms">Terms</a>
		</div>
		<div class="foot-r">Powered by Claude AI · Your data is never stored or shared.</div>
	</div>
</footer>

<style>
	footer {
		background: var(--color-warm-ink);
		color: #888;
		padding: 40px 48px;
	}
	.foot-in {
		max-width: 1160px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 16px;
	}
	.foot-logo {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 15px;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.foot-logo span {
		color: var(--color-warm-coral);
	}
	.foot-links {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}
	.foot-links a {
		font-size: 12px;
		color: #888;
		text-decoration: none;
		transition: color 0.2s;
	}
	.foot-links a:hover {
		color: #fff;
	}
	.foot-r {
		font-size: 11px;
		color: #555;
	}

	@media (max-width: 768px) {
		footer { padding: 32px 24px; }
		.foot-in { flex-direction: column; gap: 12px; }
	}
</style>
