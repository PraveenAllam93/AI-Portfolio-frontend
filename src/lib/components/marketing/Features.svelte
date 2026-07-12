<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	// Lucide icon geometry (24x24 stroke icons) — paths/circles/rects per icon
	interface IconDef {
		paths?: string[];
		circles?: { cx: number; cy: number; r: number }[];
		rects?: { x: number; y: number; width: number; height: number; rx: number }[];
	}

	const icons: Record<string, IconDef> = {
		sparkles: {
			paths: [
				'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
				'M20 3v4',
				'M22 5h-4',
				'M4 17v2',
				'M5 18H3'
			]
		},
		gauge: {
			paths: ['m12 14 4-4', 'M3.34 19a10 10 0 1 1 17.32 0']
		},
		imagePlus: {
			paths: [
				'M16 5h6',
				'M19 2v6',
				'M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5',
				'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'
			],
			circles: [{ cx: 9, cy: 9, r: 2 }]
		},
		target: {
			circles: [
				{ cx: 12, cy: 12, r: 10 },
				{ cx: 12, cy: 12, r: 6 },
				{ cx: 12, cy: 12, r: 2 }
			]
		},
		eye: {
			paths: [
				'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'
			],
			circles: [{ cx: 12, cy: 12, r: 3 }]
		},
		wand: {
			paths: [
				'm21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72',
				'm14 7 3 3',
				'M5 6v4',
				'M19 14v4',
				'M10 2v2',
				'M7 8H3',
				'M21 16h-4',
				'M11 3H9'
			]
		},
		layoutTemplate: {
			rects: [
				{ x: 3, y: 3, width: 18, height: 7, rx: 1 },
				{ x: 3, y: 14, width: 9, height: 7, rx: 1 },
				{ x: 16, y: 14, width: 5, height: 7, rx: 1 }
			]
		},
		repeat: {
			paths: ['m17 2 4 4-4 4', 'M3 11v-1a4 4 0 0 1 4-4h14', 'm7 22-4-4 4-4', 'M21 13v1a4 4 0 0 1-4 4H3']
		},
		refresh: {
			paths: [
				'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
				'M21 3v5h-5',
				'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
				'M3 21v-5h5'
			]
		}
	};

	const capabilities = [
		'Imports content from your CV',
		'Layouts tailored to your profession',
		'Writes case studies from your work',
		'Quality score with actionable tips',
		'Recruiter view & engagement insights',
		'Auto-summarises uploaded media',
		'Adapts to specific job descriptions'
	];

	const cards = [
		{
			icon: 'sparkles',
			gradient: 'linear-gradient(135deg,#7c5cff,#3a2db8)',
			title: 'AI Work Story Engine',
			body: 'Turn raw bullet points into clear, outcome-focused case studies. Upload a project brief or asset and Portfolio.ai drafts the summary, caption and portfolio entry for you to review.'
		},
		{
			icon: 'gauge',
			gradient: 'linear-gradient(135deg,#22d3a8,#0f7a5c)',
			title: 'Live Portfolio Score',
			body: 'A real-time quality score highlights gaps in your story, evidence and structure — with specific suggestions you can apply in one click.'
		},
		{
			icon: 'imagePlus',
			gradient: 'linear-gradient(135deg,#f0a85a,#7a4a1a)',
			title: 'Smart Media Summaries',
			body: 'Drop in photos, videos or documents and get clean, professional descriptions and alt text generated automatically — no manual captioning.'
		},
		{
			icon: 'target',
			gradient: 'linear-gradient(135deg,#ff5d8f,#b8275f)',
			title: 'Role-Aware Tailoring',
			body: 'Paste a job description and Portfolio.ai re-orders sections, surfaces the most relevant work and aligns language to what that role is looking for.'
		},
		{
			icon: 'eye',
			gradient: 'linear-gradient(135deg,#7c5cff,#3a2db8)',
			title: 'Recruiter Preview',
			body: 'Preview your portfolio the way a recruiter scans it in the first few seconds, with attention insights showing where they actually look.'
		},
		{
			icon: 'wand',
			gradient: 'linear-gradient(135deg,#22d3a8,#0f7a5c)',
			title: 'Contextual Suggestions',
			body: 'While you edit, the assistant flags weak phrasing, missing metrics and overlong sections — like having a senior reviewer sitting next to you.'
		},
		{
			icon: 'layoutTemplate',
			gradient: 'linear-gradient(135deg,#a78bfa,#5b3fd4)',
			title: 'Profession-Tuned Templates',
			body: 'Designs are generated around your field, seniority and target role — not picked from a fixed gallery — and refined as your work evolves.'
		},
		{
			icon: 'repeat',
			gradient: 'linear-gradient(135deg,#ffb454,#c47a00)',
			title: 'Career Pivot Mode',
			body: 'Changing direction? Switch your target profession and the layout, highlighted skills, metrics and tone restructure to match in a few clicks.'
		},
		{
			icon: 'refresh',
			gradient: 'linear-gradient(135deg,#22d3a8,#0f7a5c)',
			title: 'Always Up to Date',
			body: 'Connect a new project, link or file and Portfolio.ai extracts the highlights, drafts the case study and places it in the right section for you.'
		}
	];

	let slider: HTMLDivElement | undefined = $state();

	function slide(dir: number) {
		if (!slider) return;
		const card = slider.querySelector<HTMLElement>('.diff-card');
		const step = (card?.offsetWidth ?? 320) + 18;
		slider.scrollBy({ left: dir * step, behavior: 'smooth' });
	}
