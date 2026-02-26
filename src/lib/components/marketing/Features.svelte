<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	const features = [
		{
			title: 'AI Resume Parsing',
			description: 'Upload your resume and watch AI extract your experience, skills, and achievements automatically.',
			tags: ['Smart extraction', 'PDF & DOC support'],
			borderColor: 'border-t-accent-emerald',
			iconBg: 'bg-emerald-50',
			iconColor: 'text-accent-emerald',
			tagBg: 'bg-emerald-50 text-emerald-700',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`
		},
		{
			title: 'Beautiful Templates',
			description: 'Choose from professionally designed templates that make your work shine.',
			tags: ['Responsive', 'Customizable'],
			borderColor: 'border-t-brand-light',
			iconBg: 'bg-violet-50',
			iconColor: 'text-brand-light',
			tagBg: 'bg-violet-50 text-violet-700',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" /></svg>`
		},
		{
			title: 'AI Content Enhancement',
			description: 'Refine your copy with AI assistance — improve tone, clarity, and impact.',
			tags: ['Tone adjustment', 'Copy improvement'],
			borderColor: 'border-t-accent-rose',
			iconBg: 'bg-rose-50',
			iconColor: 'text-accent-rose',
			tagBg: 'bg-rose-50 text-rose-700',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>`
		},
		{
			title: 'One-Click Publish',
			description: 'Go live with a unique URL. Share your portfolio with the world instantly.',
			tags: ['Custom URL', 'Instant hosting'],
			borderColor: 'border-t-accent-amber',
			iconBg: 'bg-amber-50',
			iconColor: 'text-accent-amber',
			tagBg: 'bg-amber-50 text-amber-700',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>`
		}
	];
</script>

<section id="features" class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-7xl px-6">
		<div class="text-center" use:reveal>
			<span class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-brand">
				All-in-one toolkit
			</span>
			<h2 class="mt-4 font-serif text-4xl font-bold text-ink md:text-5xl">
				Everything you need to <span class="gradient-text">stand out</span>
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
				Four powerful tools working together to take you from resume to published portfolio.
			</p>
		</div>

		<div class="mt-16 grid gap-6 md:grid-cols-2">
			{#each features as feature, i}
				<div
					use:reveal={{ delay: i * 110 }}
					class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border-t-4 {feature.borderColor}"
				>
					<div class="flex items-start gap-5">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 {feature.iconBg} {feature.iconColor}"
						>
							{@html feature.icon}
						</div>
						<div class="flex-1">
							<h3 class="font-serif text-xl font-bold text-ink">{feature.title}</h3>
							<p class="mt-2 text-sm leading-relaxed text-ink-soft">{feature.description}</p>
							<div class="mt-4 flex flex-wrap gap-2">
								{#each feature.tags as tag}
									<span class="rounded-full px-3 py-1 text-xs font-semibold {feature.tagBg}">{tag}</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
