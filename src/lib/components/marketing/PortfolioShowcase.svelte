<script lang="ts">
	import { reveal } from '$lib/actions/animate';

	type Portfolio = {
		name: string;
		role: string;
		skills: string[];
		exp: string;
		initials: string;
		accent: string;
		skillBg: string;
		skillText: string;
	};

	const row1: Portfolio[] = [
		{
			name: 'Alex Chen',
			role: 'Full-Stack Engineer',
			skills: ['React', 'Node.js', 'TypeScript'],
			exp: '5 yrs',
			initials: 'AC',
			accent: 'linear-gradient(135deg,#6D28D9,#A855F7)',
			skillBg: 'bg-violet-50',
			skillText: 'text-violet-700'
		},
		{
			name: 'Sarah Johnson',
			role: 'Product Designer',
			skills: ['Figma', 'UX Research', 'Prototyping'],
			exp: '4 yrs',
			initials: 'SJ',
			accent: 'linear-gradient(135deg,#EC4899,#F43F5E)',
			skillBg: 'bg-pink-50',
			skillText: 'text-pink-700'
		},
		{
			name: 'Marcus Thompson',
			role: 'Data Scientist',
			skills: ['Python', 'ML', 'TensorFlow'],
			exp: '6 yrs',
			initials: 'MT',
			accent: 'linear-gradient(135deg,#10B981,#06B6D4)',
			skillBg: 'bg-emerald-50',
			skillText: 'text-emerald-700'
		},
		{
			name: 'David Park',
			role: 'DevOps Engineer',
			skills: ['AWS', 'Docker', 'Kubernetes'],
			exp: '7 yrs',
			initials: 'DP',
			accent: 'linear-gradient(135deg,#F59E0B,#F97316)',
			skillBg: 'bg-amber-50',
			skillText: 'text-amber-700'
		},
		{
			name: 'Zoe Martinez',
			role: 'iOS Developer',
			skills: ['Swift', 'SwiftUI', 'CoreML'],
			exp: '4 yrs',
			initials: 'ZM',
			accent: 'linear-gradient(135deg,#8B5CF6,#6D28D9)',
			skillBg: 'bg-violet-50',
			skillText: 'text-violet-700'
		}
	];

	const row2: Portfolio[] = [
		{
			name: 'Priya Sharma',
			role: 'Frontend Developer',
			skills: ['Vue', 'CSS', 'WebGL'],
			exp: '3 yrs',
			initials: 'PS',
			accent: 'linear-gradient(135deg,#A855F7,#EC4899)',
			skillBg: 'bg-fuchsia-50',
			skillText: 'text-fuchsia-700'
		},
		{
			name: 'Emma Wilson',
			role: 'Content Strategist',
			skills: ['SEO', 'Copywriting', 'Analytics'],
			exp: '5 yrs',
			initials: 'EW',
			accent: 'linear-gradient(135deg,#06B6D4,#6D28D9)',
			skillBg: 'bg-cyan-50',
			skillText: 'text-cyan-700'
		},
		{
			name: 'Raj Patel',
			role: 'Mobile Developer',
			skills: ['Flutter', 'Swift', 'Kotlin'],
			exp: '4 yrs',
			initials: 'RP',
			accent: 'linear-gradient(135deg,#F43F5E,#A855F7)',
			skillBg: 'bg-rose-50',
			skillText: 'text-rose-700'
		},
		{
			name: 'Luna Garcia',
			role: 'UX Researcher',
			skills: ['User Testing', 'Research', 'Figma'],
			exp: '3 yrs',
			initials: 'LG',
			accent: 'linear-gradient(135deg,#10B981,#A855F7)',
			skillBg: 'bg-teal-50',
			skillText: 'text-teal-700'
		},
		{
			name: 'James Kim',
			role: 'Backend Engineer',
			skills: ['Go', 'PostgreSQL', 'Kafka'],
			exp: '5 yrs',
			initials: 'JK',
			accent: 'linear-gradient(135deg,#6D28D9,#10B981)',
			skillBg: 'bg-violet-50',
			skillText: 'text-violet-700'
		}
	];

	// Duplicate each row for seamless infinite loop
	const cards1 = [...row1, ...row1];
	const cards2 = [...row2, ...row2];
