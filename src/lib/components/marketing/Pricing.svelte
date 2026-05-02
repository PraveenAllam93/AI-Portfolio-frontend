<script lang="ts">
	let annual = $state(false);

	const proMonthly = { price: '$7', per: '/month', cta: 'Get Hired at $7/mo' };
	const proAnnual = { price: '$69', per: '/year', cta: 'Get Hired at $69/yr' };
	const pro = $derived(annual ? proAnnual : proMonthly);

	const freePlan = {
		plan: 'Try It',
		price: '$0',
		per: '/forever',
		sub: 'See what AI builds from your CV. No card needed.',
		features: [
			{ on: true, text: '2 AI-generated portfolios' },
			{ on: true, text: 'All 4 profession templates' },
			{ on: true, text: 'Shareable live link' },
			{ on: true, text: 'Basic AI suggestions' },
			{ on: false, text: 'Recruiter analytics' },
			{ on: false, text: 'Media upload' },
			{ on: false, text: 'Job description matching' },
			{ on: false, text: 'Watermark removed' }
		],
		cta: 'Start for Free',
		outline: true
	};

	const teamsPlan = {
		plan: 'Teams',
		price: "Let's talk",
		per: '',
		sub: 'For universities, bootcamps, and career programs.',
		features: [
			{ on: true, text: 'Everything in Pro' },
			{ on: true, text: 'Admin dashboard' },
			{ on: true, text: 'Student placement tracking' },
			{ on: true, text: 'Bulk CV uploads' },
			{ on: true, text: 'White-label option' },
			{ on: true, text: 'Dedicated support' }
		],
		cta: 'Contact Us',
		outline: true
	};

	const proFeatures = [
		{ on: true, text: 'Unlimited portfolios' },
		{ on: true, text: 'All 4 profession templates' },
		{ on: true, text: 'AI work story writer' },
		{ on: true, text: 'Media upload: images, video, decks' },
		{ on: true, text: 'Job description matching' },
		{ on: true, text: 'Recruiter analytics' },
		{ on: true, text: 'Custom domain' },
		{ on: true, text: 'No watermark' },
		{ on: true, text: 'Priority support' }
	];
</script>