</script>

<section id="different">
	<div class="wrap">
		<div class="diff-top">
			<div>
				<div class="sec-lbl"><span class="lbl-dot"></span>WHY PORTFOLIO.AI</div>
				<h2 class="diff-h" use:reveal>Built for your career,<br />not just your website.</h2>
				<p class="diff-sub" use:reveal>
					Generic builders hand you a blank canvas and a steep learning curve. Portfolio.ai turns
					your CV and existing work into a recruiter-ready portfolio in minutes — then helps you
					keep improving it.
				</p>
			</div>
			<div class="diff-table-wrap" use:reveal>
				<div class="diff-table">
					<div class="dt-row dt-head">
						<span>CAPABILITY</span><span>TYPICAL BUILDERS</span><span class="dt-brand">PORTFOLIO.AI</span>
					</div>
					{#each capabilities as cap (cap)}
						<div class="dt-row">
							<span>{cap}</span>
							<span class="dt-x">✕</span>
							<span class="dt-check">✓</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="diff-slider-wrap">
			<button class="diff-nav diff-nav-l" aria-label="Previous" onclick={() => slide(-1)}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
			</button>
			<button class="diff-nav diff-nav-r" aria-label="Next" onclick={() => slide(1)}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
			</button>
			<div class="diff-slider" bind:this={slider}>
				{#each cards as card, i (card.title)}
					{@const icon = icons[card.icon]}
					<div class="diff-card" use:reveal={{ delay: i * 50 }}>
						<div class="diff-ic" style="background:{card.gradient}">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
								{#each icon.paths ?? [] as d (d)}
									<path {d} />
								{/each}
								{#each icon.circles ?? [] as c, ci (ci)}
									<circle cx={c.cx} cy={c.cy} r={c.r} />
								{/each}
								{#each icon.rects ?? [] as r, ri (ri)}
									<rect x={r.x} y={r.y} width={r.width} height={r.height} rx={r.rx} />
								{/each}
							</svg>
						</div>
						<div class="diff-t">{card.title}</div>
						<div class="diff-d">{card.body}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	#different {
		position: relative;
		isolation: isolate;
		background:
			radial-gradient(1200px 600px at 12% 0%, rgba(255, 92, 58, 0.18), transparent 60%),
			radial-gradient(900px 500px at 95% 30%, rgba(124, 92, 255, 0.18), transparent 60%),
			radial-gradient(800px 600px at 50% 100%, rgba(34, 211, 168, 0.12), transparent 65%),
			linear-gradient(180deg, #07070b 0%, #0a0a12 50%, #07070b 100%);
		color: #fff;
		padding: 120px 48px;
		overflow: hidden;
	}
	#different::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%);
		-webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%);
		pointer-events: none;
		z-index: 0;
	}
	#different::after {
		content: '';
		position: absolute;
		top: -20%;
		left: -10%;
		width: 60%;
		height: 80%;
		background: radial-gradient(circle at 50% 50%, rgba(255, 92, 58, 0.22), transparent 60%);
		filter: blur(60px);
		animation: diffOrb 14s ease-in-out infinite alternate;
		pointer-events: none;
		z-index: 0;
	}
	#different > * {
		position: relative;
		z-index: 1;
	}
	@keyframes diffOrb {
		0% { transform: translate(0, 0) scale(1); }
		100% { transform: translate(20%, 15%) scale(1.15); }
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
		color: var(--color-warm-coral);
		background: rgba(255, 92, 58, 0.08);
		border: 1px solid rgba(255, 92, 58, 0.25);
		padding: 6px 14px;
		border-radius: 100px;
		margin-bottom: 16px;
	}
	.lbl-dot {
		width: 5px;
		height: 5px;
		background: var(--color-warm-coral);
		border-radius: 50%;
	}
	.diff-top {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 72px;
		align-items: center;
		margin-bottom: 72px;
	}
	.diff-h {
		font-family: var(--font-headline);
		font-weight: 800;
		font-size: clamp(34px, 4.5vw, 58px);
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: #fff;
		margin: 18px 0 18px;
	}
	.diff-sub {
		font-size: 15px;
		color: #9b9ba8;
		line-height: 1.7;
		max-width: 480px;
	}

	.diff-table-wrap {
		position: relative;
	}
	.diff-table {
		position: relative;
		z-index: 1;
		background: linear-gradient(180deg, #14141c, #0f0f17);
		border: 1px solid #25252e;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}
	.dt-row {
		display: grid;
		grid-template-columns: 1.6fr 0.6fr 0.8fr;
		align-items: center;
		padding: 16px 22px;
		border-top: 1px solid #1f1f28;
		font-size: 13px;
		color: #cfcfd6;
	}
	.dt-row:first-child {
		border-top: none;
	}
	.dt-head {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.14em;
		color: #666673;
	}
	.dt-head .dt-brand {
		color: var(--color-warm-coral);
	}
	.dt-row span:not(:first-child) {
		text-align: right;
	}
	.dt-x {
		color: #444451;
		font-size: 14px;
	}
	.dt-check {
		color: #00c896;
		font-size: 14px;
		font-weight: 800;
	}

	/* Slider */
	.diff-slider-wrap {
		position: relative;
	}
	.diff-slider {
		display: flex;
		gap: 18px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		padding: 6px 4px 18px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.diff-slider::-webkit-scrollbar {
		display: none;
	}
	.diff-card {
		flex: 0 0 calc((100% - 36px) / 3);
		scroll-snap-align: start;
		min-width: 280px;
		background: #13131a;
		border: 1px solid #1f1f28;
		border-radius: 16px;
		padding: 28px;
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}
	.diff-card:hover {
		transform: translateY(-4px);
		border-color: #33333f;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
	}
	.diff-ic {
		width: 42px;
		height: 42px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		margin-bottom: 24px;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
	}
	.diff-t {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.01em;
		color: #fff;
		margin-bottom: 10px;
	}
	.diff-d {
		font-size: 13px;
		color: #9b9ba8;
		line-height: 1.7;
	}
	.diff-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 5;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: 1px solid #2a2a36;
		background: rgba(20, 20, 28, 0.92);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition: background 0.2s, transform 0.2s;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
	}
	.diff-nav:hover {
		background: #1f1f2b;
		transform: translateY(-50%) scale(1.06);
	}
	.diff-nav-l {
		left: -12px;
	}
	.diff-nav-r {
		right: -12px;
	}

	@media (max-width: 900px) {
		#different {
			padding: 64px 24px;
		}
		.diff-top {
			grid-template-columns: 1fr;
			gap: 36px;
		}
		.diff-card {
			flex: 0 0 85%;
		}
		.diff-nav {
			display: none;
		}
	}
</style>