</script>

<section class="overflow-hidden bg-white py-20 md:py-28">
	<!-- Subtle dot grid bg -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.03]"
		style="background-image: radial-gradient(circle, #6D28D9 1px, transparent 1px); background-size: 28px 28px;"
	></div>

	<div class="relative mx-auto max-w-7xl px-6">
		<div class="text-center" use:reveal>
			<span
				class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-brand"
			>
				🌟 Community
			</span>
			<h2 class="mt-4 font-serif text-4xl font-bold text-ink md:text-5xl">
				Built by professionals, <span class="gradient-text">just like you</span>
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
				Thousands of professionals trust AIfolio to showcase their skills and land their next
				opportunity.
			</p>
		</div>
	</div>

	<!-- Marquee rows — outside max-width wrapper so they span full width -->
	<div class="relative mt-14 space-y-4" data-pause>
		<!-- Fade masks on left/right edges -->
		<div
			class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
			style="background: linear-gradient(90deg, white, transparent);"
		></div>
		<div
			class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
			style="background: linear-gradient(270deg, white, transparent);"
		></div>

		<!-- Row 1 — left scroll -->
		<div class="animate-marquee gap-4 overflow-visible px-2">
			{#each cards1 as p}
				<div
					class="mx-3 w-72 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
				>
					<!-- Accent top border -->
					<div class="h-[3px] w-full" style="background: {p.accent};"></div>
					<div class="p-5">
						<!-- Avatar + name row -->
						<div class="flex items-center gap-3">
							<div
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
								style="background: {p.accent};"
							>
								{p.initials}
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-semibold text-ink">{p.name}</p>
								<p class="truncate text-xs text-ink-soft">{p.role}</p>
							</div>
							<!-- Live indicator -->
							<div class="flex shrink-0 items-center gap-1">
								<span class="relative flex h-2 w-2">
									<span
										class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
									></span>
									<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
								</span>
								<span class="text-xs text-emerald-600 font-medium">Live</span>
							</div>
						</div>

						<!-- Skills -->
						<div class="mt-3 flex flex-wrap gap-1.5">
							{#each p.skills as skill}
								<span class="rounded-full px-2.5 py-0.5 text-xs font-medium {p.skillBg} {p.skillText}">
									{skill}
								</span>
							{/each}
						</div>

						<!-- Footer -->
						<div
							class="mt-4 flex items-center justify-between border-t border-gray-50 pt-3"
						>
							<span class="text-xs text-ink-muted">{p.exp} experience</span>
							<a
								href="/signup"
								class="text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
							>
								View Portfolio →
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Row 2 — right scroll -->
		<div class="animate-marquee-reverse gap-4 overflow-visible px-2">
			{#each cards2 as p}
				<div
					class="mx-3 w-72 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
				>
					<!-- Accent top border -->
					<div class="h-[3px] w-full" style="background: {p.accent};"></div>
					<div class="p-5">
						<!-- Avatar + name row -->
						<div class="flex items-center gap-3">
							<div
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
								style="background: {p.accent};"
							>
								{p.initials}
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-semibold text-ink">{p.name}</p>
								<p class="truncate text-xs text-ink-soft">{p.role}</p>
							</div>
							<!-- Live indicator -->
							<div class="flex shrink-0 items-center gap-1">
								<span class="relative flex h-2 w-2">
									<span
										class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
									></span>
									<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
								</span>
								<span class="text-xs text-emerald-600 font-medium">Live</span>
							</div>
						</div>

						<!-- Skills -->
						<div class="mt-3 flex flex-wrap gap-1.5">
							{#each p.skills as skill}
								<span class="rounded-full px-2.5 py-0.5 text-xs font-medium {p.skillBg} {p.skillText}">
									{skill}
								</span>
							{/each}
						</div>

						<!-- Footer -->
						<div
							class="mt-4 flex items-center justify-between border-t border-gray-50 pt-3"
						>
							<span class="text-xs text-ink-muted">{p.exp} experience</span>
							<a
								href="/signup"
								class="text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
							>
								View Portfolio →
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
