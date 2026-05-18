<script lang="ts">
	const testimonials = [
		{
			quote:
				"I'd been job hunting for 3 months. Built my portfolio on a Sunday. Had two interview requests by Wednesday. The portfolio made the difference.",
			initials: 'NA',
			name: 'Nour A.',
			role: 'Marketing Manager · Dubai',
			avatarClass: 'ta-c'
		},
		{
			quote:
				"Recruiters started replying within a week of sharing my Portfolio.ai link. This is the best portfolio tool I've used.",
			initials: 'RL',
			name: 'Rohan L.',
			role: 'Product Designer · London',
			avatarClass: 'ta-i'
		},
		{
			quote:
				"I'm a final year student. My coursework and internship work looks like real projects now. Three companies asked me to come in.",
			initials: 'SK',
			name: 'Sara K.',
			role: 'Architecture Student · Beirut',
			avatarClass: 'ta-m'
		}
	];

	const logoPlaceholders = [
		'COMPANY', 'AGENCY', 'STUDIO', 'GROUP', 'PARTNERS', 'DESIGN CO', 'BRAND HQ', 'VENTURES'
	];
	const doubled = [...logoPlaceholders, ...logoPlaceholders];
</script>

<!-- Testimonials -->
<section id="testimonials">
	<div class="wrap">
		<h2 class="test-h">People stopped getting ignored.</h2>
		<div class="test-grid">
			{#each testimonials as t}
				<div class="test-card">
					<div class="test-q">"{t.quote}"</div>
					<div class="test-au">
						<div class="test-av {t.avatarClass}">{t.initials}</div>
						<div>
							<div class="test-nm">{t.name}</div>
							<div class="test-rl">{t.role}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Honest Proof -->
<section id="proof">
	<div class="wrap proof-inner">
		<div class="sec-lbl">
			<span class="lbl-dot"></span>COMPANIES WHERE OUR USERS GET HIRED
		</div>
		<h2 class="proof-h">This section is empty. For now.</h2>
		<p class="proof-sub">
			One day this will be full of logos. The companies where Portfolio.ai users got hired. We're
			not there yet. But we're building toward it, one portfolio at a time. If you get hired using
			Portfolio.ai, we want to hear from you.
		</p>
		<div class="scroll-wrap">
			<div class="scroll-track">
				{#each doubled as label}
					<div class="logo-ph">{label}</div>
				{/each}
			</div>
		</div>
		<div class="proof-cta">
			Got hired using Portfolio.ai? <a href="mailto:hello@portfolio.ai">Tell us → hello@portfolio.ai</a>
		</div>
	</div>
</section>

<style>
	/* Testimonials */
	#testimonials {
		background: var(--color-warm-cream);
		padding: 88px 48px;
	}
	.wrap {
		max-width: 1160px;
		margin: 0 auto;
	}
	.test-h {
		font-family: var(--font-display);
		font-size: clamp(24px, 3.5vw, 42px);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.08;
		max-width: 420px;
		margin-bottom: 40px;
		color: var(--color-warm-ink);
	}
	.test-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.test-card {
		background: #fff;
		border-radius: 12px;
		padding: 24px;
		border: 1px solid var(--color-warm-border);
	}
	.test-q {
		font-size: 13px;
		color: var(--color-warm-ink);
		line-height: 1.7;
		margin-bottom: 16px;
		font-style: italic;
	}
	.test-au {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.test-av {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 11px;
		color: #fff;
		flex-shrink: 0;
	}
	.ta-c { background: linear-gradient(135deg, var(--color-warm-coral), var(--color-warm-amber)); }
	.ta-i { background: linear-gradient(135deg, var(--color-warm-indigo), #8b73ff); }
	.ta-m { background: linear-gradient(135deg, var(--color-warm-mint), #00a07a); }
	.test-nm {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 12px;
		color: var(--color-warm-ink);
	}
	.test-rl { font-size: 11px; color: var(--color-warm-muted); }

	/* Proof */
	#proof {
		background: #fff;
		padding: 72px 48px;
		text-align: center;
	}
	.proof-inner {
		text-align: center;
	}
	.sec-lbl {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warm-muted);
		margin-bottom: 12px;
	}
	.lbl-dot {
		width: 5px;
		height: 5px;
		background: var(--color-warm-coral);
		border-radius: 50%;
	}
	.proof-h {
		font-family: var(--font-display);
		font-size: clamp(22px, 3vw, 38px);
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 10px;
		color: var(--color-warm-ink);
	}
	.proof-sub {
		font-size: 14px;
		color: var(--color-warm-muted);
		max-width: 520px;
		margin: 0 auto 32px;
		line-height: 1.7;
	}
	.scroll-wrap {
		overflow: hidden;
		position: relative;
		margin-bottom: 16px;
	}
	.scroll-wrap::before,
	.scroll-wrap::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 80px;
		z-index: 2;
	}
	.scroll-wrap::before {
		left: 0;
		background: linear-gradient(to right, #fff, transparent);
	}
	.scroll-wrap::after {
		right: 0;
		background: linear-gradient(to left, #fff, transparent);
	}
	.scroll-track {
		display: flex;
		gap: 24px;
		width: max-content;
		animation: marquee 26s linear infinite;
	}
	.logo-ph {
		width: 110px;
		height: 34px;
		background: var(--color-warm-border);
		border-radius: 6px;
		opacity: 0.3;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-warm-dim);
		letter-spacing: 0.04em;
		flex-shrink: 0;
	}
	@keyframes marquee {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}
	.proof-cta {
		font-size: 13px;
		color: var(--color-warm-coral);
		font-weight: 600;
	}
	.proof-cta a {
		color: inherit;
		text-decoration: none;
	}
	.proof-cta a:hover { text-decoration: underline; }

	@media (max-width: 900px) {
		#testimonials { padding: 56px 24px; }
		#proof { padding: 56px 24px; }
		.test-grid { grid-template-columns: 1fr; }
	}
</style>
