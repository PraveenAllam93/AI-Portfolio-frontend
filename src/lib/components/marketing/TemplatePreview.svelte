<script lang="ts">
	const templates = [
		{
			name: 'Minimal Dark',
			style: 'dark',
			headline: 'Alex Chen',
			subtitle: 'Full-Stack Developer',
			sections: ['About', 'Experience', 'Projects', 'Contact']
		},
		{
			name: 'Clean Professional',
			style: 'light',
			headline: 'Sarah Johnson',
			subtitle: 'Product Designer',
			sections: ['Introduction', 'Work', 'Skills', 'Education']
		},
		{
			name: 'Creative Bold',
			style: 'creative',
			headline: 'Maya Patel',
			subtitle: 'Content Strategist',
			sections: ['Story', 'Portfolio', 'Expertise', 'Connect']
		}
	];
</script>

<section id="templates" class="bg-peach-100 py-20 md:py-28">
	<div class="mx-auto max-w-7xl px-6">
		<div class="text-center">
			<span class="font-serif text-sm font-semibold tracking-wide text-coral">
				Templates
			</span>
			<h2 class="mt-3 font-serif text-4xl font-bold text-charcoal md:text-5xl">
				Websites that look like you
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-lg text-charcoal-light">
				Professional templates designed for every style
			</p>
		</div>

		<div class="mt-16 grid gap-8 md:grid-cols-3">
			{#each templates as template}
				<!-- Browser frame mockup -->
				<div class="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:scale-[1.02]">
					<!-- Browser chrome -->
					<div class="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
						<div class="flex gap-1.5">
							<div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-green-400"></div>
						</div>
						<div class="mx-auto rounded-md bg-gray-100 px-8 py-1 text-xs text-gray-400">
							aifolio.dev/{template.headline.toLowerCase().replace(' ', '')}
						</div>
					</div>

					<!-- Template content mockup -->
					{#if template.style === 'dark'}
						<div class="bg-gray-900 p-6">
							<div class="space-y-4">
								<div class="h-2.5 w-16 rounded bg-gray-700"></div>
								<div class="font-serif text-xl font-bold text-white">
									{template.headline}
								</div>
								<div class="text-sm text-gray-400">{template.subtitle}</div>
								<div class="mt-4 flex gap-2">
									{#each template.sections as section}
										<span class="rounded bg-gray-800 px-2 py-1 text-[10px] text-gray-300">
											{section}
										</span>
									{/each}
								</div>
								<div class="mt-4 space-y-2">
									<div class="h-2 w-full rounded bg-gray-800"></div>
									<div class="h-2 w-4/5 rounded bg-gray-800"></div>
									<div class="h-2 w-3/5 rounded bg-gray-800"></div>
								</div>
								<div class="mt-4 grid grid-cols-2 gap-2">
									<div class="h-16 rounded-lg bg-gray-800"></div>
									<div class="h-16 rounded-lg bg-gray-800"></div>
								</div>
							</div>
						</div>
					{:else if template.style === 'light'}
						<div class="bg-white p-6">
							<div class="space-y-4">
								<div class="h-2.5 w-16 rounded bg-gray-200"></div>
								<div class="font-serif text-xl font-bold text-charcoal">
									{template.headline}
								</div>
								<div class="text-sm text-charcoal-light">{template.subtitle}</div>
								<div class="mt-4 flex gap-2">
									{#each template.sections as section}
										<span class="rounded-full border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
											{section}
										</span>
									{/each}
								</div>
								<div class="mt-4 space-y-2">
									<div class="h-2 w-full rounded bg-gray-100"></div>
									<div class="h-2 w-4/5 rounded bg-gray-100"></div>
									<div class="h-2 w-3/5 rounded bg-gray-100"></div>
								</div>
								<div class="mt-4 grid grid-cols-2 gap-2">
									<div class="h-16 rounded-lg bg-gray-50"></div>
									<div class="h-16 rounded-lg bg-gray-50"></div>
								</div>
							</div>
						</div>
					{:else}
						<div class="bg-amber-50 p-6">
							<div class="space-y-4">
								<div class="h-2.5 w-16 rounded bg-amber-200"></div>
								<div class="font-serif text-xl font-bold text-amber-900">
									{template.headline}
								</div>
								<div class="text-sm text-amber-700">{template.subtitle}</div>
								<div class="mt-4 flex gap-2">
									{#each template.sections as section}
										<span class="rounded-full bg-amber-200 px-2 py-1 text-[10px] font-semibold text-amber-800">
											{section}
										</span>
									{/each}
								</div>
								<div class="mt-4 space-y-2">
									<div class="h-2 w-full rounded bg-amber-100"></div>
									<div class="h-2 w-4/5 rounded bg-amber-100"></div>
									<div class="h-2 w-3/5 rounded bg-amber-100"></div>
								</div>
								<div class="mt-4 grid grid-cols-2 gap-2">
									<div class="h-16 rounded-lg bg-amber-100"></div>
									<div class="h-16 rounded-lg bg-amber-100"></div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Template name -->
					<div class="border-t border-gray-100 bg-white px-4 py-3">
						<p class="text-center text-sm font-semibold text-charcoal">{template.name}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
