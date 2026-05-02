<script lang="ts">
	const faqs = [
		{
			q: 'Do I need any design or coding skills?',
			a: 'None. Zero. Not even a little. You upload your CV, AI handles the design, layout, writing, and structure. The only thing you do is review and hit publish.'
		},
		{
			q: "Why do I need a portfolio? My CV has always worked.",
			a: "It worked. Until it didn't. A portfolio is not a replacement for your CV. It's what separates you from the 249 other candidates who sent the same CV for the same role. Hiring managers spend 6 seconds on a CV. They spend 3 minutes on a portfolio. That difference is the interview."
		},
		{
			q: 'How is this different from Wix, Canva, or Squarespace?',
			a: "Those tools build websites. We build portfolios designed specifically to get you hired. Every template, every section, every AI suggestion is built around what hiring managers in your field actually look for. Wix doesn't know what a marketing recruiter wants to see. We do."
		},
		{
			q: "What professions is this built for?",
			a: "Marketers, Product Designers, Architects and Interior Designers, and Students or Early Career professionals. Every profession gets its own template. The sections, structure, and tone are built specifically for how hiring works in your field."
		},
		{
			q: 'How does AI generate my portfolio?',
			a: "You upload your CV. AI reads your job titles, experience, skills, and achievements. AI detects your profession and builds a complete portfolio with a bio, work stories, KPI callouts, and the right sections for your field. The whole thing takes under 60 seconds."
		},
		{
			q: "What if I don't have much experience?",
			a: "That's exactly who this is built for. Students and early career professionals often have more to show than they think: coursework, internships, side projects, certifications. AI frames what you have in a way that makes recruiters take you seriously."
		},
		{
			q: 'Is my CV data safe?',
			a: "Yes. Your resume is processed to generate your portfolio and never stored, shared, or sold. We don't keep your data after your portfolio is built."
		},
		{
			q: "Can I edit my portfolio after it's generated?",
			a: "Completely. Click any text to edit it directly. Add or remove sections. Upload images of your work. The AI builds the first version. You make it yours."
		}
	];

	let openIndex = $state<number | null>(null);

	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}
</script>

<section id="faq">
	<div class="wrap">
		<div class="sec-lbl"><span class="lbl-dot"></span>FAQ</div>
		<h2 class="faq-h">Questions worth asking before you apply.</h2>
		<div class="faq-list">
			{#each faqs as faq, i}
				<div class="faq-item" class:open={openIndex === i}>
					<button class="faq-q" onclick={() => toggle(i)}>
						{faq.q}
						<span class="faq-ic">{openIndex === i ? '×' : '+'}</span>
					</button>
					{#if openIndex === i}
						<div class="faq-a">{faq.a}</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		background: #fff;
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
		margin-bottom: 16px;
	}
	.lbl-dot {
		width: 5px;
		height: 5px;
		background: var(--color-warm-coral);
		border-radius: 50%;
	}
	.faq-h {
		font-family: var(--font-display);
		font-size: clamp(24px, 3.5vw, 42px);
		font-weight: 800;
		letter-spacing: -0.03em;
		max-width: 440px;
		margin-bottom: 40px;
		color: var(--color-warm-ink);
	}
	.faq-list {
		max-width: 720px;
		display: flex;
		flex-direction: column;
	}
	.faq-item {
		border-bottom: 1px solid var(--color-warm-border);
	}
	.faq-q {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18px 0;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 700;
		color: var(--color-warm-ink);
		gap: 12px;
		letter-spacing: -0.01em;
	}
	.faq-q:hover {
		color: var(--color-warm-coral);
	}
	.faq-ic {
		font-size: 20px;
		color: var(--color-warm-dim);
		flex-shrink: 0;
		transition: transform 0.2s;
		font-weight: 400;
	}
	.faq-item.open .faq-ic {
		color: var(--color-warm-coral);
	}
	.faq-a {
		font-size: 14px;
		color: var(--color-warm-muted);
		line-height: 1.75;
		padding: 0 0 18px;
		max-width: 660px;
	}

	@media (max-width: 900px) {
		section { padding: 56px 24px; }
	}
</style>
