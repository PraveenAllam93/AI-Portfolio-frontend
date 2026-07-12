<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	const testimonials = [
		{
			quote:
				"I'd been job hunting for 3 months. Built my portfolio on a Sunday. Had two interview requests by Wednesday.",
			initials: 'NA',
			name: 'Nour A.',
			role: 'Marketing Manager · Dubai',
			avatarClass: 'ta-c'
		},
		{
			quote:
				"Recruiters started replying within a week of sharing my Portfolio.ai link. Best portfolio tool I've used.",
			initials: 'RL',
			name: 'Rohan L.',
			role: 'Product Designer · London',
			avatarClass: 'ta-i'
		},
		{
			quote:
				"I'm a final year student. My coursework looks like real projects now. Three companies asked me to come in.",
			initials: 'SK',
			name: 'Sara K.',
			role: 'Architecture Student · Beirut',
			avatarClass: 'ta-m'
		}
	];
</script>

<section id="testimonials">
	<div class="wrap">
		<h2 class="test-h" use:reveal>People stopped getting ignored.</h2>
		<div class="test-grid">
			{#each testimonials as t, i (t.name)}
				<div class="test-card" use:reveal={{ delay: i * 80 }}>
					<div class="test-q">"{t.quote}"</div>
					<div class="test-au">
						<div class="test-av {t.avatarClass}">{t.initials}</div>
						<div>
							<div class="test-nm">{t.name}</div>
							<div class="test-rl">{t.role}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
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
	.test-h {
		font-family: var(--font-headline);
		font-size: clamp(24px, 3.5vw, 42px);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.08;
		max-width: 420px;
		margin-bottom: 40px;
		color: var(--color-warm-ink);
	}
	.test-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.test-card {
		background: #fff;
		border-radius: 12px;
		padding: 24px;
		border: 1px solid var(--color-warm-border);
	}
	.test-q {
		font-size: 13px;
		color: var(--color-warm-ink);
		line-height: 1.7;
		margin-bottom: 16px;
		font-style: italic;
	}
	.test-au {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.test-av {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 11px;
		color: #fff;
		flex-shrink: 0;
	}
	.ta-c { background: linear-gradient(135deg, var(--color-warm-coral), var(--color-warm-amber)); }
	.ta-i { background: linear-gradient(135deg, var(--color-warm-indigo), #8b73ff); }
	.ta-m { background: linear-gradient(135deg, var(--color-warm-mint), #00a07a); }
	.test-nm {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 12px;
		color: var(--color-warm-ink);
	}
	.test-rl {
		font-size: 11px;
		color: var(--color-warm-muted);
	}

	@media (max-width: 900px) {
		section { padding: 56px 24px; }
		.test-grid { grid-template-columns: 1fr; }
	}
</style>
