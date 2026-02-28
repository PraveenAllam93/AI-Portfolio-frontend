<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	const templates = [
		{
			name: 'Minimal Clean',
			rotate: '-rotate-2',
			headline: 'Alex Developer',
			subtitle: 'Software Engineer',
			accentColor: '#0f172a',
			bgClass: 'bg-white',
            borderClass: 'border-slate-200'
		},
		{
			name: 'Noir Tech',
			rotate: 'rotate-0',
			headline: 'Sam Systems',
			subtitle: 'DevOps & Infrastructure',
			accentColor: '#38bdf8',
			bgClass: 'bg-slate-900',
            borderClass: 'border-slate-800'
		},
		{
			name: 'Creative Studio',
			rotate: 'rotate-2',
			headline: 'Maya Creative',
			subtitle: 'Art Director',
			accentColor: '#ec4899',
			bgClass: 'bg-stone-50',
            borderClass: 'border-stone-200'
		}
	];
</script>

<section id="templates" class="bg-[#fafafa] relative py-24 md:py-32">
	<div class="relative mx-auto max-w-7xl px-6">
		<div class="text-center" use:reveal>
			<h2 class="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
				Templates that <span class="italic text-slate-500">stand out</span>
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
				Beautifully designed, fully responsive templates tailored to your profession.
			</p>
		</div>

		<div class="mt-20 flex flex-col items-center justify-center gap-8 md:flex-row md:items-center">
			{#each templates as template, i}
				{@const isDark = template.bgClass === 'bg-slate-900'}
                <div
					use:reveal={{ delay: i * 150, y: 30 }}
					class="group w-full max-w-sm transition-all duration-500 hover:z-20 hover:scale-105 hover:rotate-0 {template.rotate} {i === 1 ? 'z-10 md:scale-[1.05]' : 'opacity-90 hover:opacity-100'}"
				>
					<div
						class="overflow-hidden rounded-3xl shadow-xl {template.bgClass} border {template.borderClass}"
					>
						<!-- Browser chrome -->
						<div class="flex items-center gap-2 border-b {isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/80'} px-4 py-3">
							<div class="flex gap-1.5">
								<div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
								<div class="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
								<div class="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
							</div>
						</div>
						<!-- Content -->
						<div class="min-h-[300px] p-8 relative">
                            <!-- Background accent elements -->
                            {#if isDark}
                                <div class="absolute right-0 top-0 w-32 h-32 bg-[#38bdf8]/10 rounded-full blur-2xl"></div>
                            {:else if i === 2}
                                <div class="absolute right-0 top-0 w-32 h-32 bg-[#ec4899]/5 rounded-full blur-2xl"></div>
                            {/if}

							<div
								class="mb-4 h-1.5 w-12 rounded-full relative z-10"
								style="background: {template.accentColor}"
							></div>
							<div class="font-serif text-2xl font-bold {isDark ? 'text-white' : 'text-slate-900'} relative z-10">{template.headline}</div>
							<div class="mb-8 text-sm font-medium tracking-wide {isDark ? 'text-slate-400' : 'text-slate-500'} relative z-10">
								{template.subtitle}
							</div>

							<div class="space-y-3 relative z-10">
								{#each [90, 75, 85] as w}
									<div class="h-2 rounded-full {isDark ? 'bg-slate-800' : 'bg-slate-100'}" style="width: {w}%"></div>
								{/each}
							</div>

							<div class="mt-8 grid grid-cols-2 gap-4 relative z-10">
								<div class="h-24 rounded-2xl border {isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}"></div>
								<div class="h-24 rounded-2xl border {isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}"></div>
							</div>
						</div>
					</div>
					<div class="mt-6 text-center">
						<span class="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold tracking-widest text-slate-600 uppercase transition-colors group-hover:bg-slate-200 group-hover:text-slate-900">
							{template.name}
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
