<script lang="ts">
	import { reveal } from '$lib/actions/animate';
</script>

<section class="bg-surface-subtle py-24 md:py-32">
	<div class="mx-auto max-w-5xl px-6">
		<div class="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-20 text-center shadow-2xl md:px-20 md:py-24">
			<!-- Subtle glow background within the card -->
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
			
			<div class="relative z-10" use:reveal>
				<h2 class="font-serif text-4xl leading-tight font-bold text-white md:text-6xl">
					Ready to build your <br/> <span class="italic text-slate-400 text-3xl md:text-5xl">online presence?</span>
				</h2>
				<p class="mx-auto mt-8 max-w-xl text-lg text-slate-300">
					Join professionals worldwide who have traded complex website builders for an instant, AI-crafted portfolio. 
				</p>

				<div class="mt-12 flex justify-center">
					<a
						href="/signup"
						class="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-slate-100 active:scale-95"
					>
						Create your portfolio
						<svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
						</svg>
					</a>
				</div>
                <p class="mt-6 text-xs text-slate-400 font-medium">Free to start. No credit card required.</p>
			</div>
		</div>
	</div>
</section>
