<script lang="ts">
	let activeStep = $state(1);

	const steps = [
		{
			n: 1,
			title: 'Upload your CV. That\'s all.',
			body: 'PDF, Word doc, or plain text. Anything works. AI reads your roles, achievements, skills, and projects instantly.',
			tags: ['PDF', 'DOCX', 'LinkedIn URL', 'Plain text']
		},
		{
			n: 2,
			title: 'AI builds your portfolio',
			body: 'AI detects your profession, writes your bio and work stories, and picks the layout your field expects.',
			tags: ['Profession Detection', 'Work Stories', 'KPI Extraction']
		},
		{
			n: 3,
			title: 'Edit anything. Add your work.',
			body: 'Click any text to edit it. Upload images, decks, or campaign visuals. AI writes the description automatically.',
			tags: ['Inline Editing', 'Media Upload', 'AI Score']
		},
		{
			n: 4,
			title: 'Publish and track recruiter visits',
			body: 'Get a live link. See who viewed it, which sections got attention, and get notified when a recruiter visits.',
			tags: ['Live URL', 'View Tracking', 'Notifications']
		}
	];
</script>

<section id="how">
	<div class="wrap">
		<div class="how-grid">
			<!-- Left: steps -->
			<div>
				<div class="sec-lbl"><span class="lbl-dot"></span>HOW IT WORKS</div>
				<h2 class="sec-h">From CV to live portfolio in four steps.</h2>
				<p class="sec-sub">Upload your CV. AI handles the design, writing, and structure.</p>
				<div class="how-steps">
					{#each steps as step}
						<button class="step" class:on={activeStep === step.n} onclick={() => (activeStep = step.n)}>
							<div class="step-hd">
								<div class="step-n">{step.n}</div>
								<div class="step-ttl">{step.title}</div>
							</div>
							<div class="step-bd">{step.body}</div>
							<div class="step-tags">
								{#each step.tags as tag}
									<span class="stag">{tag}</span>
								{/each}
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Right: sticky panel -->
			<div class="panel-wrap">
				<div class="how-panel">
					<!-- Stage 1: Upload -->
					{#if activeStep === 1}
						<div class="hp-stage">
							<p class="stage-lbl">Step 1 — Upload</p>
							<div class="upload-zone">
								<div class="uz-ico">📄</div>
								<div class="uz-ttl">Drop your CV here</div>
								<div class="uz-sub">AI reads everything instantly</div>
								<div class="uz-tags">
									<span class="uz-tag">PDF</span>
									<span class="uz-tag">DOCX</span>
									<span class="uz-tag">LinkedIn</span>
									<span class="uz-tag">TXT</span>
								</div>
							</div>
							<div class="file-ready">
								<strong>✓ sarah_jenkins_cv.pdf</strong> ready to process
							</div>
						</div>
					{/if}

					<!-- Stage 2: AI Building -->
					{#if activeStep === 2}
						<div class="hp-stage">
							<p class="stage-lbl">Step 2 — AI Building</p>
							<div class="ai-row">
								<div class="ai-dot done"></div>
								<div>
									<div class="ai-txt">Parsing CV content</div>
									<div class="ai-sub">Found 3 roles, 12 achievements, 8 skills</div>
								</div>
							</div>
							<div class="ai-row">
								<div class="ai-dot done"></div>
								<div>
									<div class="ai-txt">Profession detected</div>
									<div class="ai-sub">Senior Marketer, applying marketing template</div>
								</div>
							</div>
							<div class="ai-row">
								<div class="ai-dot run"></div>
								<div>
									<div class="ai-txt">Writing work stories...</div>
									<div class="ai-sub">Turning bullets into impact narratives</div>
								</div>
							</div>
							<div class="ai-row">
								<div class="ai-dot wait"></div>
								<div>
									<div class="ai-txt" style="opacity:.5">Extracting KPIs</div>
									<div class="ai-sub" style="opacity:.5">Finding measurable results</div>
								</div>
							</div>
							<div class="ai-row">
								<div class="ai-dot wait"></div>
								<div>
									<div class="ai-txt" style="opacity:.5">Building portfolio</div>
									<div class="ai-sub" style="opacity:.5">Assembling sections and layout</div>
								</div>
							</div>
							<div class="prog-bar">
								<div class="prog-fill"></div>
							</div>
						</div>
					{/if}

					<!-- Stage 3: Edit -->
					{#if activeStep === 3}
						<div class="hp-stage">
							<p class="stage-lbl">Step 3 — Edit</p>
							<div class="edit-mock">
								<div class="edit-top">
									<span>portfolio.ai/sarah-jenkins</span>
									<span style="color:var(--color-warm-mint)">● Live</span>
								</div>
								<div class="edit-body">
									<div class="edit-hint">Click any text to edit. Select text for AI options.</div>
									<div class="edit-text">
										Led the <span class="edit-sel">Ramadan 2024 campaign</span> achieving 230% improvement in
										ROAS through A/B creative testing across Meta and Google Ads.
									</div>
									<div class="ai-toolbar">
										<span class="ai-toolbar-label">AI:</span>
										<span class="ai-opt">Rewrite</span>
										<span class="ai-opt">Add metric</span>
										<span class="ai-opt">Expand</span>
										<span class="ai-opt">Shorten</span>
									</div>
								</div>
							</div>
							<div class="ai-suggestion">
								<strong>🤖 AI Suggestion:</strong> Add your team size and timeline to increase recruiter
								confidence.
							</div>
						</div>
					{/if}

					<!-- Stage 4: Live -->
					{#if activeStep === 4}
						<div class="hp-stage">
							<p class="stage-lbl">Step 4 — Live &amp; Tracked</p>
							<div class="pub-url">🔗 portfolio.ai/sarah-jenkins</div>
							<div class="pub-stats">
								<div class="pub-stat">
									<div class="ps-v">12</div>
									<div class="ps-l">Views</div>
								</div>
								<div class="pub-stat">
									<div class="ps-v">3m 20s</div>
									<div class="ps-l">Avg time</div>
								</div>
								<div class="pub-stat">
									<div class="ps-v">4</div>
									<div class="ps-l">Recruiters</div>
								</div>
							</div>
							<div class="pub-notif">
								<div class="notif-dot"></div>
								<div>
									<strong>Recruiter from Publicis MENA</strong> viewed your portfolio · 2 min ago
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
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
	.sec-h {
		font-family: var(--font-display);
		font-size: clamp(28px, 4vw, 46px);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--color-warm-ink);
		margin-bottom: 10px;
	}
	.sec-sub {
		font-size: 15px;
		color: var(--color-warm-muted);
		margin-bottom: 6px;
	}
	.how-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 72px;
		align-items: start;
	}
	.how-steps {
		margin-top: 28px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.step {
		padding: 16px 18px;
		border-radius: 12px;
		cursor: pointer;
		transition: background 0.2s;
		border: 1px solid transparent;
		text-align: left;
		background: none;
		width: 100%;
	}
	.step.on {
		background: var(--color-warm-lav);
		border-color: rgba(124, 58, 237, 0.28);
	}
	.step:hover:not(.on) {
		background: var(--color-warm-cream);
	}
	.step-hd {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 5px;
	}
	.step-n {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 12px;
		background: var(--color-warm-border);
		color: var(--color-warm-muted);
		flex-shrink: 0;
		transition: background 0.2s, color 0.2s;
		font-family: var(--font-display);
	}
	.step.on .step-n {
		background: var(--color-warm-indigo);
		color: #fff;
	}
	.step-ttl {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 14px;
		letter-spacing: -0.01em;
		color: var(--color-warm-ink);
	}
	.step-bd {
		font-size: 13px;
		color: var(--color-warm-muted);
		line-height: 1.6;
		padding-left: 40px;
	}
	.step-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding-left: 40px;
		margin-top: 7px;
	}
	.stag {
		font-size: 10px;
		font-weight: 600;
		background: #fff;
		border: 1px solid var(--color-warm-border);
		border-radius: 100px;
		padding: 3px 9px;
		color: var(--color-warm-muted);
	}
	.step.on .stag {
		border-color: rgba(124, 58, 237, 0.22);
		color: var(--color-warm-indigo);
	}

	/* Panel */
	.panel-wrap {
		position: sticky;
		top: 88px;
	}
	.how-panel {
		background: #fff;
		border-radius: 14px;
		border: 1px solid var(--color-warm-border);
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
		overflow: hidden;
		min-height: 340px;
	}
	.hp-stage {
		padding: 24px;
		animation: fadeInUp 0.35s ease;
	}
	.stage-lbl {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-warm-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 12px;
	}

	/* Upload zone */
	.upload-zone {
		border: 1.5px dashed var(--color-warm-border-dark);
		border-radius: 12px;
		padding: 32px;
		text-align: center;
		background: var(--color-warm-lav);
		cursor: pointer;
		transition: border-color 0.2s;
	}
	.upload-zone:hover {
		border-color: var(--color-warm-indigo);
	}
	.uz-ico {
		font-size: 36px;
		margin-bottom: 10px;
	}
	.uz-ttl {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 15px;
		margin-bottom: 4px;
		color: var(--color-warm-ink);
	}
	.uz-sub {
		font-size: 12px;
		color: var(--color-warm-muted);
		margin-bottom: 14px;
	}
	.uz-tags {
		display: flex;
		gap: 6px;
		justify-content: center;
		flex-wrap: wrap;
	}
	.uz-tag {
		font-size: 10px;
		font-weight: 600;
		background: #fff;
		border: 1px solid var(--color-warm-border);
		border-radius: 100px;
		padding: 3px 10px;
		color: var(--color-warm-muted);
	}
	.file-ready {
		margin-top: 12px;
		background: var(--color-warm-cream2);
		border-radius: 8px;
		padding: 10px;
		font-size: 11px;
		color: var(--color-warm-muted);
	}

	/* AI building */
	.ai-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 0;
		border-bottom: 1px solid var(--color-warm-border);
	}
	.ai-row:last-of-type {
		border: none;
	}
	.ai-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.ai-dot.done { background: var(--color-warm-mint); }
	.ai-dot.run {
		background: var(--color-warm-amber);
		animation: pulse-dot 0.9s infinite;
	}
	.ai-dot.wait { background: var(--color-warm-border); }
	.ai-txt {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 12px;
		color: var(--color-warm-ink);
	}
	.ai-sub {
		font-size: 11px;
		color: var(--color-warm-muted);
		margin-top: 1px;
	}
	.prog-bar {
		background: var(--color-warm-border);
		border-radius: 100px;
		height: 5px;
		overflow: hidden;
		margin-top: 12px;
	}
	.prog-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-brand-dark), var(--color-brand-light));
		border-radius: 100px;
		animation: prog-fill 2.4s ease forwards;
	}

	/* Edit */
	.edit-mock {
		border: 1px solid var(--color-warm-border);
		border-radius: 12px;
		overflow: hidden;
	}
	.edit-top {
		background: var(--color-warm-cream);
		padding: 7px 12px;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-warm-muted);
		display: flex;
		justify-content: space-between;
	}
	.edit-body {
		padding: 12px;
		font-size: 12px;
		color: var(--color-warm-ink);
		line-height: 1.6;
	}
	.edit-hint {
		font-size: 11px;
		color: var(--color-warm-muted);
		margin-bottom: 7px;
	}
	.edit-text {
		font-size: 12px;
		line-height: 1.6;
	}
	.edit-sel {
		background: #ffe0a0;
		border-radius: 3px;
		padding: 0 2px;
	}
	.ai-toolbar {
		background: var(--color-warm-ink);
		color: #fff;
		padding: 8px 12px;
		display: flex;
		gap: 6px;
		border-radius: 8px;
		margin-top: 8px;
		flex-wrap: wrap;
		align-items: center;
	}
	.ai-toolbar-label {
		opacity: 0.6;
		font-size: 11px;
	}
	.ai-opt {
		background: rgba(255, 255, 255, 0.12);
		border-radius: 5px;
		padding: 3px 9px;
		cursor: pointer;
		font-size: 11px;
		font-weight: 600;
		transition: background 0.2s;
	}
	.ai-opt:hover {
		background: rgba(255, 255, 255, 0.22);
	}
	.ai-suggestion {
		background: var(--color-warm-lav);
		border-radius: 8px;
		padding: 10px;
		font-size: 11px;
		margin-top: 10px;
		color: var(--color-warm-ink);
	}

	/* Published */
	.pub-url {
		background: var(--color-warm-lav);
		border-radius: 8px;
		padding: 10px 14px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-warm-indigo);
		font-family: monospace;
		margin-bottom: 12px;
		text-align: center;
	}
	.pub-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin-bottom: 12px;
	}
	.pub-stat {
		background: var(--color-warm-cream2);
		border-radius: 8px;
		padding: 10px;
		text-align: center;
	}
	.ps-v {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--color-warm-ink);
	}
	.ps-l {
		font-size: 9px;
		color: var(--color-warm-muted);
		margin-top: 2px;
	}
	.pub-notif {
		background: var(--color-warm-mint-bg);
		border-radius: 8px;
		padding: 10px 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: var(--color-warm-ink);
	}
	.notif-dot {
		width: 7px;
		height: 7px;
		background: var(--color-warm-mint);
		border-radius: 50%;
		animation: pulse-dot 1.4s infinite;
		flex-shrink: 0;
	}

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: none; }
	}
	@keyframes pulse-dot {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}
	@keyframes prog-fill {
		from { width: 0; }
		to { width: 88%; }
	}

	@media (max-width: 900px) {
		section { padding: 56px 24px; }
		.how-grid { grid-template-columns: 1fr; }
		.panel-wrap { position: static; }
	}
</style>
