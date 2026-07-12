<script lang="ts">
	import { TEMPLATES } from './landing-data';

	let active = $state(0);
	let paused = $state(false);

	// Backend doesn't support live template previews yet — flip to re-enable
	const SHOW_LIVE_PREVIEW = false;

	$effect(() => {
		if (paused) return;
		const id = window.setInterval(() => {
			active = (active + 1) % TEMPLATES.length;
		}, 2600);
		return () => window.clearInterval(id);
	});

	const current = $derived(TEMPLATES[active]);

	function posClass(i: number): string {
		const offset = (i - active + TEMPLATES.length) % TEMPLATES.length;
		if (offset === 0) return 'ts-pos-front';
		if (offset === 1) return 'ts-pos-right1';
		if (offset === 2) return 'ts-pos-right2';
		if (offset === TEMPLATES.length - 1) return 'ts-pos-left1';
		return 'ts-pos-back';
	}

	function isVisible(i: number): boolean {
		const offset = (i - active + TEMPLATES.length) % TEMPLATES.length;
		return offset <= 3 || offset >= TEMPLATES.length - 1;
	}

	function slug(profession: string): string {
		return profession.toLowerCase().replace(/\s+/g, '-');
	}
</script>

<div
	class="ts-stage"
	role="region"
	aria-label="Template spotlight"
	onmouseenter={() => (paused = true)}
	onmouseleave={() => (paused = false)}
	style="--accent:{current.color}"
