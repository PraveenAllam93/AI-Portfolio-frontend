<script lang="ts">
	import { onMount } from 'svelte';

	const names = [
		{ n: 'Sarah Jenkins', i: 'SJ', s: 'sarah-jenkins' },
		{ n: 'Omar Al-Hassan', i: 'OA', s: 'omar-al-hassan' },
		{ n: 'Priya Nair', i: 'PN', s: 'priya-nair' },
		{ n: 'Riya Mehta', i: 'RM', s: 'riya-mehta' }
	];

	let nameEl: HTMLElement | undefined;
	let initEl: HTMLElement | undefined;
	let slugEl: HTMLElement | undefined;

	let ni = 0;
	let ci = 0;
	let del = false;

	function tw() {
		if (!nameEl || !initEl || !slugEl) return;
		const c = names[ni];
		if (!del) {
			nameEl.textContent = c.n.slice(0, ++ci);
			if (ci === c.n.length) {
				del = true;
				setTimeout(tw, 2200);
				return;
			}
		} else {
			nameEl.textContent = c.n.slice(0, --ci);
			if (ci === 0) {
				del = false;
				ni = (ni + 1) % names.length;
				initEl.textContent = names[ni].i;
				slugEl.textContent = names[ni].s;
				setTimeout(tw, 320);
				return;
			}
		}
		setTimeout(tw, del ? 38 : 76);
	}

	onMount(() => {
		const timer = setTimeout(tw, 1400);
		return () => clearTimeout(timer);
	});
</script>

