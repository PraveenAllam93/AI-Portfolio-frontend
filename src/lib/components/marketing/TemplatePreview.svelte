<script lang="ts">
	const templates = [
		{
			name: 'Minimal Dark',
			rotate: '-rotate-3',
			headline: 'Alex Chen',
			subtitle: 'Full-Stack Developer',
			accentColor: '#A855F7',
			bgDark: true
		},
		{
			name: 'Clean Professional',
			rotate: 'rotate-0',
			headline: 'Sarah Johnson',
			subtitle: 'Product Designer',
			accentColor: '#6D28D9',
			bgDark: false
		},
		{
			name: 'Creative Bold',
			rotate: 'rotate-3',
			headline: 'Maya Patel',
			subtitle: 'Content Strategist',
			accentColor: '#EC4899',
			bgDark: false
		}
	];
</script>

<section id="templates" class="py-20 md:py-28" style="background-color: #1E1033;">
	<!-- Subtle grid bg -->
	<div class="pointer-events-none absolute inset-0 opacity-5" style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 48px 48px;"></div>

	<div class="relative mx-auto max-w-7xl px-6">
		<div class="text-center">
			<span class="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
				Templates
			</span>
			<h2 class="mt-4 font-serif text-4xl font-bold text-white md:text-5xl">
				Websites that look <span class="gradient-text">like you</span>
			</h2>
			<p class="mx-auto mt-4 max-w-lg text-lg text-white/60">
				Professional templates designed for every personal style.
			</p>
		</div>

		<div class="mt-16 flex flex-col items-center justify-center gap-6 md:flex-row md:items-end">
			{#each templates as template, i}
				<div
					class="w-full max-w-xs transition-all duration-500 hover:rotate-0 hover:scale-[1.04] hover:z-10 {template.rotate} {i === 1 ? 'md:scale-[1.05] z-10 md:-mt-4' : 'md:scale-95 opacity-90 hover:opacity-100'}"
				>
					<div class="overflow-hidden rounded-2xl shadow-2xl" style="box-shadow: 0 25px 60px rgba(0,0,0,0.5)">
						<!-- Browser chrome -->
						<div class="flex items-center gap-2 px-4 py-2.5" style="background: #2A1F3D;">
							<div class="flex gap-1.5">
								<div class="h-2 w-2 rounded-full bg-red-400"></div>
								<div class="h-2 w-2 rounded-full bg-amber-400"></div>
								<div class="h-2 w-2 rounded-full bg-green-400"></div>
							</div>
							<div class="mx-auto rounded bg-white/10 px-6 py-0.5 text-[10px] text-white/40">
								aifolio.dev/{template.headline.toLowerCase().replace(' ', '')}
							</div>
						</div>
						<!-- Content -->
						{#if template.bgDark}
							<div class="p-5" style="background: #0F0A1E;">
								<div class="mb-1 h-2 w-10 rounded" style="background: {template.accentColor}; opacity: 0.8"></div>
								<div class="mb-0.5 font-serif text-sm font-bold text-white">{template.headline}</div>
								<div class="mb-4 text-xs text-white/40">{template.subtitle}</div>
								<div class="space-y-1.5">
									{#each [80, 65, 75, 50] as w}
										<div class="h-1.5 rounded" style="width: {w}%; background: rgba(255,255,255,0.1)"></div>
									{/each}
								</div>
								<div class="mt-4 grid grid-cols-2 gap-2">
									<div class="h-12 rounded-lg" style="background: rgba(255,255,255,0.06)"></div>
									<div class="h-12 rounded-lg" style="background: rgba(255,255,255,0.06)"></div>
								</div>
							</div>
						{:else}
							<div class="p-5" style="background: #FAFAFA;">
								<div class="mb-1 h-2 w-10 rounded" style="background: {template.accentColor}"></div>
								<div class="mb-0.5 font-serif text-sm font-bold" style="color: #1E1033">{template.headline}</div>
								<div class="mb-4 text-xs text-gray-400">{template.subtitle}</div>
								<div class="space-y-1.5">
									{#each [80, 65, 75, 50] as w}
										<div class="h-1.5 rounded bg-gray-100" style="width: {w}%"></div>
									{/each}
								</div>
								<div class="mt-4 grid grid-cols-2 gap-2">
									<div class="h-12 rounded-lg bg-gray-100"></div>
									<div class="h-12 rounded-lg bg-gray-100"></div>
								</div>
							</div>
						{/if}
					</div>
					<p class="mt-3 text-center text-xs font-semibold text-white/50">{template.name}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
