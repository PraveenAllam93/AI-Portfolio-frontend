<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	const steps = [
		{
			number: '01',
			title: 'Upload',
			description: 'Drop your resume (PDF or DOC) and our AI extracts your content instantly.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>`
		},
		{
			number: '02',
			title: 'Customize',
			description: 'Pick a template, edit content inline, and enhance your copy with AI.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>`
		},
		{
			number: '03',
			title: 'Publish',
			description: 'Hit publish and share your unique portfolio URL with the world.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>`
		}
	];
</script>

<section id="how-it-works" class="gradient-bg-subtle py-20 md:py-28">
	<div class="mx-auto max-w-7xl px-6">
		<div class="text-center" use:reveal>
			<span class="inline-flex items-center rounded-full border border-violet-200 bg-white px-4 py-1.5 text-sm font-semibold text-brand">
				Effortless building
			</span>
			<h2 class="mt-4 font-serif text-4xl font-bold text-ink md:text-5xl">
				From resume to website <span class="gradient-text">in 3 steps</span>
			</h2>
		</div>

		<div class="mt-16 grid gap-6 md:grid-cols-3">
			{#each steps as step, i}
				<div
					use:reveal={{ delay: i * 150 }}
					class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
				>
					<!-- Large decorative number -->
					<div
						class="pointer-events-none absolute -top-3 -right-2 select-none font-serif text-9xl font-black leading-none gradient-text opacity-10"
					>
						{step.number}
					</div>

					<!-- Icon -->
					<div
						class="gradient-bg relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
					>
						{@html step.icon}
					</div>

					<p class="mb-1 text-xs font-bold uppercase tracking-widest text-brand">{step.number}</p>
					<h3 class="font-serif text-xl font-bold text-ink">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
