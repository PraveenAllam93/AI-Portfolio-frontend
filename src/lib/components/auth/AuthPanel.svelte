<script lang="ts">
	import tplMarketing from '$lib/assets/landing/template-marketing.jpg';
	import tplDesign from '$lib/assets/landing/template-design.jpg';
	import tplEngineer from '$lib/assets/landing/template-engineer.jpg';

	interface Step {
		n: string;
		label: string;
		desc: string;
	}

	interface Props {
		/** Which story the panel tells: returning user, new user, or password reset */
		variant?: 'login' | 'signup' | 'reset';
		/** 'verify' replaces the showcase with the email-sent state */
		mode?: 'showcase' | 'verify';
		headline?: string;
		sub?: string;
		/** Numbered steps below the visual (signup) */
		steps?: Step[];
		/** Email address shown in 'verify' mode */
		email?: string;
	}

	let {
		variant = 'login',
		mode = 'showcase',
		headline = '',
		sub = '',
		steps = [],
		email = ''
	}: Props = $props();

	const loginFeatures = [
		'Your live link kept working while you were away',
		'Recruiter visits tracked on every view',
		'AI suggestions ready to apply'
	];

	// Mini analytics bars for the login visual (relative heights, %)
	const weekBars = [35, 55, 40, 70, 52, 90, 64];
</script>

