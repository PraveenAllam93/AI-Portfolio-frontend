<script lang="ts">
	const features = [
		{
			icon: '✦',
			iconBg: 'rgba(124,58,237,.3)',
			iconBorder: 'rgba(124,58,237,.5)',
			title: 'AI Work Story Engine',
			body: 'Bullet points become impact-driven work stories. Upload a project, campaign, or design. AI writes the summary, caption, and portfolio entry automatically.'
		},
		{
			icon: '📊',
			iconBg: 'rgba(16,185,129,.2)',
			iconBorder: 'rgba(16,185,129,.4)',
			title: 'Portfolio Score & Guidance',
			body: 'A live quality score as you build. AI tells you exactly what to add, what\'s missing, and why it matters, with one-click fixes for every gap.'
		},
		{
			icon: '📸',
			iconBg: 'rgba(245,158,11,.2)',
			iconBorder: 'rgba(245,158,11,.4)',
			title: 'Media Upload + AI Summary',
			body: 'Upload photos, videos, or documents. AI generates professional descriptions instantly. No caption writing needed.'
		},
		{
			icon: '🎯',
			iconBg: 'rgba(124,58,237,.2)',
			iconBorder: 'rgba(124,58,237,.4)',
			title: 'Job Description Matching',
			body: 'Paste a job description. AI adapts your portfolio to match the exact keywords and story that specific role expects. One portfolio, infinitely targeted.'
		},
		{
			icon: '👁',
			iconBg: 'rgba(124,58,237,.25)',
			iconBorder: 'rgba(124,58,237,.45)',
			title: 'Recruiter View Mode',
			body: 'See exactly what a recruiter sees in 6 seconds, with a heatmap showing which sections get attention. Fix it before you share.'
		},
		{
			icon: '✨',
			iconBg: 'rgba(16,185,129,.15)',
			iconBorder: 'rgba(16,185,129,.35)',
			title: 'Contextual AI Suggestions',
			body: 'As you build, AI watches and suggests in real time. "This bullet needs a metric." "Add an image here." "This section is too long." Like a designer beside you.'
		}
	];

	const comparison = [
		'Reads your CV automatically',
		'Profession-specific layouts',
		'Writes your work stories for you',
		'Generates portfolio score + tips',
		'Recruiter view analytics',
		'AI summary from uploaded media'
	];
</script>

<section id="features">
	<div class="wrap">
		<!-- Top: headline + comparison -->
		<div class="top-grid">
			<div class="headline-col">
				<div class="diff-badge">● WHAT MAKES THIS DIFFERENT</div>
				<h2 class="sec-h">Not a website builder.<br />A career intelligence tool.</h2>
				<p class="sec-sub">
					Other tools give you a blank canvas and expect you to figure it out. We give you a portfolio
					that's already 80% done and help you take it to 100%.
				</p>
			</div>
			<!-- Comparison table -->
			<div class="compare-table">
				<div class="ct-header">
					<div class="ct-feat-col">FEATURE</div>
					<div class="ct-others">OTHERS</div>
					<div class="ct-us">PORTFOLIO.AI</div>
				</div>
				{#each comparison as row}
					<div class="ct-row">
						<div class="ct-lbl">{row}</div>
						<div class="ct-no">✕</div>
						<div class="ct-yes">✓</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- 6 feature blocks -->
		<div class="feat-grid">
			{#each features as feat}
				<div class="feat-card">
					<div
						class="feat-icon"
						style="background:{feat.iconBg};border:1px solid {feat.iconBorder}"
					>
						{feat.icon}
					</div>
					<div class="feat-title">{feat.title}</div>
					<div class="feat-body">{feat.body}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		background: var(--color-warm-cream2);
		padding: 88px 48px;
	}
	.wrap {
		max-width: 1160px;
		margin: 0 auto;
	}

	/* Top grid */
	.top-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 72px;
		align-items: center;
		margin-bottom: 72px;
	}
	.diff-badge {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: rgba(124, 58, 237, 0.15);
		color: var(--color-warm-coral);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		padding: 6px 13px;
		border-radius: 100px;
		margin-bottom: 20px;
		border: 1px solid rgba(124, 58, 237, 0.3);
	}
	.sec-h {
		font-family: var(--font-display);
		font-size: clamp(32px, 4.5vw, 52px);
		font-weight: 800;
		line-height: 1.06;
		letter-spacing: -0.03em;
		color: var(--color-warm-ink);
		margin-bottom: 20px;
	}
	.sec-sub {
		font-size: 15px;
		color: var(--color-warm-muted);
		line-height: 1.72;
		max-width: 380px;
	}

	/* Comparison table */
	.compare-table {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid var(--color-warm-border);
	}
	.ct-header {
		display: grid;
		grid-template-columns: 1fr 80px 110px;
		padding: 14px 20px;
		border-bottom: 1px solid var(--color-warm-border);
	}
	.ct-feat-col {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-warm-dim);
	}
	.ct-others {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-warm-dim);
		text-align: center;
	}
	.ct-us {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-warm-coral);
		text-align: center;
	}
	.ct-row {
		display: grid;
		grid-template-columns: 1fr 80px 110px;
		padding: 13px 20px;
		border-bottom: 1px solid var(--color-warm-border);
		align-items: center;
	}
	.ct-row:last-child {
		border: none;
	}
	.ct-lbl {
		font-size: 13px;
		color: var(--color-warm-muted);
	}
	.ct-no {
		text-align: center;
		font-size: 14px;
		color: var(--color-warm-dim);
	}
	.ct-yes {
		text-align: center;
		font-size: 14px;
		color: var(--color-warm-mint);
	}

	/* Feature grid */
	.feat-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	.feat-card {
		background: #ffffff;
		border-radius: 16px;
		padding: 28px;
		border: 1px solid var(--color-warm-border);
		transition: border-color 0.2s;
	}
	.feat-card:hover {
		border-color: rgba(124, 58, 237, 0.25);
	}
	.feat-icon {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		margin-bottom: 18px;
	}
	.feat-title {
		font-weight: 700;
		font-size: 16px;
		color: var(--color-warm-ink);
		margin-bottom: 10px;
		letter-spacing: -0.01em;
	}
	.feat-body {
		font-size: 13px;
		color: var(--color-warm-muted);
		line-height: 1.7;
	}

	@media (max-width: 900px) {
		section { padding: 56px 24px; }
		.top-grid { grid-template-columns: 1fr; gap: 40px; }
		.feat-grid { grid-template-columns: 1fr; }
	}
</style>
