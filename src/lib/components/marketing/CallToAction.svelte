<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '$lib/actions/animate';

	type Stat = { target: number; suffix: string; label: string };

	const stats: Stat[] = [
		{ target: 10000, suffix: 'k+', label: 'Portfolios built' },
		{ target: 5, suffix: ' min', label: 'Average setup' },
		{ target: 100, suffix: '%', label: 'Free to start' }
	];

	// Display values (will count up)
	let displayValues = $state(stats.map((s) => 0));
	let counted = false;

	function formatValue(stat: Stat, current: number): string {
		if (stat.target >= 1000) return Math.floor(current / 1000) + stat.suffix;
		return Math.floor(current) + stat.suffix;
	}

	function startCountUp() {
		if (counted) return;
		counted = true;
		const duration = 1500;
		const steps = 60;
		const interval = duration / steps;

		stats.forEach((stat, idx) => {
			let step = 0;
			const timer = setInterval(() => {
				step++;
				const progress = step / steps;
				// Ease out cubic
				const eased = 1 - Math.pow(1 - progress, 3);
				displayValues[idx] = stat.target * eased;
				if (step >= steps) {
					displayValues[idx] = stat.target;
					clearInterval(timer);
				}
			}, interval);
		});
	}

	onMount(() => {
		const section = document.getElementById('cta-stats');
		if (!section) return;

		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					startCountUp();
					io.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		io.observe(section);
		return () => io.disconnect();
	});
</script>

<section
	class="relative overflow-hidden py-20 md:py-28"
	style="background: linear-gradient(135deg, #6D28D9 0%, #A855F7 50%, #EC4899 100%)"
>
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 28px 28px;"
	></div>
	<div class="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
	<div class="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

	<div class="relative mx-auto max-w-4xl px-6 text-center">
		<div use:reveal>
			<h2 class="font-serif text-4xl font-bold text-white md:text-6xl">
				Ready to build your<br />online presence?
			</h2>
			<p class="mx-auto mt-5 max-w-xl text-lg text-white/75">
				Join professionals showcasing their work with AIfolio. Upload your resume and go live in
				minutes.
			</p>
		</div>

		<div use:reveal={{ delay: 150 }} class="mt-10">
			<a
				href="/signup"
				class="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-semibold text-brand shadow-xl transition-all hover:scale-[1.03] hover:shadow-2xl"
			>
				Get Started Free
				<svg
					class="h-4 w-4 transition-transform group-hover:translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
				</svg>
			</a>
		</div>

		<!-- Stats — count-up triggered by IntersectionObserver -->
		<div
			id="cta-stats"
			class="mt-14 grid grid-cols-3 gap-4 border-t border-white/20 pt-10"
		>
			{#each stats as stat, i}
				<div use:reveal={{ delay: 200 + i * 100 }}>
					<div class="font-serif text-3xl font-bold text-white md:text-4xl tabular-nums">
						{formatValue(stat, displayValues[i])}
					</div>
					<div class="mt-1 text-sm text-white/60">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>