>
	<div class="ts-bg-glow" aria-hidden="true"></div>
	<div class="ts-aurora" aria-hidden="true"><span></span><span></span><span></span></div>

	<div class="ts-main">
		<div class="ts-info">
			<div class="ts-eyebrow">
				<span class="ts-pulse"></span>
				Live preview · {String(active + 1).padStart(2, '0')} / {String(TEMPLATES.length).padStart(2, '0')}
			</div>
			<h3 class="ts-prof" style="color:{current.color}">{current.profession}</h3>
			<div class="ts-name">{current.name}</div>
			<p class="ts-desc">
				AI drafts every section from your CV — projects, metrics, story. Switch templates anytime
				without losing your work.
			</p>
			<div class="ts-tags">
				{#each current.tags as tag (tag)}
					<span class="ts-tag">{tag}</span>
				{/each}
			</div>
			<div class="ts-actions">
				<a href="/signup" class="ts-btn-primary">Use this template</a>
				{#if SHOW_LIVE_PREVIEW}
					<a href="/signup" class="ts-btn-ghost">Live preview →</a>
				{/if}
			</div>

			<div class="ts-dots" role="tablist">
				{#each TEMPLATES as _, i (i)}
					<button
						class="ts-dot"
						class:on={i === active}
						onclick={() => (active = i)}
						aria-label="Show template {i + 1}"
					></button>
				{/each}
			</div>
		</div>

		<div class="ts-stack">
			{#each TEMPLATES as tpl, i (tpl.name)}
				<button
					class="ts-card {posClass(i)}"
					style="--c:{tpl.color};opacity:{isVisible(i) ? 1 : 0};pointer-events:{i === active
						? 'auto'
						: 'none'}"
					onclick={() => (active = i)}
					tabindex={i === active ? 0 : -1}
					aria-label="Show {tpl.name} template"
				>
					<div class="ts-card-frame">
						<div class="ts-card-bar">
							<span></span><span></span><span></span>
							<div class="ts-card-url">portfolio.ai/{slug(tpl.profession)}</div>
						</div>
						<img src={tpl.img} alt="{tpl.name} portfolio template" loading="lazy" width="800" height="1024" />
						<div class="ts-card-shine"></div>
						<div class="ts-card-tag" style="color:{tpl.color};border-color:{tpl.color}">
							{tpl.profession}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<div class="ts-strip" aria-hidden="true">
		{#each TEMPLATES as tpl, i (tpl.name)}
			<button class="ts-thumb" class:on={i === active} style="--c:{tpl.color}" onclick={() => (active = i)} tabindex="-1">
				<img src={tpl.img} alt="" loading="lazy" />
				<span class="ts-thumb-label">{tpl.profession}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.ts-stage {
		position: relative;
		margin: 56px auto 0;
		max-width: 1180px;
		border-radius: 28px;
		padding: 48px 48px 32px;
		background:
			radial-gradient(1200px 600px at 80% -10%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%),
			radial-gradient(900px 500px at -10% 110%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%),
			linear-gradient(180deg, #0d0e12 0%, #07080b 100%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
		isolation: isolate;
		box-shadow: 0 40px 120px -40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}
	.ts-bg-glow {
		position: absolute;
		inset: -1px;
		background: radial-gradient(600px 300px at 70% 30%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%);
		filter: blur(40px);
		z-index: 0;
		transition: background 0.8s ease;
	}
	.ts-aurora {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}
	.ts-aurora span {
		position: absolute;
		width: 320px;
		height: 320px;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.55;
		animation: tsFloat 12s ease-in-out infinite;
	}
	.ts-aurora span:nth-child(1) { background: var(--accent); top: -80px; left: -60px; }
	.ts-aurora span:nth-child(2) { background: #6366f1; bottom: -100px; right: 20%; animation-delay: -4s; }
	.ts-aurora span:nth-child(3) { background: #ec4899; top: 30%; right: -80px; animation-delay: -8s; }
	@keyframes tsFloat {
		0%, 100% { transform: translate(0, 0) scale(1); }
		50% { transform: translate(30px, -20px) scale(1.1); }
	}

	.ts-main {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr 1.05fr;
		gap: 32px;
		align-items: center;
		min-height: 460px;
	}
	.ts-info {
		color: #f4f4f6;
	}
	.ts-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #cfd1d8;
	}
	.ts-pulse {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 0 color-mix(in oklab, var(--accent) 60%, transparent);
		animation: tsPulse 1.6s ease-out infinite;
	}
	@keyframes tsPulse {
		0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--accent) 60%, transparent); }
		100% { box-shadow: 0 0 0 14px transparent; }
	}
	.ts-prof {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		margin: 18px 0 6px;
		transition: color 0.4s;
		font-family: var(--font-display);
	}
	.ts-name {
		font-family: var(--font-headline);
		font-size: clamp(34px, 4vw, 52px);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.02em;
		margin-bottom: 14px;
	}
	.ts-desc {
		color: #b8bac4;
		font-size: 16px;
		line-height: 1.6;
		max-width: 460px;
		margin-bottom: 20px;
	}
	.ts-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 24px;
	}
	.ts-tag {
		padding: 6px 12px;
		border-radius: 999px;
		font-size: 13px;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #e6e7ec;
	}
	.ts-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 28px;
	}
	.ts-btn-primary {
		padding: 12px 22px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 15px;
		background: linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 60%, #fff));
		color: #0a0a0d;
		border: 0;
		cursor: pointer;
		text-decoration: none;
		box-shadow: 0 10px 30px -10px color-mix(in oklab, var(--accent) 70%, transparent);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.ts-btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 16px 40px -12px color-mix(in oklab, var(--accent) 80%, transparent);
	}
	.ts-btn-ghost {
		padding: 12px 18px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 15px;
		background: transparent;
		color: #f4f4f6;
		border: 1px solid rgba(255, 255, 255, 0.18);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.2s, border-color 0.2s;
	}
	.ts-btn-ghost:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.3);
	}
	.ts-dots {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.ts-dot {
		width: 22px;
		height: 4px;
		border-radius: 2px;
		border: 0;
		padding: 0;
		background: rgba(255, 255, 255, 0.18);
		cursor: pointer;
		transition: all 0.3s;
	}
	.ts-dot.on {
		background: var(--accent);
		width: 36px;
	}

	/* Stack of cards */
	.ts-stack {
		position: relative;
		height: 460px;
		perspective: 1600px;
		transform-style: preserve-3d;
	}
	.ts-card {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 320px;
		height: 420px;
		transform-origin: center center;
		transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s;
		cursor: pointer;
		will-change: transform;
		background: none;
		border: 0;
		padding: 0;
	}
	.ts-card.ts-pos-front { transform: translate(-50%, -50%) translateZ(80px) rotateY(-4deg); z-index: 5; }
	.ts-card.ts-pos-right1 { transform: translate(-20%, -50%) translateZ(0) rotateY(-22deg) scale(0.9); z-index: 3; opacity: 0.7; }
	.ts-card.ts-pos-right2 { transform: translate(10%, -50%) translateZ(-100px) rotateY(-30deg) scale(0.78); z-index: 2; opacity: 0.4; }
	.ts-card.ts-pos-left1 { transform: translate(-80%, -50%) translateZ(0) rotateY(22deg) scale(0.9); z-index: 3; opacity: 0.7; }
	.ts-card.ts-pos-back { transform: translate(-50%, -50%) translateZ(-200px) scale(0.7); opacity: 0; z-index: 1; }

	.ts-card-frame {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 18px;
		overflow: hidden;
		background: #16171c;
		border: 1px solid color-mix(in oklab, var(--c) 30%, rgba(255, 255, 255, 0.08));
		box-shadow:
			0 30px 80px -20px rgba(0, 0, 0, 0.7),
			0 0 0 1px rgba(255, 255, 255, 0.04) inset,
			0 0 60px -20px color-mix(in oklab, var(--c) 50%, transparent);
	}
	.ts-card-bar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 12px;
		background: rgba(0, 0, 0, 0.4);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}
	.ts-card-bar span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
	}
	.ts-card-bar span:first-child { background: #ff5f57; }
	.ts-card-bar span:nth-child(2) { background: #febc2e; }
	.ts-card-bar span:nth-child(3) { background: #28c840; }
	.ts-card-url {
		margin-left: 10px;
		font-size: 11px;
		color: #8b8d96;
		background: rgba(255, 255, 255, 0.04);
		padding: 3px 10px;
		border-radius: 6px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ts-card-frame img {
		width: 100%;
		height: calc(100% - 38px);
		object-fit: cover;
		display: block;
	}
	.ts-card-shine {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%);
		transform: translateX(-100%);
		animation: tsShine 4s ease-in-out infinite;
	}
	@keyframes tsShine {
		0%, 40% { transform: translateX(-100%); }
		60%, 100% { transform: translateX(100%); }
	}
	.ts-card-tag {
		position: absolute;
		top: 50px;
		left: 14px;
		padding: 4px 10px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: rgba(10, 10, 13, 0.85);
		backdrop-filter: blur(8px);
		border: 1px solid;
		border-radius: 6px;
	}

	/* Bottom thumbnail strip */
	.ts-strip {
		position: relative;
		z-index: 2;
		display: flex;
		gap: 10px;
		overflow-x: auto;
		margin-top: 28px;
		padding: 4px 4px 8px;
		scrollbar-width: none;
	}
	.ts-strip::-webkit-scrollbar {
		display: none;
	}
	.ts-thumb {
		flex: 0 0 auto;
		width: 90px;
		height: 64px;
		position: relative;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		background: #16171c;
		border: 1px solid rgba(255, 255, 255, 0.08);
		padding: 0;
		transition: all 0.3s;
		opacity: 0.55;
	}
	.ts-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.ts-thumb-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 3px 6px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #fff;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ts-thumb:hover {
		opacity: 0.85;
		transform: translateY(-2px);
	}
	.ts-thumb.on {
		opacity: 1;
		border-color: var(--c);
		box-shadow: 0 8px 20px -6px color-mix(in oklab, var(--c) 60%, transparent);
	}

	@media (max-width: 900px) {
		.ts-stage { padding: 32px 20px 20px; border-radius: 22px; }
		.ts-main { grid-template-columns: 1fr; gap: 16px; min-height: auto; }
		.ts-stack { height: 380px; }
		.ts-card { width: 260px; height: 340px; }
		.ts-name { font-size: 32px; }
		.ts-thumb { width: 76px; height: 54px; }
	}
</style>
