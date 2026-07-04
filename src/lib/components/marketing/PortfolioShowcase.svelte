<script lang="ts">
	import { reveal } from '$lib/actions/animate';
	import { TEMPLATES, PROFESSIONS } from './landing-data';
	import TemplateSpotlight from './TemplateSpotlight.svelte';

	const profDouble = [...PROFESSIONS, ...PROFESSIONS];

	// Live gallery hidden until there are real users/portfolios to show — flip to re-enable
	const SHOW_LIVE_GALLERY = false;

	const featured = TEMPLATES[0];
	const railTemplates = TEMPLATES.slice(1, 5);

	const tickerItems = [
		'Maya · Product Designer just published',
		'Arjun · Data Scientist landed an interview',
		'Sara · Architect shared portfolio',
		'Leo · Filmmaker got 1.2k views today',
		'Priya · ML Engineer published v2',
		'Noah · Consultant added 3 case studies',
		'Maya · Product Designer just published',
		'Arjun · Data Scientist landed an interview',
		'Sara · Architect shared portfolio',
		'Leo · Filmmaker got 1.2k views today'
	];

	const stats = [
		{ n: '48,210+', l: 'Portfolios shipped' },
		{ n: '2.7M', l: 'Recruiter views / mo' },
		{ n: '92%', l: 'Land an interview' },
		{ n: '<6 min', l: 'Avg. build time' }
	];
</script>