<div class="relative hidden flex-col overflow-hidden bg-[#0b0b10] p-12 lg:flex lg:w-[45%]">
	<!-- Accent glows -->
	<div class="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#ff5c3a] opacity-[0.16] blur-[110px]"></div>
	<div class="pointer-events-none absolute -right-24 -bottom-40 h-96 w-96 rounded-full bg-[#7c5cff] opacity-[0.16] blur-[110px]"></div>
	<!-- Subtle grid -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.05]"
		style="background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px); background-size: 52px 52px; mask-image: radial-gradient(ellipse 80% 60% at 50% 35%, #000 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 35%, #000 30%, transparent 80%);"
	></div>

	<!-- Logo -->
	<a
		href="/"
		class="group relative z-10 inline-flex w-fit items-center gap-1.5 font-display text-2xl font-black tracking-tight text-white"
		style="letter-spacing:-0.03em"
	>
		<span class="mr-1 h-2.5 w-2.5 shrink-0 rounded-full bg-warm-coral transition-transform group-hover:scale-125"></span>
		Portfolio<span class="text-warm-coral">.ai</span>
	</a>

	{#if mode === 'verify'}
		<div class="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
			<div class="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-10 w-10 text-warm-coral">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
					/>
				</svg>
			</div>
			<p class="font-headline text-4xl font-extrabold tracking-tight text-white">Check your inbox</p>
			<p class="mt-4 text-lg leading-relaxed text-white/60">
				A 6-digit verification code<br />
				was sent to <span class="font-bold text-white">{email}</span>
			</p>
		</div>
	{:else}
		<!-- Headline -->
		<div class="relative z-10 mt-10 max-w-md">
			<h2 class="font-headline text-[2.4rem] leading-[1.08] font-extrabold tracking-tight text-white">
				{headline}
			</h2>
			<p class="mt-4 text-base leading-relaxed text-white/55">{sub}</p>
		</div>

		{#if variant === 'login'}
			<!-- Returning user: live portfolio + the activity that happened while away -->
			<div class="relative z-10 my-auto min-h-[480px] py-8" aria-hidden="true">
				<div
					class="absolute top-0 left-0 w-[78%] -rotate-2 overflow-hidden rounded-2xl border border-white/10 bg-[#16171c] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
				>
					<div class="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3.5 py-3">
						<span class="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
						<span class="h-2 w-2 rounded-full bg-[#febc2e]"></span>
						<span class="h-2 w-2 rounded-full bg-[#28c840]"></span>
						<span class="ml-2 truncate rounded bg-white/5 px-2.5 py-1 text-[11px] text-white/40">portfolio.ai/sarah-jenkins</span>
					</div>
					<img src={tplMarketing} alt="" class="h-72 w-full object-cover object-top" loading="lazy" />
				</div>

				<div
					class="absolute -top-3 left-[60%] z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold text-white backdrop-blur"
				>
					<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
					Live
				</div>

				<!-- Weekly analytics card -->
				<div
					class="absolute top-28 right-0 z-10 w-[52%] rotate-2 rounded-2xl border border-white/10 bg-[#131318] p-5 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.85)]"
				>
					<p class="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">This week</p>
					<div class="mt-2.5 flex items-baseline gap-5">
						<span><span class="font-headline text-3xl font-extrabold text-white">32</span> <span class="text-[11px] text-white/45">views</span></span>
						<span><span class="font-headline text-3xl font-extrabold text-warm-coral">4</span> <span class="text-[11px] text-white/45">recruiters</span></span>
					</div>
					<div class="mt-4 flex h-14 items-end gap-1.5">
						{#each weekBars as h, i (i)}
							<span
								class="flex-1 rounded-sm bg-gradient-to-t from-[#7c5cff] to-[#ff5c3a]"
								style="height:{h}%; opacity:{0.45 + (h / 100) * 0.55}"
							></span>
						{/each}
					</div>
				</div>

				<!-- AI suggestion card -->
				<div
					class="absolute bottom-16 left-2 z-10 w-[48%] -rotate-1 rounded-2xl border border-white/10 bg-[#131318] p-4 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.85)]"
				>
					<p class="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-[#b9a7ff] uppercase">🤖 AI suggestion</p>
					<p class="mt-2 text-xs leading-relaxed text-white/75">
						Add your Q3 ROAS metric — recruiters focus there first.
					</p>
				</div>

				<!-- Recruiter notification -->
				<div
					class="absolute bottom-0 right-0 z-20 flex items-center gap-3 rounded-xl border border-white/10 bg-black/75 px-4 py-3.5 backdrop-blur"
				>
					<span class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400"></span>
					<span class="text-xs text-white/85"><b>Recruiter from Publicis MENA</b> viewed your portfolio</span>
					<span class="text-[10px] whitespace-nowrap text-white/40">2m ago</span>
				</div>
			</div>

			<div class="relative z-10 mt-6 space-y-2.5">
				{#each loginFeatures as f (f)}
					<div class="flex items-center gap-3 text-sm text-white/70">
						<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[10px] font-bold text-emerald-400">✓</span>
						{f}
					</div>
				{/each}
			</div>
		{:else if variant === 'signup'}
			<!-- New user: plain CV transforms into a finished portfolio -->
			<div class="relative z-10 my-auto min-h-[480px] py-8" aria-hidden="true">
				<!-- The boring CV -->
				<div class="absolute top-14 left-0 w-[38%] -rotate-3 rounded-xl bg-white p-4 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.8)]">
					<p class="mb-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-500">📄 resume.pdf</p>
					<div class="mb-1.5 h-2.5 w-2/3 rounded bg-slate-400"></div>
					<div class="mb-3.5 h-1.5 w-1/2 rounded bg-slate-200"></div>
					<p class="mb-1.5 text-[8px] font-bold tracking-[0.14em] text-slate-400">EXPERIENCE</p>
					<div class="space-y-1.5">
						<div class="h-1.5 w-full rounded bg-slate-200"></div>
						<div class="h-1.5 w-5/6 rounded bg-slate-200"></div>
						<div class="h-1.5 w-full rounded bg-slate-200"></div>
						<div class="h-1.5 w-3/4 rounded bg-slate-200"></div>
					</div>
					<p class="mt-3.5 mb-1.5 text-[8px] font-bold tracking-[0.14em] text-slate-400">SKILLS</p>
					<div class="flex flex-wrap gap-1">
						<span class="h-3.5 w-12 rounded-full bg-slate-200"></span>
						<span class="h-3.5 w-9 rounded-full bg-slate-200"></span>
						<span class="h-3.5 w-14 rounded-full bg-slate-200"></span>
						<span class="h-3.5 w-10 rounded-full bg-slate-200"></span>
					</div>
				</div>

				<!-- Connector + AI spark -->
				<div class="absolute top-1/2 left-[26%] w-[34%] -translate-y-1/2 border-t border-dashed border-white/25"></div>
				<div class="absolute top-1/2 left-[35%] z-20 -translate-y-1/2">
					<span class="absolute inset-0 animate-ping rounded-full bg-[#7c5cff]/30"></span>
					<div
						class="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5c3a] to-[#7c5cff] text-xl shadow-[0_10px_34px_rgba(124,92,255,0.55)]"
					>
						✨
					</div>
				</div>

				<!-- The finished portfolio -->
				<div
					class="absolute top-0 right-0 z-10 w-[58%] rotate-2 overflow-hidden rounded-2xl border border-white/10 bg-[#16171c] shadow-[0_30px_80px_-16px_rgba(0,0,0,0.85)]"
				>
					<div class="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3.5 py-3">
						<span class="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
						<span class="h-2 w-2 rounded-full bg-[#febc2e]"></span>
						<span class="h-2 w-2 rounded-full bg-[#28c840]"></span>
						<span class="ml-2 truncate rounded bg-white/5 px-2.5 py-1 text-[11px] text-white/40">portfolio.ai/riya-mehta</span>
					</div>
					<img src={tplDesign} alt="" class="h-72 w-full object-cover object-top" loading="lazy" />
				</div>

				<!-- What the AI did -->
				<div class="absolute top-8 right-[54%] z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
					✦ Case studies written
				</div>
				<div class="absolute right-2 -bottom-1 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
					⚡ Built in 28 seconds
				</div>
				<div class="absolute bottom-14 right-[50%] z-20 rounded-full bg-[#1a5c2a] px-4 py-1.5 text-xs font-bold text-white shadow-lg">
					Portfolio Score: 87/100
				</div>
			</div>

			{#if steps.length > 0}
				<!-- Compact pipeline strip -->
				<div class="relative z-10 mt-6 flex flex-wrap items-center gap-2">
					{#each steps as s, i (s.n)}
						<span class="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white backdrop-blur">
							<span class="font-display text-[10px] font-bold text-warm-coral">{s.n}</span>
							{s.label}
						</span>
						{#if i < steps.length - 1}
							<span class="text-white/30">→</span>
						{/if}
					{/each}
				</div>
			{/if}
		{:else}
			<!-- Reset: the portfolio is safe, waiting behind the lock -->
			<div class="relative z-10 mt-10 flex min-h-[320px] flex-1 items-center justify-center" aria-hidden="true">
				<div
					class="relative w-[80%] -rotate-1 overflow-hidden rounded-2xl border border-white/10 bg-[#16171c] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
				>
					<div class="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3 py-2.5">
						<span class="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
						<span class="h-2 w-2 rounded-full bg-[#febc2e]"></span>
						<span class="h-2 w-2 rounded-full bg-[#28c840]"></span>
						<span class="ml-2 flex items-center gap-1.5 truncate rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
							<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
							portfolio.ai/omar-al-hassan
						</span>
					</div>
					<div class="relative">
						<img src={tplEngineer} alt="" class="h-64 w-full object-cover object-top" loading="lazy" />
						<div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-[3px]">
							<div class="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
							</div>
							<p class="text-sm font-bold text-white">Your portfolio is safe</p>
							<p class="text-xs text-white/55">Reset your password to get back in</p>
						</div>
					</div>
				</div>
				<div class="absolute -bottom-1 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
					<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
					Still live · still getting views
				</div>
			</div>
		{/if}
	{/if}
</div>
