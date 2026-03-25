<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	const templates = [
		{
			name: 'Minimal Clean',
			headline: 'Alex Developer',
			subtitle: 'Software Engineer',
			accentColor: '#cbd5e1',
			bgClass: 'bg-white',
			borderClass: 'border-slate-200/60',
			textClass: 'text-slate-800',
			subtextClass: 'text-slate-500',
			emoji: '✨'
		},
		{
			name: 'Noir Tech',
			headline: 'Sam Systems',
			subtitle: 'DevOps & Infrastructure',
			accentColor: '#334155',
			bgClass: 'bg-slate-900',
			borderClass: 'border-slate-800',
			textClass: 'text-slate-200',
			subtextClass: 'text-slate-400',
			emoji: '🚀'
		},
		{
			name: 'Creative Studio',
			headline: 'Maya Creative',
			subtitle: 'Art Director',
			accentColor: '#d6d3d1',
			bgClass: 'bg-[#fafaf9]',
			borderClass: 'border-stone-200/60',
			textClass: 'text-stone-800',
			subtextClass: 'text-stone-500',
			emoji: '🎨'
		}
	];

	// State for interactive tooltip delight
	let activeTooltip = $state<number | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	function handleMouseMove(e: MouseEvent, index: number) {
		activeTooltip = index;
		// Calculate position relative to viewport for fixed positioning
		tooltipX = e.clientX;
		tooltipY = e.clientY - 40; // Offset above cursor
	}
</script>

<section id="templates" class="relative bg-white py-32 md:py-40">
	<div class="relative mx-auto max-w-7xl px-6">
		<div class="text-center" use:reveal>
			<h2
				class="font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-4xl lg:text-5xl"
			>
				Focus on the <span class="group relative inline-block text-slate-500 italic">
					essential
					<!-- Hidden underline that draws on hover -->
					<svg
						class="pointer-events-none absolute -bottom-2 left-0 h-3 w-full fill-none stroke-slate-300 stroke-[3] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						viewBox="0 0 100 20"
						preserveAspectRatio="none"
					>
						<path
							d="M0,10 Q50,-5 100,10"
							stroke-dasharray="100"
							stroke-dashoffset="100"
							class="group-hover:animate-[draw-check_0.8s_ease_forward]"
						/>
					</svg>
				</span>
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
				Clean, intentional templates that remove the clutter and let your work stand out.
			</p>
		</div>

		<div class="mt-20 flex flex-col items-center justify-center gap-8 md:flex-row lg:gap-12">
			{#each templates as template, i}
				{@const isDark = template.bgClass === 'bg-slate-900'}
				<div
					use:reveal={{ delay: i * 150, y: 20 }}
					class="group relative w-full max-w-[320px] cursor-crosshair perspective-[1000px]"
					role="presentation"
					onmousemove={(e) => handleMouseMove(e, i)}
					onmouseleave={() => (activeTooltip = null)}
				>
					<div
						class="overflow-hidden rounded-2xl border {template.bgClass} {template.borderClass} relative shadow-sm transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:scale-[1.02] hover:rotate-x-[2deg] hover:rotate-y-[-1deg] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-none"
					>
						<!-- Subtle gradient overlay that shifts on hover -->
						<div
							class="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 {isDark
								? 'from-white/5'
								: ''} pointer-events-none"
						></div>

						<!-- Animated corner fold detail -->
						<div
							class="absolute -top-6 -right-6 z-20 h-12 w-12 origin-bottom-left rotate-45 transform bg-gradient-to-bl from-slate-200 to-white opacity-0 shadow-sm transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:scale-110 group-hover:opacity-100 dark:from-slate-700 dark:to-slate-800"
						></div>

						<div class="relative z-10 p-8 pb-10">
							<div
								class="group-hover:bg-opacity-80 mb-6 h-0.5 w-8 rounded-full transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-16"
								style="background: {template.accentColor}"
							></div>

							<div
								class="font-serif text-xl font-medium tracking-tight {template.textClass} flex items-center gap-2 transition-transform duration-[600ms] ease-out group-hover:translate-x-1"
							>
								{template.headline}
								<span
									class="inline-block -translate-x-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:rotate-12 group-hover:opacity-100"
								>
									{template.emoji}
								</span>
							</div>

							<div
								class="mt-1.5 text-[10px] font-semibold tracking-widest uppercase {template.subtextClass} transition-transform delay-75 duration-[600ms] ease-out group-hover:translate-x-1"
							>
								{template.subtitle}
							</div>

							<div
								class="mt-12 space-y-3.5 opacity-60 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100"
							>
								<!-- Staggered line expansions on hover -->
								<div
									class="h-1.5 w-11/12 rounded-full {isDark
										? 'bg-slate-800'
										: 'bg-slate-100'} relative overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-full"
								>
									<!-- Shine effect on the lines -->
									<div
										class="absolute top-0 left-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform delay-100 duration-1000 ease-in-out group-hover:translate-x-full dark:via-white/10"
									></div>
								</div>
								<div
									class="h-1.5 w-3/4 rounded-full {isDark
										? 'bg-slate-800'
										: 'bg-slate-100'} relative overflow-hidden transition-all delay-[50ms] duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-5/6"
								>
									<div
										class="absolute top-0 left-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform delay-200 duration-1000 ease-in-out group-hover:translate-x-full dark:via-white/10"
									></div>
								</div>
								<div
									class="h-1.5 w-5/6 rounded-full {isDark
										? 'bg-slate-800'
										: 'bg-slate-100'} relative overflow-hidden transition-all delay-[100ms] duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-11/12"
								>
									<div
										class="absolute top-0 left-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform delay-300 duration-1000 ease-in-out group-hover:translate-x-full dark:via-white/10"
									></div>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-6 flex justify-center">
						<span
							class="relative overflow-hidden px-2 text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase transition-colors duration-300 group-hover:text-slate-600"
						>
							<span class="relative z-10">{template.name}</span>
							<!-- Hover underline effect -->
							<span
								class="absolute bottom-0 left-0 h-[1px] w-full origin-right scale-x-0 bg-slate-300 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100"
							></span>
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Follow-cursor tooltip for delight -->
{#if activeTooltip !== null}
	<div
		class="pointer-events-none fixed z-50 rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-xl"
		style="left: {tooltipX}px; top: {tooltipY}px; transform: translate(-50%, -100%);"
	>
		Preview
	</div>
{/if}

<style>
	/* Add custom keyframe for the heading underline reveal */
	@keyframes draw-check {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
