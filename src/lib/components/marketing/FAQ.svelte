<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	const faqs = [
		{
			q: 'Is building a portfolio free on Portfolio.ai?',
			a: 'Yes — you can build, preview, and publish your first portfolio for free. Upgrade only when you want analytics, custom domains, or unlimited portfolios.'
		},
		{
			q: 'Does Portfolio.ai host my portfolio for me?',
			a: 'Absolutely. Every portfolio gets a fast, secure live link hosted on our edge network — no servers, no DNS, no headaches.'
		},
		{
			q: 'How is Portfolio.ai better than Wix or Squarespace?',
			a: "Those are generic website builders. We're a career intelligence tool — AI reads your CV, writes your stories, picks the right sections for your profession, and scores your portfolio against what recruiters look for."
		},
		{
			q: 'How do I showcase my projects?',
			a: 'Drag & drop images, videos, PDFs, decks, or paste a link. AI writes the case study, captions, and metrics for you. Reorder anything in one click.'
		},
		{
			q: 'What kind of content can I display?',
			a: 'Case studies, KPIs, campaigns, code repos, design files, photo galleries, video reels, writing samples, research, decks — anything that proves your work.'
		},
		{
			q: 'How much storage do I get?',
			a: 'Free plans include generous storage for your first portfolio. Paid plans unlock unlimited media uploads and high-res video hosting.'
		},
		{
			q: 'Who is Portfolio.ai for?',
			a: 'Marketers, designers, students, architects, engineers, doctors, founders, executives — every profession. AI tunes layout and tone to your field.'
		},
		{
			q: 'What kind of sites can I build?',
			a: 'Personal portfolios, case study sites, photo galleries, project showcases, executive bios, and recruiter-targeted profiles. Each one is hire-ready, not just pretty.'
		}
	];

	let openIndex: number | null = $state(0);

	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}

	function scrollToUpload() {
		document.getElementById('upload-cta')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section id="faq">
	<div class="wrap">
		<div class="faq-card" use:reveal>
			<div class="faq-left">
				<h2 class="faq-h-new">
					<span class="faq-h-orange">Got questions?</span>
					<span class="faq-h-black">We came prepared.<span class="faq-underline"></span></span>
				</h2>
				<p class="faq-lead">
					Real answers to the things people actually ask before signing up. Still curious? Drop us a
					line.
				</p>
				<div class="faq-btns">
					<button class="faq-btn-dark" onclick={scrollToUpload}>Get started for free</button>
					<a class="faq-btn-light" href="mailto:hello@portfolio.ai">Get in touch</a>
				</div>
			</div>
			<div class="faq-right">
				{#each faqs as faq, i (faq.q)}
					<div class="faq-row" class:open={openIndex === i}>
						<button class="faq-row-q" onclick={() => toggle(i)}>
							<span>{faq.q}</span>
							<span class="faq-row-ic" aria-hidden="true">⌄</span>
						</button>
						<div class="faq-row-a">{faq.a}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		background: #fff;
		padding: 96px 48px;
	}
	.wrap {
		max-width: 1160px;
		margin: 0 auto;
	}
	.faq-card {
		background: #fde8dc;
		border-radius: 28px;
		padding: 64px;
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: 64px;
		align-items: start;
	}
	.faq-h-new {
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.05;
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
	}
	.faq-h-orange {
		color: #d8542a;
		font-style: italic;
		font-weight: 600;
		font-size: clamp(38px, 5vw, 62px);
		font-family: 'Playfair Display', Georgia, serif;
	}
	.faq-h-black {
		color: #111;
		font-size: clamp(34px, 4.5vw, 56px);
		font-weight: 700;
		font-style: italic;
		font-family: 'Playfair Display', Georgia, serif;
		position: relative;
		display: inline-block;
		width: fit-content;
	}
	.faq-underline {
		display: block;
		height: 8px;
		width: 88%;
		margin-top: -6px;
		background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 12'><path d='M2 7 Q 80 1 150 6 T 298 5' stroke='%2300b3a4' stroke-width='3' fill='none' stroke-linecap='round'/></svg>")
			no-repeat center / 100% 100%;
	}
	.faq-lead {
		margin-top: 22px;
		font-size: 15px;
		color: #3b2e26;
		line-height: 1.65;
		max-width: 380px;
	}
	.faq-btns {
		display: flex;
		gap: 12px;
		margin-top: 28px;
		flex-wrap: wrap;
	}
	.faq-btn-dark {
		background: #111;
		color: #fff;
		border: none;
		padding: 14px 26px;
		border-radius: 100px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s;
	}
	.faq-btn-dark:hover {
		transform: translateY(-2px);
	}
	.faq-btn-light {
		background: #111;
		color: #fff;
		border: none;
		padding: 14px 26px;
		border-radius: 100px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		opacity: 0.85;
		text-decoration: none;
		display: inline-block;
	}
	.faq-btn-light:hover {
		opacity: 1;
	}

	.faq-right {
		display: flex;
		flex-direction: column;
	}
	.faq-row {
		border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	}
	.faq-row:first-child {
		border-top: 1px solid rgba(0, 0, 0, 0.12);
	}
	.faq-row-q {
		width: 100%;
		background: none;
		border: none;
		padding: 22px 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		text-align: left;
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		color: #111;
		letter-spacing: -0.01em;
		gap: 16px;
	}
	.faq-row-q:hover {
		color: #d8542a;
	}
	.faq-row-ic {
		font-size: 20px;
		color: #111;
		transition: transform 0.3s ease;
		flex-shrink: 0;
		line-height: 1;
	}
	.faq-row.open .faq-row-ic {
		transform: rotate(180deg);
	}
	.faq-row-a {
		font-size: 14px;
		color: #4a3a30;
		line-height: 1.7;
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.35s ease, padding 0.3s ease;
		padding: 0 4px;
	}
	.faq-row.open .faq-row-a {
		max-height: 400px;
		padding: 0 4px 22px;
	}

	@media (max-width: 900px) {
		section {
			padding: 48px 16px;
		}
		.faq-card {
			padding: 32px 24px;
			grid-template-columns: 1fr;
			gap: 32px;
			border-radius: 20px;
		}
		.faq-underline {
			width: 100%;
		}
	}
</style>