<section id="pricing">
	<div class="wrap">
		<div class="sec-lbl" style="justify-content:center">
			<span class="lbl-dot"></span>PRICING
		</div>
		<h2 class="price-h">One portfolio. One job. Pays for itself on day one.</h2>
		<p class="price-sub">Start free. Upgrade when you're ready to get serious.</p>

		<div class="toggle-row">
			<span class="tgl-lbl" class:on={!annual}>Monthly</span>
			<button class="tgl" class:annual onclick={() => (annual = !annual)} aria-label="Toggle billing">
				<div class="tgl-k"></div>
			</button>
			<span class="tgl-lbl" class:on={annual}>Annual</span>
			{#if annual}
				<span class="save-tag">Save 27%</span>
			{/if}
		</div>

		<div class="price-grid">
			<!-- Free -->
			<div class="p-card">
				<div class="p-plan">{freePlan.plan}</div>
				<div class="p-amt">{freePlan.price}<span>{freePlan.per}</span></div>
				<div class="p-sub">{freePlan.sub}</div>
				<ul class="p-feats">
					{#each freePlan.features as f}
						<li class:on={f.on} class:off={!f.on}>
							<span class="fi">{f.on ? '✓' : '✗'}</span>{f.text}
						</li>
					{/each}
				</ul>
				<a href="/signup" class="btn-pg">{freePlan.cta}</a>
			</div>

			<!-- Pro (featured) -->
			<div class="p-card feat">
				<div class="pop-badge">Most Popular</div>
				<div class="p-plan">Get Hired</div>
				<div class="p-amt">{pro.price}<span>{pro.per}</span></div>
				<div class="p-sub">Everything you need to stand out and track who's paying attention.</div>
				<ul class="p-feats">
					{#each proFeatures as f}
						<li class="on"><span class="fi">✓</span>{f.text}</li>
					{/each}
				</ul>
				<a href="/signup" class="btn-pp">{pro.cta}</a>
				<div class="p-note">Cancel anytime. No contracts.</div>
			</div>

			<!-- Teams -->
			<div class="p-card">
				<div class="p-plan">{teamsPlan.plan}</div>
				<div class="p-amt teams-price">{teamsPlan.price}</div>
				<div class="p-sub">{teamsPlan.sub}</div>
				<ul class="p-feats">
					{#each teamsPlan.features as f}
						<li class:on={f.on} class:off={!f.on}>
							<span class="fi">{f.on ? '✓' : '✗'}</span>{f.text}
						</li>
					{/each}
				</ul>
				<a href="mailto:hello@portfolio.ai" class="btn-pg">{teamsPlan.cta}</a>
			</div>
		</div>

		<p class="price-footer">
			Joining a company that just helped you land a job that pays 100x this. Just saying.
		</p>
	</div>
</section>

<style>
	section {
		background: var(--color-warm-cream);
		padding: 88px 48px;
	}
	.wrap {
		max-width: 1160px;
		margin: 0 auto;
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
		width: 100%;
		justify-content: center;
	}
	.lbl-dot {
		width: 5px;
		height: 5px;
		background: var(--color-warm-coral);
		border-radius: 50%;
	}
	.price-h {
		font-family: var(--font-display);
		font-size: clamp(26px, 4vw, 44px);
		font-weight: 800;
		letter-spacing: -0.03em;
		text-align: center;
		margin-bottom: 8px;
		color: var(--color-warm-ink);
	}
	.price-sub {
		font-size: 15px;
		color: var(--color-warm-muted);
		text-align: center;
		margin-bottom: 28px;
	}
	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-bottom: 36px;
	}
	.tgl-lbl {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-warm-muted);
	}
	.tgl-lbl.on {
		color: var(--color-warm-ink);
	}
	.tgl {
		width: 42px;
		height: 23px;
		background: var(--color-warm-ink);
		border-radius: 100px;
		cursor: pointer;
		position: relative;
		border: none;
		flex-shrink: 0;
	}
	.tgl-k {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 17px;
		height: 17px;
		background: #fff;
		border-radius: 50%;
		transition: transform 0.2s;
	}
	.tgl.annual .tgl-k {
		transform: translateX(19px);
	}
	.save-tag {
		background: var(--color-warm-mint-bg);
		color: #008a67;
		font-size: 10px;
		font-weight: 700;
		padding: 3px 9px;
		border-radius: 100px;
	}
	.price-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		max-width: 920px;
		margin: 0 auto;
	}
	.p-card {
		background: #fff;
		border-radius: 14px;
		padding: 28px;
		border: 1px solid var(--color-warm-border);
		position: relative;
		transition: transform 0.2s;
	}
	.p-card:hover {
		transform: translateY(-3px);
	}
	.p-card.feat {
		border: 2px solid var(--color-warm-ink);
		transform: scale(1.02);
	}
	.p-card.feat:hover {
		transform: scale(1.02) translateY(-3px);
	}
	.pop-badge {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-warm-amber);
		color: #fff;
		font-size: 10px;
		font-weight: 800;
		padding: 3px 12px;
		border-radius: 100px;
		white-space: nowrap;
	}
	.p-plan {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-warm-muted);
		margin-bottom: 6px;
	}
	.p-amt {
		font-family: var(--font-display);
		font-size: 42px;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--color-warm-ink);
	}
	.p-amt span {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-warm-muted);
	}
	.teams-price {
		font-size: 28px !important;
		padding-top: 4px;
		letter-spacing: -0.01em !important;
	}
	.p-sub {
		font-size: 12px;
		color: var(--color-warm-muted);
		margin: 8px 0 20px;
		line-height: 1.5;
	}
	.p-feats {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 7px;
		margin-bottom: 22px;
		padding: 0;
	}
	.p-feats li {
		font-size: 12px;
		display: flex;
		align-items: flex-start;
		gap: 6px;
		color: var(--color-warm-muted);
	}
	.p-feats li.on { color: var(--color-warm-ink); }
	.p-feats li.off { opacity: 0.4; }
	.fi { flex-shrink: 0; margin-top: 2px; }
	.btn-pp {
		width: 100%;
		font-family: var(--font-body-dm);
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		background: var(--color-warm-ink);
		border: none;
		cursor: pointer;
		padding: 12px;
		border-radius: 100px;
		transition: transform 0.15s, box-shadow 0.15s;
		text-decoration: none;
		display: block;
		text-align: center;
	}
	.btn-pp:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
	}
	.btn-pg {
		width: 100%;
		font-family: var(--font-body-dm);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-warm-ink);
		background: none;
		border: 1.5px solid var(--color-warm-border-dark);
		cursor: pointer;
		padding: 12px;
		border-radius: 100px;
		transition: border-color 0.2s;
		text-decoration: none;
		display: block;
		text-align: center;
	}
	.btn-pg:hover {
		border-color: var(--color-warm-ink);
	}
	.p-note {
		font-size: 10px;
		color: var(--color-warm-dim);
		text-align: center;
		margin-top: 6px;
	}
	.price-footer {
		text-align: center;
		margin-top: 32px;
		font-size: 13px;
		color: var(--color-warm-muted);
		font-style: italic;
	}

	@media (max-width: 900px) {
		section { padding: 56px 24px; }
		.price-grid { grid-template-columns: 1fr; max-width: 400px; }
		.p-card.feat { transform: none; }
	}
</style>
