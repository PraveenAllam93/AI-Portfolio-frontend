<section id="upload-cta">
	<div class="ucta-inner">
		<div class="sec-lbl">
			<span class="lbl-dot"></span>TRY IT FREE. NO ACCOUNT NEEDED
		</div>
		<h2 class="ucta-h">Upload your CV. Watch it become a portfolio.</h2>
		<p class="ucta-sub">Under 30 seconds. Zero design decisions. Zero writing. Just upload.</p>
		<div class="upload-box">
			<div class="ub-ttl">Get started in seconds</div>
			<div class="ub-sub">Drop your CV below. AI reads it and builds your full portfolio for free.</div>
			<div class="drop">
				<div class="drop-ico">📄</div>
				<div class="drop-ttl">Drag &amp; drop your CV here</div>
				<div class="drop-sub">or click to browse your files</div>
				<div class="drop-tags">
					<span class="dtag">PDF</span>
					<span class="dtag">DOCX</span>
					<span class="dtag">LinkedIn URL</span>
					<span class="dtag">TXT</span>
				</div>
			</div>
			<div class="ucta-btns">
				<a href="/signup" class="btn-gen">✨ Build My Portfolio — Try Now</a>
				<a href="/app/dashboard" class="btn-eg">👀 See an example portfolio</a>
			</div>
			<div class="upload-priv">🔒 Your resume is never stored, shared, or sold.</div>
		</div>
	</div>
</section>

<style>
	section {
		background: var(--color-warm-lav);
		padding: 88px 48px;
	}
	.ucta-inner {
		max-width: 580px;
		margin: 0 auto;
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
		margin-bottom: 16px;
	}
	.lbl-dot {
		width: 5px;
		height: 5px;
		background: var(--color-warm-coral);
		border-radius: 50%;
	}
	.ucta-h {
		font-family: var(--font-display);
		font-size: clamp(26px, 4vw, 48px);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.08;
		margin-bottom: 10px;
		color: var(--color-warm-ink);
	}
	.ucta-sub {
		font-size: 15px;
		color: var(--color-warm-muted);
		margin-bottom: 32px;
	}
	.upload-box {
		background: #fff;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 6px 32px rgba(0, 0, 0, 0.09);
		border: 1px solid var(--color-warm-border);
	}
	.ub-ttl {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.01em;
		margin-bottom: 5px;
		color: var(--color-warm-ink);
	}
	.ub-sub {
		font-size: 13px;
		color: var(--color-warm-muted);
		margin-bottom: 20px;
	}
	.drop {
		border: 1.5px dashed var(--color-warm-border-dark);
		border-radius: 12px;
		padding: 28px;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
		margin-bottom: 14px;
	}
	.drop:hover {
		border-color: var(--color-warm-indigo);
		background: var(--color-warm-lav);
	}
	.drop-ico {
		font-size: 28px;
		margin-bottom: 7px;
	}
	.drop-ttl {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 14px;
		margin-bottom: 2px;
		color: var(--color-warm-ink);
	}
	.drop-sub {
		font-size: 12px;
		color: var(--color-warm-muted);
	}
	.drop-tags {
		display: flex;
		gap: 6px;
		justify-content: center;
		margin-top: 10px;
		flex-wrap: wrap;
	}
	.dtag {
		font-size: 10px;
		font-weight: 600;
		background: var(--color-warm-cream);
		border: 1px solid var(--color-warm-border);
		border-radius: 100px;
		padding: 3px 10px;
		color: var(--color-warm-muted);
	}
	.ucta-btns {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}
	.btn-gen {
		flex: 1;
		font-family: var(--font-body-dm);
		font-size: 14px;
		font-weight: 700;
		color: #fff;
		background: var(--color-warm-ink);
		border: none;
		cursor: pointer;
		padding: 13px;
		border-radius: 100px;
		text-decoration: none;
		text-align: center;
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.btn-gen:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
	}
	.btn-eg {
		flex: 1;
		font-family: var(--font-body-dm);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-warm-ink);
		background: none;
		border: 1.5px solid var(--color-warm-border-dark);
		cursor: pointer;
		padding: 13px;
		border-radius: 100px;
		text-decoration: none;
		text-align: center;
		transition: border-color 0.2s;
	}
	.btn-eg:hover {
		border-color: var(--color-warm-ink);
	}
	.upload-priv {
		font-size: 11px;
		color: var(--color-warm-dim);
	}

	@media (max-width: 900px) {
		section { padding: 56px 24px; }
		.ucta-btns { flex-direction: column; }
	}
</style>
