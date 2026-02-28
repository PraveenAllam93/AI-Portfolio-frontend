<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	const steps = [
		{
			title: 'Sign up and log in',
			description: 'Create your account in seconds.'
		},
		{
			title: 'Upload your resume',
			description: 'Drop your PDF or DOCX file.'
		},
		{
			title: 'Wait a few seconds',
			description: 'AI reads and understands your experience.'
		},
		{
			title: 'Get your portfolio URL',
			description: 'A professional website, already written and designed.'
		},
		{
			title: 'Share the link',
			description: 'Send it to recruiters, clients, or anyone.'
		}
	];
</script>

<section id="how-it-works" class="bg-white py-24 md:py-32">
	<div class="mx-auto max-w-4xl px-6">
		<div class="text-center mb-20" use:reveal>
			<h2 class="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
				From resume to live website. <br/> <span class="italic text-slate-500">— in seconds.</span>
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
				The absolute fastest path to a professional online presence.
			</p>
		</div>

		<div class="relative">
			<!-- Vertical Line -->
			<div class="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-slate-100 -translate-x-1/2"></div>

			<div class="space-y-12 md:space-y-0">
				{#each steps as step, i}
					<div use:reveal={{ delay: i * 100, y: 20 }} class="relative flex items-center group md:h-32">
						
						<!-- Left Side (Desktop) -->
						<div class="hidden md:flex w-1/2 justify-end pr-12">
							{#if i % 2 !== 0}
								<div class="text-right">
									<h3 class="font-serif text-xl font-bold text-slate-900">{step.title}</h3>
									<p class="mt-2 text-slate-500 text-sm">{step.description}</p>
								</div>
							{/if}
						</div>
						
						<!-- Center Node -->
						<div class="absolute left-6 md:left-1/2 w-10 h-10 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center shadow-sm z-10 -translate-x-1/2 transition-colors group-hover:border-slate-200">
							<span class="text-sm font-bold text-slate-400 group-hover:text-slate-900">{i + 1}</span>
						</div>

						<!-- Right Side (Desktop) & Full View (Mobile) -->
						<div class="w-full md:w-1/2 pl-16 md:pl-12 flex justify-start">
							<div class="text-left {i % 2 !== 0 ? 'md:hidden' : ''}">
								<h3 class="font-serif text-xl font-bold text-slate-900">{step.title}</h3>
								<p class="mt-2 text-slate-500 text-sm">{step.description}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		
		<div class="mt-20 flex justify-center" use:reveal={{ delay: 600 }}>
			<a href="/signup" class="group flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 active:scale-95">
				Start your journey
				<svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
				</svg>
			</a>
		</div>
	</div>
</section>
