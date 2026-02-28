<script lang="ts">
	import { reveal } from '$lib/actions/animate';
</script>

<section class="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32 bg-surface-subtle">
	<!-- Background glow -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden flex justify-center items-center opacity-30">
		<div class="w-[800px] h-[400px] bg-gradient-to-r from-brand/20 via-neon-pink/10 to-transparent blur-[100px] rounded-full"></div>
	</div>

	<div class="relative mx-auto max-w-5xl px-6 text-center">
		<!-- Main Headline -->
		<h1
			use:reveal={{ delay: 100 }}
			class="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 md:text-7xl md:leading-[1.1]"
		>
			Your dream portfolio is <span class="relative inline-block"><span class="relative z-10">one upload</span><span class="absolute bottom-2 left-0 w-full h-3 bg-brand/30 -z-10 rounded-full"></span></span> away
		</h1>

		<p
			use:reveal={{ delay: 200 }}
			class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
		>
			For <span class="bg-brand/10 text-brand px-2 py-0.5 rounded-md font-medium">job seekers and professionals</span> who want a stunning online presence without hiring a designer or learning to code.
		</p>

		<!-- Call to action -->
		<div
			use:reveal={{ delay: 300 }}
			class="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
		>
			<a
				href="/signup"
				class="group flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 active:scale-95"
			>
				Try for Free
				<svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
				</svg>
			</a>
		</div>

		<!-- Trust Badges (simulating Product of the Day style) -->
		<div use:reveal={{ delay: 400 }} class="mt-16 flex flex-wrap justify-center gap-4 opacity-80">
			<div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xs">1</div>
				<div class="text-left">
					<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Hunt</div>
					<div class="text-sm font-bold text-slate-800">#1 Product of the Day</div>
				</div>
			</div>
			<div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs">★</div>
				<div class="text-left">
					<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Rated</div>
					<div class="text-sm font-bold text-slate-800">Portfolio Builder</div>
				</div>
			</div>
		</div>

		<!-- Subtle Hero Image/Mockup -->
		<div use:reveal={{ delay: 500, y: 40 }} class="relative mx-auto mt-24 max-w-4xl">
			<div class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
				<!-- Browser chrome -->
				<div class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
					<div class="flex gap-1.5">
						<div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
					</div>
					<div class="mx-auto rounded-md bg-white px-10 py-1 text-[10px] font-medium tracking-widest text-slate-400 border border-slate-200 shadow-sm">
						yourname.aifolio.dev
					</div>
				</div>
				<!-- Content Area -->
				<div class="bg-white p-8 md:p-12 relative flex flex-col md:flex-row gap-12 text-left">
					<div class="flex-1">
						<div class="h-16 w-16 bg-slate-100 rounded-full mb-6"></div>
						<h3 class="font-serif text-3xl font-bold text-slate-900 mb-4">Alex Developer</h3>
						<p class="text-slate-500 mb-8 leading-relaxed">Full-stack engineer building scalable systems and beautiful interfaces. 5+ years of experience in React, Node, and AWS.</p>
						<div class="flex gap-3">
							<div class="h-10 w-32 bg-slate-900 rounded-full"></div>
							<div class="h-10 w-10 bg-slate-100 rounded-full"></div>
						</div>
					</div>
					<div class="flex-1 grid grid-cols-2 gap-4">
						<div class="bg-slate-50 rounded-xl p-4 border border-slate-100 h-32"></div>
						<div class="bg-slate-50 rounded-xl p-4 border border-slate-100 h-32 mt-8"></div>
						<div class="bg-slate-50 rounded-xl p-4 border border-slate-100 h-32"></div>
						<div class="bg-slate-50 rounded-xl p-4 border border-slate-100 h-32 mt-8"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
