<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	type Portfolio = {
		name: string;
		role: string;
		skills: string[];
		exp: string;
		initials: string;
        theme: 'light' | 'dark' | 'brand';
	};

	const row1: Portfolio[] = [
		{
			name: 'Alex Chen',
			role: 'Full-Stack Engineer',
			skills: ['React', 'Node.js', 'TypeScript'],
			exp: '5 yrs',
			initials: 'AC',
            theme: 'light'
		},
		{
			name: 'Sarah Johnson',
			role: 'Product Designer',
			skills: ['Figma', 'UX Research', 'Prototyping'],
			exp: '4 yrs',
			initials: 'SJ',
            theme: 'dark'
		},
		{
			name: 'Marcus Thompson',
			role: 'Data Scientist',
			skills: ['Python', 'ML', 'TensorFlow'],
			exp: '6 yrs',
			initials: 'MT',
            theme: 'light'
		},
		{
			name: 'David Park',
			role: 'DevOps Engineer',
			skills: ['AWS', 'Docker', 'Kubernetes'],
			exp: '7 yrs',
			initials: 'DP',
            theme: 'brand'
		},
		{
			name: 'Zoe Martinez',
			role: 'iOS Developer',
			skills: ['Swift', 'SwiftUI', 'CoreML'],
			exp: '4 yrs',
			initials: 'ZM',
            theme: 'light'
		}
	];

	const row2: Portfolio[] = [
		{
			name: 'Priya Sharma',
			role: 'Frontend Developer',
			skills: ['Vue', 'CSS', 'WebGL'],
			exp: '3 yrs',
			initials: 'PS',
            theme: 'dark'
		},
		{
			name: 'Emma Wilson',
			role: 'Content Strategist',
			skills: ['SEO', 'Copywriting', 'Analytics'],
			exp: '5 yrs',
			initials: 'EW',
            theme: 'light'
		},
		{
			name: 'Raj Patel',
			role: 'Mobile Developer',
			skills: ['Flutter', 'Swift', 'Kotlin'],
			exp: '4 yrs',
			initials: 'RP',
            theme: 'brand'
		},
		{
			name: 'Luna Garcia',
			role: 'UX Researcher',
			skills: ['User Testing', 'Research', 'Figma'],
			exp: '3 yrs',
			initials: 'LG',
            theme: 'light'
		},
		{
			name: 'James Kim',
			role: 'Backend Engineer',
			skills: ['Go', 'PostgreSQL', 'Kafka'],
			exp: '5 yrs',
			initials: 'JK',
            theme: 'dark'
		}
	];

	// Duplicate each row for seamless infinite loop
	const cards1 = [...row1, ...row1];
	const cards2 = [...row2, ...row2];

    function getThemeClasses(theme: 'light' | 'dark' | 'brand') {
        switch (theme) {
            case 'dark':
                return {
                    card: 'bg-slate-900 border-slate-800',
                    textPrimary: 'text-white',
                    textSecondary: 'text-slate-400',
                    initialsBg: 'bg-slate-800 text-white',
                    skillBg: 'bg-slate-800 border-slate-700 text-slate-300'
                };
            case 'brand':
                return {
                    card: 'bg-gradient-to-br from-brand to-brand-dark border-brand/50',
                    textPrimary: 'text-white',
                    textSecondary: 'text-white/80',
                    initialsBg: 'bg-white/20 text-white',
                    skillBg: 'bg-white/10 border-white/20 text-white/90'
                };
            case 'light':
            default:
                return {
                    card: 'bg-white border-slate-200',
                    textPrimary: 'text-slate-900',
                    textSecondary: 'text-slate-500',
                    initialsBg: 'bg-slate-100 text-slate-900',
                    skillBg: 'bg-slate-50 border-slate-100 text-slate-600'
                };
        }
    }
</script>

<section class="relative overflow-hidden bg-white py-24 md:py-32">
	<div class="relative mx-auto max-w-7xl px-6">
		<div class="text-center" use:reveal>
			<h2 class="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
				Trusted by the <span class="italic text-slate-500">ambitious</span>
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
				Join thousands of professionals globally showcasing their evolution on AIfolio.
			</p>
		</div>
	</div>

	<!-- Marquee rows -->
	<div class="relative mt-20 space-y-8" data-pause>
		<!-- Fade masks -->
		<div
			class="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent"
		></div>
		<div
			class="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent"
		></div>

		<!-- Row 1 -->
		<div class="animate-marquee gap-6 overflow-visible px-4">
			{#each cards1 as p}
                {@const t = getThemeClasses(p.theme)}
				<div
					class="group w-80 shrink-0 rounded-[2rem] border p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl {t.card}"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold {t.initialsBg}"
						>
							{p.initials}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-base font-bold {t.textPrimary}">{p.name}</p>
							<p class="truncate text-sm {t.textSecondary}">{p.role}</p>
						</div>
					</div>

					<div class="mt-6 flex flex-wrap gap-2">
						{#each p.skills as skill}
							<span
								class="rounded-lg border px-3 py-1.5 text-[11px] font-bold tracking-tight {t.skillBg}"
							>
								{skill}
							</span>
						{/each}
					</div>

					<div class="mt-8 flex items-center justify-between pt-2">
						<span class="text-xs font-bold {t.textSecondary}">{p.exp}</span>
						<a
							href="/signup"
							class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all hover:bg-black/5 hover:scale-105 {t.textPrimary}"
						>
							View
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-3"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
						</a>
					</div>
				</div>
			{/each}
		</div>

		<!-- Row 2 -->
		<div class="animate-marquee-reverse gap-6 overflow-visible px-4">
			{#each cards2 as p}
                {@const t = getThemeClasses(p.theme)}
				<div
					class="group w-80 shrink-0 rounded-[2rem] border p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl {t.card}"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold {t.initialsBg}"
						>
							{p.initials}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-base font-bold {t.textPrimary}">{p.name}</p>
							<p class="truncate text-sm {t.textSecondary}">{p.role}</p>
						</div>
					</div>

					<div class="mt-6 flex flex-wrap gap-2">
						{#each p.skills as skill}
							<span
								class="rounded-lg border px-3 py-1.5 text-[11px] font-bold tracking-tight {t.skillBg}"
							>
								{skill}
							</span>
						{/each}
					</div>

					<div class="mt-8 flex items-center justify-between pt-2">
						<span class="text-xs font-bold {t.textSecondary}">{p.exp}</span>
						<a
							href="/signup"
							class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all hover:bg-black/5 hover:scale-105 {t.textPrimary}"
						>
							View
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-3"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