<section id="who">
	<div class="wrap">
		<div class="sec-lbl"><span class="lbl-dot"></span>WHO IT'S FOR</div>
		<h2 class="who-h" use:reveal>Built for every profession. Especially yours.</h2>
		<p class="who-sub" use:reveal>Pick a template. AI fills it with your work. Switch any time.</p>

		<!-- Spotlight template showcase — auto-cycling card stack (desktop) -->
		<div class="spotlight-wrap" use:reveal>
			<TemplateSpotlight />
		</div>

		<!-- Mobile-friendly grid (hidden on desktop) -->
		<div class="tpl-grid tpl-grid-mobile" use:reveal>
			{#each TEMPLATES as t (t.name)}
				<div class="tpl-card" style="--accent:{t.color}">
					<div class="tpl-thumb">
						<img src={t.img} alt="{t.name} portfolio template" loading="lazy" width="800" height="1024" />
					</div>
					<div class="tpl-meta">
						<div>
							<div class="tpl-prof" style="color:{t.color}">{t.profession}</div>
							<div class="tpl-name">{t.name}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Animated profession marquee — every profession -->
		<div class="prof-marquee" use:reveal aria-label="Every profession">
			<div class="prof-track">
				{#each profDouble as p, i (i)}
					<div class="prof-pill">
						<span class="pp-dot"></span>
						<span class="pp-emoji">{p.emoji}</span>
						<span>{p.name}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Editorial live gallery -->
		{#if SHOW_LIVE_GALLERY}
		<div class="sx" use:reveal>
			<div class="sx-aurora sx-aurora-a" aria-hidden="true"></div>
			<div class="sx-aurora sx-aurora-b" aria-hidden="true"></div>
			<div class="sx-noise" aria-hidden="true"></div>

			<!-- Live activity ticker -->
			<div class="sx-ticker" aria-hidden="true">
				<div class="sx-ticker-track">
					{#each tickerItems as t, i (i)}
						<span class="sx-tick"><span class="sx-tick-dot"></span>{t}</span>
					{/each}
				</div>
			</div>

			<div class="sx-head">
				<div class="sx-eyebrow">
					<span class="live-dot"></span><b>LIVE GALLERY</b><span class="sx-eyebrow-sep"></span>142 published today
				</div>
				<h3 class="sx-h">Portfolios shipped this week<br /><span>by people exactly like you.</span></h3>
				<p class="sx-sub">
					Real work, real professions, real recruiters reading them. Pick a profession to see how it
					looks.
				</p>
			</div>

			<!-- Editorial layout: featured + side rail -->
			<div class="sx-gallery">
				<article class="sx-feature" style="--accent:{featured.color}">
					<div class="sx-feature-frame">
						<img src={featured.img} alt="{featured.name} portfolio" loading="lazy" />
						<div class="sx-feature-badge"><span class="live-dot"></span>Recently published</div>
						<div class="sx-feature-meta">
							<div class="sx-feature-prof">{featured.profession}</div>
							<div class="sx-feature-name">{featured.name}</div>
							<div class="sx-feature-row">
								<div class="sx-feature-by">
									<span class="sx-avatar" style="background:{featured.color}">M</span>
									<div>
										<div class="sx-by-n">Maya R.</div>
										<div class="sx-by-l">Shipped 2h ago</div>
									</div>
								</div>
								<div class="sx-feature-stats">
									<div><b>1.2k</b><span>views</span></div>
									<div><b>38</b><span>saves</span></div>
								</div>
							</div>
						</div>
					</div>
				</article>

				<div class="sx-rail">
					{#each railTemplates as t, i (t.name)}
						<article class="sx-mini" style="--accent:{t.color};animation-delay:{i * 0.08}s">
							<div class="sx-mini-img">
								<img src={t.img} alt="{t.name} portfolio" loading="lazy" />
								<span class="sx-mini-prof">{t.profession}</span>
							</div>
							<div class="sx-mini-meta">
								<div class="sx-mini-name">{t.name}</div>
								<div class="sx-mini-tags">
									{#each t.tags as tg (tg)}
										<span>{tg}</span>
									{/each}
								</div>
							</div>
						</article>
					{/each}
				</div>
			</div>

			<!-- Compact stats strip -->
			<div class="sx-stats">
				{#each stats as s, i (s.l)}
					<div class="sx-stat">
						<div class="sx-stat-n">{s.n}</div>
						<div class="sx-stat-l">{s.l}</div>
						{#if i < stats.length - 1}
							<span class="sx-stat-div" aria-hidden="true"></span>
						{/if}
					</div>
				{/each}
			</div>

			<div class="sx-actions">
				<a class="sx-cta" href="/signup">Build mine free <span class="cta-gem">◆</span></a>
				<a class="sx-cta-2" href="/signup">Browse all live portfolios →</a>
			</div>
		</div>
		{/if}
	</div>
</section>

<style>
	section {
		padding: 88px 48px;
		background: #fff;
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
		margin-bottom: 16px;
	}
	.lbl-dot {
		width: 5px;
		height: 5px;
		background: var(--color-warm-coral);
		border-radius: 50%;
	}
	.who-h {
		font-family: var(--font-headline);
		font-size: clamp(26px, 3.5vw, 44px);
		font-weight: 800;
		line-height: 1.08;
		letter-spacing: -0.03em;
		max-width: 560px;
		margin-bottom: 10px;
		color: var(--color-warm-ink);
	}
	.who-sub {
		font-size: 15px;
		color: var(--color-warm-muted);
		max-width: 520px;
		margin-bottom: 28px;
	}

	/* Mobile template grid */
	.tpl-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
		margin: 8px 0 36px;
	}
	.tpl-grid-mobile {
		display: none;
	}
	.tpl-card {
		background: #fff;
		border: 1px solid var(--color-warm-border);
		border-radius: 14px;
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
		cursor: pointer;
	}
	.tpl-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
		border-color: var(--accent);
	}
	.tpl-thumb {
		position: relative;
		aspect-ratio: 4 / 5;
		overflow: hidden;
		background: var(--color-warm-cream);
	}
	.tpl-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		display: block;
		transition: transform 0.6s ease;
	}
	.tpl-card:hover .tpl-thumb img {
		transform: scale(1.06);
	}
	.tpl-meta {
		padding: 14px 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		border-top: 1px solid var(--color-warm-border);
	}
	.tpl-prof {
		font-size: 9px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 3px;
	}
	.tpl-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 14px;
		letter-spacing: -0.01em;
		color: var(--color-warm-ink);
	}

	/* Profession marquee */
	.prof-marquee {
		margin: 18px 0 52px;
		padding: 18px 0;
		border-top: 1px solid var(--color-warm-border);
		border-bottom: 1px solid var(--color-warm-border);
		overflow: hidden;
		position: relative;
		mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
	}
	.prof-track {
		display: flex;
		gap: 14px;
		width: max-content;
		animation: profmarq 38s linear infinite;
	}
	.prof-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--color-warm-ink);
		background: var(--color-warm-cream);
		border: 1px solid var(--color-warm-border);
		padding: 10px 18px;
		border-radius: 100px;
		white-space: nowrap;
		transition: transform 0.25s, background 0.25s, color 0.25s;
	}
	.prof-pill:hover {
		transform: translateY(-2px);
		background: var(--color-warm-ink);
		color: #fff;
		border-color: var(--color-warm-ink);
	}
	.pp-emoji {
		font-size: 18px;
	}
	.pp-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-warm-coral);
	}
	@keyframes profmarq {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}

	/* ===== Editorial live gallery ===== */
	.sx {
		position: relative;
		margin-top: 32px;
		padding: 28px 28px 80px;
		border-radius: 32px;
		background: linear-gradient(180deg, #0b0b12 0%, #08080d 100%);
		border: 1px solid rgba(255, 255, 255, 0.06);
		overflow: hidden;
		text-align: center;
		isolation: isolate;
	}
	.sx-aurora {
		position: absolute;
		border-radius: 50%;
		filter: blur(90px);
		opacity: 0.45;
		pointer-events: none;
		z-index: 0;
	}
	.sx-aurora-a {
		width: 560px;
		height: 560px;
		background: radial-gradient(circle, #ff5c3a 0%, transparent 65%);
		top: -220px;
		left: -140px;
		animation: sxDrift 16s ease-in-out infinite;
	}
	.sx-aurora-b {
		width: 520px;
		height: 520px;
		background: radial-gradient(circle, #7c5cff 0%, transparent 65%);
		bottom: -200px;
		right: -120px;
		animation: sxDrift 20s ease-in-out infinite reverse;
	}
	@keyframes sxDrift {
		0%, 100% { transform: translate(0, 0) scale(1); }
		50% { transform: translate(40px, -30px) scale(1.06); }
	}
	.sx-noise {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
		background-size: 3px 3px;
		opacity: 0.4;
		pointer-events: none;
		z-index: 0;
		mix-blend-mode: overlay;
	}

	/* Ticker */
	.sx-ticker {
		position: relative;
		z-index: 2;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 100px;
		background: rgba(255, 255, 255, 0.02);
		backdrop-filter: blur(10px);
		padding: 10px 0;
		margin: 0 auto 32px;
		max-width: 1100px;
		mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
	}
	.sx-ticker-track {
		display: flex;
		gap: 36px;
		width: max-content;
		animation: sxScroll 40s linear infinite;
		white-space: nowrap;
	}
	.sx-ticker:hover .sx-ticker-track {
		animation-play-state: paused;
	}
	@keyframes sxScroll {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}
	.sx-tick {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: #cfcfd6;
		font-weight: 500;
		letter-spacing: 0.01em;
	}
	.sx-tick-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #22d3a8;
		box-shadow: 0 0 8px #22d3a8;
	}

	/* Header */
	.sx-head {
		position: relative;
		z-index: 2;
		max-width: 760px;
		margin: 0 auto 44px;
	}
	.sx-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-body-dm);
		font-size: 11px;
		font-weight: 600;
		color: #9b9ba8;
		letter-spacing: 0.06em;
		padding: 7px 16px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 100px;
		background: rgba(255, 255, 255, 0.025);
		margin-bottom: 22px;
		text-transform: uppercase;
	}
	.sx-eyebrow b {
		color: #fff;
		font-weight: 800;
		letter-spacing: 0.18em;
	}
	.sx-eyebrow-sep {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: #444;
	}
	.live-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #22d3a8;
		box-shadow: 0 0 0 4px rgba(34, 211, 168, 0.18);
		animation: livePulse 1.6s ease-in-out infinite;
	}
	@keyframes livePulse {
		0%, 100% { box-shadow: 0 0 0 4px rgba(34, 211, 168, 0.18); }
		50% { box-shadow: 0 0 0 8px rgba(34, 211, 168, 0.05); }
	}
	.sx-h {
		font-family: var(--font-headline);
		font-weight: 800;
		font-size: clamp(28px, 4vw, 46px);
		letter-spacing: -0.025em;
		color: #fff;
		line-height: 1.1;
		margin-bottom: 16px;
	}
	.sx-h span {
		background: linear-gradient(90deg, #ff7a3d, #7c5cff);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.sx-sub {
		font-size: 14.5px;
		color: #9b9ba8;
		line-height: 1.65;
		max-width: 560px;
		margin: 0 auto;
	}

	/* Editorial gallery */
	.sx-gallery {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 22px;
		max-width: 1180px;
		margin: 0 auto;
		text-align: left;
	}

	/* Featured */
	.sx-feature {
		position: relative;
		border-radius: 24px;
		overflow: hidden;
		background: #13131a;
		border: 1px solid rgba(255, 255, 255, 0.08);
		transition: transform 0.35s, border-color 0.35s, box-shadow 0.35s;
	}
	.sx-feature:hover {
		transform: translateY(-4px);
		border-color: color-mix(in oklab, var(--accent) 50%, rgba(255, 255, 255, 0.08));
		box-shadow: 0 30px 80px -20px color-mix(in oklab, var(--accent) 40%, transparent);
	}
	.sx-feature-frame {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}
	.sx-feature-frame img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		transition: transform 0.8s ease;
	}
	.sx-feature:hover .sx-feature-frame img {
		transform: scale(1.04);
	}
	.sx-feature-badge {
		position: absolute;
		top: 18px;
		left: 18px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		font-weight: 700;
		color: #fff;
		background: rgba(10, 10, 15, 0.7);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 7px 12px;
		border-radius: 100px;
		letter-spacing: 0.04em;
		z-index: 2;
	}
	.sx-feature-meta {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 24px;
		background: linear-gradient(180deg, transparent 0%, rgba(8, 8, 13, 0.55) 35%, rgba(8, 8, 13, 0.96) 100%);
		z-index: 2;
	}
	.sx-feature-prof {
		display: inline-block;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 8px;
	}
	.sx-feature-name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(20px, 2.4vw, 28px);
		letter-spacing: -0.02em;
		color: #fff;
		margin-bottom: 18px;
		line-height: 1.15;
	}
	.sx-feature-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding-top: 16px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	.sx-feature-by {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.sx-avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 13px;
		color: #fff;
		border: 2px solid rgba(255, 255, 255, 0.15);
	}
	.sx-by-n {
		font-size: 13px;
		font-weight: 700;
		color: #fff;
	}
	.sx-by-l {
		font-size: 11px;
		color: #9b9ba8;
		margin-top: 1px;
	}
	.sx-feature-stats {
		display: flex;
		gap: 18px;
	}
	.sx-feature-stats > div {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.sx-feature-stats b {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 15px;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.sx-feature-stats span {
		font-size: 10px;
		color: #9b9ba8;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-top: 1px;
	}

	/* Rail */
	.sx-rail {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.sx-mini {
		position: relative;
		border-radius: 18px;
		overflow: hidden;
		background: #13131a;
		border: 1px solid rgba(255, 255, 255, 0.07);
		transition: transform 0.3s, border-color 0.3s;
		animation: sxFade 0.6s ease backwards;
		display: flex;
		flex-direction: column;
	}
	@keyframes sxFade {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: none; }
	}
	.sx-mini:hover {
		transform: translateY(-3px);
		border-color: color-mix(in oklab, var(--accent) 45%, rgba(255, 255, 255, 0.08));
	}
	.sx-mini-img {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}
	.sx-mini-img img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		transition: transform 0.6s;
	}
	.sx-mini:hover .sx-mini-img img {
		transform: scale(1.05);
	}
	.sx-mini-prof {
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #fff;
		background: rgba(8, 8, 13, 0.7);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 4px 9px;
		border-radius: 100px;
	}
	.sx-mini-meta {
		padding: 12px 14px 14px;
		flex: 1;
	}
	.sx-mini-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 14px;
		color: #fff;
		letter-spacing: -0.01em;
		margin-bottom: 7px;
	}
	.sx-mini-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	.sx-mini-tags span {
		font-size: 9.5px;
		font-weight: 600;
		color: #9b9ba8;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		padding: 3px 7px;
		border-radius: 100px;
	}

	/* Stats strip */
	.sx-stats {
		position: relative;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0;
		max-width: 880px;
		margin: 48px auto 0;
		padding: 24px 32px;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
		backdrop-filter: blur(10px);
		flex-wrap: wrap;
	}
	.sx-stat {
		position: relative;
		flex: 1;
		min-width: 140px;
		text-align: center;
		padding: 0 18px;
	}
	.sx-stat-n {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(22px, 2.6vw, 30px);
		letter-spacing: -0.02em;
		background: linear-gradient(135deg, #fff, #9b9ba8);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		line-height: 1;
	}
	.sx-stat-l {
		font-size: 11px;
		color: #9b9ba8;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 600;
		margin-top: 8px;
	}
	.sx-stat-div {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 1px;
		height: 32px;
		background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.12), transparent);
	}

	/* Actions */
	.sx-actions {
		position: relative;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 22px;
		margin-top: 36px;
		flex-wrap: wrap;
	}
	.sx-cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-body-dm);
		font-size: 14px;
		font-weight: 700;
		color: #fff;
		background: linear-gradient(135deg, #ff5c3a, #7c5cff);
		padding: 14px 28px;
		border-radius: 100px;
		text-decoration: none;
		box-shadow: 0 14px 34px rgba(124, 92, 255, 0.35);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.sx-cta:hover {
		transform: translateY(-2px);
		box-shadow: 0 18px 42px rgba(124, 92, 255, 0.55);
	}
	.cta-gem {
		font-size: 11px;
	}
	.sx-cta-2 {
		font-family: var(--font-body-dm);
		font-size: 13px;
		font-weight: 600;
		color: #cfcfd6;
		text-decoration: none;
		transition: color 0.2s;
	}
	.sx-cta-2:hover {
		color: #fff;
	}

	@media (max-width: 980px) {
		.sx-gallery { grid-template-columns: 1fr; }
		.sx-rail { grid-template-columns: 1fr 1fr; }
	}
	@media (max-width: 900px) {
		section { padding: 56px 24px; }
		.tpl-grid-mobile { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
		.prof-pill { font-size: 14px; padding: 8px 14px; }
	}
	@media (max-width: 600px) {
		.sx { padding: 24px 16px 56px; border-radius: 24px; }
		.tpl-grid-mobile { grid-template-columns: 1fr; }
		.sx-rail { grid-template-columns: 1fr 1fr; gap: 10px; }
		.sx-stats { padding: 18px; gap: 8px; }
		.sx-stat { min-width: 120px; padding: 8px 6px; }
		.sx-stat-div { display: none; }
		.sx-feature-meta { padding: 18px; }
		.sx-feature-row { flex-direction: column; align-items: flex-start; gap: 12px; }
		.sx-feature-stats { align-self: stretch; justify-content: space-between; }
		.sx-feature-stats > div { align-items: flex-start; }
	}
</style>
