<script lang="ts">
	import { reveal } from '$lib/actions/animate';
</script>

<section id="features" class="bg-[#fafafa] py-24 md:py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="text-center mb-20" use:reveal>
			<h2 class="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
				Everything you need. <br/> <span class="italic text-slate-500">Nothing you don't.</span>
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
				Powerful tools disguised as simple features, working silently to make you look your best.
			</p>
		</div>

		<!-- Bento Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[320px]">
			
			<!-- Card 1: AI Written Content (Wide) -->
			<div use:reveal={{ delay: 100 }} class="group lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
				<!-- Animated background glow -->
				<div class="absolute -right-20 -top-20 w-80 h-80 bg-brand/5 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150 group-hover:bg-brand/10"></div>
				
				<div class="relative z-10 flex flex-col md:flex-row gap-8 h-full items-center">
					<div class="flex-1">
						<div class="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 mb-4">
							<span class="relative flex h-2 w-2">
							  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
							  <span class="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
							</span>
							<span class="text-xs font-bold text-brand uppercase tracking-wider">AI Engine</span>
						</div>
						<h3 class="font-serif text-3xl font-bold text-slate-900 mb-3">Writes itself. Literally.</h3>
						<p class="text-slate-600 text-base leading-relaxed">Our engine draws directly from your resume, crafting a compelling narrative, headlines, and project descriptions. No writer's block required.</p>
					</div>
					<div class="flex-1 w-full relative h-full flex items-center justify-center">
						<div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 w-full max-w-sm transition-transform duration-500 group-hover:scale-105">
							<div class="space-y-4">
								<div class="flex gap-3 items-center">
									<div class="h-10 w-10 bg-slate-100 rounded-full shrink-0"></div>
									<div class="space-y-2 flex-1">
										<div class="h-3 w-1/3 bg-slate-200 rounded"></div>
										<div class="h-2 w-1/4 bg-slate-100 rounded"></div>
									</div>
								</div>
								<!-- Animated typing lines -->
								<div class="space-y-2 pt-2">
									<div class="h-2 w-full bg-gradient-to-r from-brand/20 to-slate-100 rounded overflow-hidden relative">
										<div class="absolute inset-0 bg-brand/40 -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-0"></div>
									</div>
									<div class="h-2 w-5/6 bg-gradient-to-r from-brand/20 to-slate-100 rounded overflow-hidden relative">
										<div class="absolute inset-0 bg-brand/40 -translate-x-full transition-transform duration-1000 delay-150 ease-out group-hover:translate-x-0"></div>
									</div>
									<div class="h-2 w-4/6 bg-gradient-to-r from-brand/20 to-slate-100 rounded overflow-hidden relative">
										<div class="absolute inset-0 bg-brand/40 -translate-x-full transition-transform duration-1000 delay-300 ease-out group-hover:translate-x-0"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Card 2: Public URL (Tall) -->
			<div use:reveal={{ delay: 200 }} class="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
				<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
				<div class="relative z-10 flex flex-col h-full">
					<h3 class="font-serif text-2xl font-bold text-white mb-3">Instant Public URL</h3>
					<p class="text-slate-400 text-sm leading-relaxed">Hosted on a reliable edge network. Ready to share with the world immediately.</p>
					
					<div class="mt-auto pt-8 relative">
						<!-- Floating link box -->
						<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
							<div class="flex items-center justify-between mb-2">
								<div class="text-xs font-medium text-slate-300 uppercase tracking-wider">Live Link</div>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 text-emerald-400">
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
							</div>
							<div class="flex items-center gap-2">
								<div class="text-sm font-bold text-white truncate">aifolio.dev/you</div>
								<div class="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ml-auto">
									<div class="bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md">Copy</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Card 3: Analytics (Small) -->
			<div use:reveal={{ delay: 300 }} class="group lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
				<div class="relative z-10 flex flex-col md:flex-row gap-8 h-full items-center">
					<div class="flex-1 w-full flex items-end justify-center h-40 gap-3">
						<!-- Animated Bar Chart -->
						{#each [40, 70, 45, 90, 60, 100, 80] as h, i}
							<div class="relative w-10 bg-slate-100 rounded-t-lg overflow-hidden group-hover:bg-slate-200 transition-colors" style="height: 100%">
								<div class="absolute bottom-0 left-0 w-full bg-slate-900 rounded-t-lg transition-all duration-1000 ease-out origin-bottom" 
									 style="height: {h}%; transform: scaleY(0.3); transition-delay: {i * 50}ms;" 
									 class:group-hover:scale-y-100={true}>
								</div>
							</div>
						{/each}
					</div>
					<div class="flex-1">
						<div class="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 text-slate-900 shadow-sm transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
							</svg>
						</div>
						<h3 class="font-serif text-2xl font-bold text-slate-900 mb-2">Built-in Analytics</h3>
						<p class="text-slate-600 text-sm leading-relaxed">See who's viewing your portfolio, where they're from, and when they look at it. Actionable data, right out of the box.</p>
					</div>
				</div>
			</div>

			<!-- Card 4: Manual Edits (Small) -->
			<div use:reveal={{ delay: 400 }} class="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-dark p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
				<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom_right,white,transparent)]"></div>
				<div class="relative z-10 flex flex-col h-full text-white">
					<div class="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5 backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
						</svg>
					</div>
					<h3 class="font-serif text-2xl font-bold mb-2">Edit or Ask AI</h3>
					<p class="text-white/80 text-sm leading-relaxed">Full control. Tweak sections manually or simply ask the AI to refine specific parts until it's perfect.</p>
					
					<div class="mt-auto pt-4 flex justify-end">
						<div class="bg-white/20 backdrop-blur-sm rounded-full p-2 translate-x-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
							</svg>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>
