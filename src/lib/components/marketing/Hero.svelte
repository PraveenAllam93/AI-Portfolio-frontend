<script lang="ts">
	import { reveal } from '$lib/actions/animate';
</script>

<section
	class="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32"
	style="background: linear-gradient(135deg, #6D28D9 0%, #A855F7 50%, #EC4899 100%)"
>
	<!-- Depth layers -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
		<div class="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
		<div class="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
		<!-- Dot grid -->
		<div
			class="absolute inset-0 opacity-10"
			style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 32px 32px;"
		></div>
	</div>

	<div class="relative mx-auto max-w-5xl px-6 text-center">
		<!-- Badge -->
		<div
			use:reveal={{ delay: 0 }}
			class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
		>
			<span>✨</span>
			<span>AI-Powered Portfolio Builder</span>
		</div>

		<h1
			use:reveal={{ delay: 100 }}
			class="font-serif text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl md:leading-tight"
		>
			Turn your resume into a
			<span class="relative mx-2 inline-block rounded-md bg-amber-400 px-3 py-1 text-ink italic">
				stunning
			</span>
			portfolio website
		</h1>

		<p use:reveal={{ delay: 200 }} class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
			Upload your resume. Let AI do the heavy lifting. Publish your personal site in minutes — no
			coding required.
		</p>

		<div
			use:reveal={{ delay: 300 }}
			class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
		>
			<a
				href="/signup"
				class="rounded-full bg-white px-8 py-4 text-base font-semibold text-brand shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
			>
				Get Started Free
			</a>
			<a
				href="#templates"
				class="rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
			>
				See Examples
			</a>
		</div>

		<!-- Trust strip -->
		<div
			use:reveal={{ delay: 400 }}
			class="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70"
		>
			{#each ['No credit card needed', 'Free to start', 'Live in minutes'] as item}
				<span class="flex items-center gap-1.5">
					<svg class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m5 13 4 4L19 7" />
					</svg>
					{item}
				</span>
			{/each}
		</div>

		<!-- Floating mockup — animate-float applies CSS keyframe -->
		<div
			use:reveal={{ delay: 500, y: 32 }}
			class="relative mx-auto mt-16 max-w-2xl"
		>
			<div
				class="animate-float overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm"
			>
				<!-- Browser chrome -->
				<div class="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
					<div class="flex gap-1.5">
						<div class="h-2.5 w-2.5 rounded-full bg-red-400/70"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-amber-400/70"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-emerald-400/70"></div>
					</div>
					<div class="mx-auto rounded-md bg-white/10 px-10 py-1 text-xs text-white/50">
						aifolio.dev/yourname
					</div>
				</div>
				<!-- Mock portfolio content -->
				<div class="grid grid-cols-3 gap-0">
					<div class="col-span-1 border-r border-white/10 bg-white/5 p-5">
						<div class="mb-3 h-12 w-12 rounded-full bg-white/20"></div>
						<div class="mb-2 h-3 w-20 rounded bg-white/30"></div>
						<div class="mb-4 h-2 w-16 rounded bg-white/20"></div>
						<div class="space-y-1.5">
							{#each [14, 12, 16, 10] as w}
								<div class="h-2 rounded bg-white/15" style="width: {w * 4}px"></div>
							{/each}
						</div>
					</div>
					<div class="col-span-2 p-5">
						<div class="mb-3 h-4 w-3/4 rounded bg-white/30"></div>
						<div class="mb-5 space-y-1.5">
							{#each [90, 75, 85, 60] as w}
								<div class="h-2 rounded bg-white/15" style="width: {w}%"></div>
							{/each}
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div class="h-16 rounded-xl bg-white/10"></div>
							<div class="h-16 rounded-xl bg-white/10"></div>
						</div>
					</div>
				</div>
			</div>
			<!-- Glow behind mockup -->
			<div
				class="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-2xl"
				style="background: linear-gradient(135deg, #6D28D9, #EC4899);"
			></div>
		</div>
	</div>
</section>