<section id="hero">
	<div class="hero-grid">
		<!-- Left: copy -->
		<div class="hero-left">
			<div class="hero-badge">✦ No coding needed. No design skills.</div>
			<h1 class="hero-h1">
				Your resume gets you <em>read.</em><br />
				A portfolio gets you the interview.
			</h1>
			<p class="hero-sub">
				Upload your CV. AI reads it, writes your story, and builds a stunning portfolio in under 30
				seconds. No design skills needed.
			</p>
			<div class="chips">
				<div class="chip">
					<div class="chip-v">30s</div>
					<div class="chip-l">CV to live portfolio</div>
				</div>
				<div class="chip">
					<div class="chip-v">Zero</div>
					<div class="chip-l">Design or coding skills needed</div>
				</div>
				<div class="chip">
					<div class="chip-v">71%</div>
					<div class="chip-l">Higher interview callback rate*</div>
				</div>
				<div class="chip">
					<div class="chip-v">Free</div>
					<div class="chip-l">To get started</div>
				</div>
			</div>
			<div class="hero-btns">
				<a href="/signup" class="btn-primary">✨ Build My Portfolio — Try Now</a>
				<a
					href="#how"
					class="btn-outline"
					onclick={(e) => {
						e.preventDefault();
						document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
					}}>See how it works →</a
				>
			</div>
			<p class="hero-trust">No account needed · No credit card · Your data is never stored</p>
			<p class="hero-fn">*ResumeGo study, 10,000+ applications</p>
		</div>

		<!-- Right: hero card mockup -->
		<div class="hero-right">
			<div class="hero-card-wrap">
				<div class="score-pill">Portfolio Score: 87/100</div>
				<div class="hero-card">
					<!-- Browser chrome -->
					<div class="hc-url">
						<div class="hc-dots">
							<div class="hc-dot hc-dot-r"></div>
							<div class="hc-dot hc-dot-y"></div>
							<div class="hc-dot hc-dot-g"></div>
						</div>
						<div class="hc-urlbar">portfolio.ai/<span bind:this={slugEl}>sarah-jenkins</span></div>
					</div>
					<!-- Card body -->
					<div class="hc-body">
						<div class="hc-header">
							<div class="hc-av" bind:this={initEl}>SJ</div>
							<div>
								<div class="hc-nm" bind:this={nameEl}>Sarah Jenkins</div>
								<div class="hc-tl">Senior Marketing Manager · Dubai</div>
							</div>
							<div class="hc-hire">Available for hire</div>
						</div>
						<div class="hc-kpis">
							<div class="hc-kpi">
								<div class="hc-kv" style="color:var(--color-warm-coral)">+230%</div>
								<div class="hc-kl">ROAS</div>
							</div>
							<div class="hc-kpi">
								<div class="hc-kv" style="color:var(--color-warm-amber)">4.2M</div>
								<div class="hc-kl">Reach</div>
							</div>
							<div class="hc-kpi">
								<div class="hc-kv" style="color:var(--color-warm-mint)">$1.8M</div>
								<div class="hc-kl">Budget</div>
							</div>
						</div>
						<div class="hc-work">
							<div class="hc-work-lbl">Featured Work</div>
							<div class="hc-imgs">
								<div class="hc-img hc-img-1">
									<span>📣</span>
									<div class="hc-img-ttl">RAMADAN CAMPAIGN<br />META + GOOGLE</div>
									<div class="hc-img-badge">+230% ROAS</div>
								</div>
								<div class="hc-img hc-img-2">
									<span>🎪</span>
									<div class="hc-img-ttl">CITYSCAPE<br />ACTIVATION</div>
									<div class="hc-img-badge">2,400 attendees</div>
								</div>
							</div>
							<div class="hc-proj hc-p-peach">
								<div class="hc-proj-ttl">📣 Ramadan Campaign 2024</div>
								<div class="hc-proj-body">
									Led cross-platform campaign achieving 230% ROAS through A/B testing.
								</div>
							</div>
							<div class="hc-proj hc-p-lav">
								<div class="hc-proj-ttl">🚀 Brand Relaunch UAE Market</div>
								<div class="hc-proj-body">$1.8M media budget, 4.2M reach across GCC.</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Floating cards -->
				<div class="fc fc-1">
					<div class="fc-ico">✦</div>
					<div class="fc-ttl">Case Study Written</div>
					<div class="fc-bd">Grew ROAS by 230% through A/B creative testing across Meta & Google.</div>
				</div>
				<div class="fc fc-2">
					<div class="fc-ico">📊</div>
					<div class="fc-ttl">Score: 87/100</div>
					<div class="fc-bd">Add a project image to reach 95.</div>
				</div>
				<div class="fc fc-3">
					<div class="fc-ico">🤖</div>
					<div class="fc-ttl">AI Suggestion</div>
					<div class="fc-bd">Add your Q3 ROAS metric. Recruiters focus here first.</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		padding: 72px 48px 88px;
		background: var(--color-warm-cream);
	}
	.hero-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 72px;
		align-items: center;
		max-width: 1160px;
		margin: 0 auto;
	}
	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--color-warm-ink);
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 6px 14px;
		border-radius: 100px;
		margin-bottom: 20px;
	}
	.hero-h1 {
		font-family: var(--font-display);
		font-size: clamp(40px, 5.5vw, 66px);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: -0.03em;
		margin-bottom: 16px;
		color: var(--color-warm-ink);
	}
	.hero-h1 em {
		font-style: italic;
		color: var(--color-warm-coral);
	}
	.hero-sub {
		font-size: 16px;
		color: var(--color-warm-muted);
		line-height: 1.7;
		max-width: 420px;
		margin-bottom: 28px;
	}
	.chips {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-bottom: 28px;
	}
	.chip {
		background: #fff;
		border: 1px solid var(--color-warm-border);
		border-radius: 12px;
		padding: 12px 16px;
	}
	.chip-v {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--color-warm-ink);
	}
	.chip-l {
		font-size: 11px;
		color: var(--color-warm-muted);
		margin-top: 3px;
		line-height: 1.4;
	}
	.hero-btns {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		align-items: center;
	}
	.btn-primary {
		font-family: var(--font-body-dm);
		font-size: 14px;
		font-weight: 700;
		color: #fff;
		background: var(--color-warm-ink);
		border: none;
		cursor: pointer;
		padding: 13px 26px;
		border-radius: 100px;
		text-decoration: none;
		transition: transform 0.15s, box-shadow 0.15s;
		display: inline-block;
	}
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
	}
	.btn-outline {
		font-family: var(--font-body-dm);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-warm-ink);
		background: none;
		border: 1.5px solid var(--color-warm-border-dark);
		cursor: pointer;
		padding: 13px 26px;
		border-radius: 100px;
		text-decoration: none;
		transition: border-color 0.2s;
		display: inline-block;
	}
	.btn-outline:hover {
		border-color: var(--color-warm-ink);
	}
	.hero-trust {
		font-size: 11px;
		color: var(--color-warm-dim);
		margin-top: 12px;
	}
	.hero-fn {
		font-size: 10px;
		color: var(--color-warm-dim);
		margin-top: 5px;
	}

	/* Hero right: card + floaters */
	.hero-right {
		display: flex;
		justify-content: center;
	}
	.hero-card-wrap {
		position: relative;
		max-width: 440px;
		width: 100%;
	}
	.score-pill {
		position: absolute;
		top: -18px;
		right: 100px;
		background: #1a5c2a;
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		padding: 5px 12px;
		border-radius: 100px;
		z-index: 10;
	}
	.hero-card {
		background: #fff;
		border-radius: 16px;
		border: 1px solid var(--color-warm-border);
		box-shadow: 0 6px 32px rgba(0, 0, 0, 0.09);
		overflow: hidden;
	}
	.hc-url {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--color-warm-border);
		background: var(--color-warm-cream);
	}
	.hc-dots {
		display: flex;
		gap: 4px;
	}
	.hc-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.hc-dot-r { background: #ff5f57; }
	.hc-dot-y { background: #febc2e; }
	.hc-dot-g { background: #28c840; }
	.hc-urlbar {
		font-size: 11px;
		color: var(--color-warm-muted);
		font-family: monospace;
		background: #fff;
		border: 1px solid var(--color-warm-border);
		border-radius: 6px;
		padding: 4px 10px;
		flex: 1;
	}
	.hc-header {
		background: linear-gradient(135deg, var(--color-warm-coral), var(--color-warm-amber));
		padding: 16px 18px;
		color: #fff;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.hc-av {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 13px;
		flex-shrink: 0;
	}
	.hc-nm {
		font-weight: 700;
		font-size: 13px;
	}
	.hc-tl {
		font-size: 10px;
		opacity: 0.85;
		margin-top: 1px;
	}
	.hc-hire {
		margin-left: auto;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 100px;
		padding: 3px 9px;
		font-size: 9px;
		font-weight: 700;
		white-space: nowrap;
	}
	.hc-kpis {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-bottom: 1px solid var(--color-warm-border);
	}
	.hc-kpi {
		padding: 10px;
		text-align: center;
		border-right: 1px solid var(--color-warm-border);
	}
	.hc-kpi:last-child {
		border: none;
	}
	.hc-kv {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.hc-kl {
		font-size: 9px;
		color: var(--color-warm-muted);
		margin-top: 1px;
	}
	.hc-work {
		padding: 12px;
	}
	.hc-work-lbl {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-warm-muted);
		margin-bottom: 8px;
	}
	.hc-imgs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
		margin-bottom: 8px;
	}
	.hc-img {
		border-radius: 8px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		aspect-ratio: 16 / 9;
	}
	.hc-img-1 {
		background: linear-gradient(135deg, var(--color-warm-coral), var(--color-warm-amber));
	}
	.hc-img-2 {
		background: linear-gradient(135deg, var(--color-warm-indigo), #8b73ff);
	}
	.hc-img span {
		font-size: 14px;
	}
	.hc-img-ttl {
		font-size: 7px;
		font-weight: 700;
		color: #fff;
		text-align: center;
		line-height: 1.3;
	}
	.hc-img-badge {
		background: rgba(255, 255, 255, 0.22);
		border-radius: 100px;
		padding: 1px 5px;
		font-size: 6px;
		color: #fff;
		font-weight: 700;
	}
	.hc-proj {
		border-radius: 8px;
		padding: 8px 10px;
		margin-bottom: 5px;
		font-size: 10px;
	}
	.hc-proj:last-child {
		margin: 0;
	}
	.hc-proj-ttl {
		font-weight: 700;
		margin-bottom: 2px;
		font-size: 10px;
	}
	.hc-proj-body {
		font-size: 9px;
		color: var(--color-warm-muted);
		line-height: 1.4;
	}
	.hc-p-peach { background: var(--color-warm-peach); }
	.hc-p-lav { background: var(--color-warm-lav); }

	/* Floating cards */
	.fc {
		position: absolute;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
		padding: 10px 13px;
		font-size: 11px;
		z-index: 10;
		max-width: 185px;
		border: 1px solid var(--color-warm-border);
	}
	.fc-1 {
		top: -16px;
		right: -22px;
		animation: bob 3s ease-in-out infinite;
	}
	.fc-2 {
		bottom: 80px;
		right: -24px;
		animation: bob 3s ease-in-out infinite;
		animation-delay: -1s;
	}
	.fc-3 {
		bottom: 16px;
		left: -22px;
		animation: bob 3s ease-in-out infinite;
		animation-delay: -2s;
	}
	.fc-ico {
		font-size: 16px;
		margin-bottom: 4px;
	}
	.fc-ttl {
		font-weight: 700;
		font-size: 11px;
		color: var(--color-warm-ink);
	}
	.fc-bd {
		font-size: 10px;
		color: var(--color-warm-muted);
		margin-top: 2px;
		line-height: 1.4;
	}

	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-7px); }
	}

	@media (max-width: 900px) {
		section {
			padding: 56px 24px;
		}
		.hero-grid {
			grid-template-columns: 1fr;
		}
		.hero-right {
			display: none;
		}
	}
</style>
