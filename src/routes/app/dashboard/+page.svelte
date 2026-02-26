<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { logout } from '$lib/services/auth';
	import { authStore } from '$lib/stores/auth';
	import { reveal } from '$lib/actions/animate';

	async function handleLogout() {
		await logout();
		authStore.clear();
		await goto('/');
	}

	// Cookie is sent automatically — no token needed in client code
	let portfolioUrl: string | null = $state(null);
	let portfolioUrlLoading = $state(true);
	let totalViews: number | null = $state(null);
	let analyticsLoading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch('/api/portfolio/url');
			if (res.ok) {
				const data = await res.json();
				portfolioUrl = data.url ?? null;
			}
		} catch {
			// Non-critical — empty state will show
		} finally {
			portfolioUrlLoading = false;
		}
	});

	// Fetch analytics summary once portfolio URL is confirmed and user is loaded
	let analyticsFetched = false;
	$effect(() => {
		const userId = $authStore.user?.userId;
		if (!portfolioUrlLoading && portfolioUrl && userId && !analyticsFetched) {
			analyticsFetched = true;
			fetch(`/api/portfolio/${userId}/analytics`)
				.then((r) => (r.ok ? r.json() : null))
				.then((data) => {
					if (data) totalViews = data.totalViews;
				})
				.catch(() => {})
				.finally(() => {
					analyticsLoading = false;
				});
		} else if (!portfolioUrlLoading && !portfolioUrl) {
			analyticsLoading = false;
		}
	});

	const userInitials = $derived(
		$authStore.user?.name
			? $authStore.user.name
					.split(' ')
					.slice(0, 2)
					.map((n) => n[0]?.toUpperCase() ?? '')
					.join('')
			: '?'
	);
</script>

<svelte:head>
	<title>Dashboard — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#F5F3FF]">
	<!-- Top bar -->
	<header class="sticky top-0 z-10 border-b border-gray-100 bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="/" class="font-serif text-xl font-bold">
				<span class="gradient-text">AI</span><span class="text-[#1E1033]">folio</span>
			</a>
			<div class="flex items-center gap-4">
				{#if $authStore.user}
					<div class="flex items-center gap-3">
						<div class="gradient-bg flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm">
							{userInitials}
						</div>
						<span class="hidden text-sm font-medium text-[#1E1033] sm:block">
							{$authStore.user.name}
						</span>
					</div>
				{/if}
				<button
					onclick={handleLogout}
					class="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-[#4B5563] transition-colors hover:border-gray-400 hover:text-[#1E1033]"
				>
					Log Out
				</button>
			</div>
		</div>
	</header>

	<!-- Main content -->
	<main class="mx-auto w-full max-w-7xl flex-1 px-6 py-10">

		<!-- Page title row -->
		<div use:reveal class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				{#if $authStore.user}
					<h1 class="font-serif text-3xl font-bold text-[#1E1033]">
						Welcome back, {$authStore.user.name.split(' ')[0]} 👋
					</h1>
				{:else}
					<h1 class="font-serif text-3xl font-bold text-[#1E1033]">Dashboard</h1>
				{/if}
				<p class="mt-1 text-[#4B5563]">Manage your AI-generated portfolio website.</p>
			</div>
			<a
				href="/app/resumes/upload"
				class="gradient-bg inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				Upload Resume
			</a>
		</div>

		{#if portfolioUrlLoading}
			<!-- Loading portfolio URL -->
			<div class="flex items-center gap-2 py-8 text-sm text-[#4B5563]">
				<svg class="h-4 w-4 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
				</svg>
				Loading your portfolio…
			</div>
		{:else if portfolioUrl}
			<!-- ── Portfolio exists ─────────────────────────────────────────────── -->

			<!-- Quick stats row -->
			<div use:reveal={{ delay: 60 }} class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				{#each [
					{ label: 'Status', value: 'Live', valueClass: 'text-emerald-600', icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
					{ label: 'Template', value: 'Minimal', valueClass: 'text-[#1E1033]', icon: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
					{ label: 'Portfolio Views', value: analyticsLoading ? '…' : (totalViews !== null ? totalViews.toLocaleString() : '–'), valueClass: 'text-[#1E1033]', icon: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
					{ label: 'Last Updated', value: 'Just now', valueClass: 'text-[#4B5563]', icon: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' }
				] as stat}
					<div class="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {stat.iconBg}">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 {stat.iconColor}">
								{#each stat.icon.split(' M ').filter(Boolean) as _, i}
									{#if i === 0}
										<path stroke-linecap="round" stroke-linejoin="round" d={stat.icon.split(' M ')[0]} />
									{:else}
										<path stroke-linecap="round" stroke-linejoin="round" d={'M ' + stat.icon.split(' M ')[i]} />
									{/if}
								{/each}
							</svg>
						</div>
						<div class="min-w-0">
							<p class="text-xs text-[#4B5563]">{stat.label}</p>
							<p class="mt-0.5 truncate text-sm font-semibold {stat.valueClass}">{stat.value}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Portfolio card -->
			<div use:reveal={{ delay: 140 }} class="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
				<div class="gradient-bg h-1.5 w-full"></div>
				<div class="p-6">
					<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex items-center gap-4">
							<div class="gradient-bg flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-sm">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-7 w-7 text-white">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
								</svg>
							</div>
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<h2 class="font-serif text-lg font-bold text-[#1E1033]">My Portfolio</h2>
									<span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">● Live</span>
								</div>
								<p class="mt-0.5 text-sm text-[#4B5563]">Your portfolio is live and ready to share.</p>
								<p class="mt-1.5 max-w-xs truncate rounded-lg bg-gray-50 px-2.5 py-1 font-mono text-xs text-[#4B5563]">
									{portfolioUrl}
								</p>
							</div>
						</div>
						<div class="flex shrink-0 flex-wrap gap-3">
							<a
								href="/app/resumes/upload"
								class="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-[#4B5563] transition-colors hover:border-gray-400 hover:text-[#1E1033]"
							>
								Update Resume
							</a>
							{#if $authStore.user}
								<a
									href="/app/portfolio/{$authStore.user.userId}/edit"
									class="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100"
								>
									Edit Content
								</a>
								<a
									href="/app/portfolio/{$authStore.user.userId}/analytics"
									class="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
								>
									Analytics
								</a>
							{/if}
							<a
								href={portfolioUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="gradient-bg flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
								</svg>
								View Portfolio
							</a>
						</div>
					</div>
				</div>
			</div>

		{:else}
			<!-- ── Empty state ─────────────────────────────────────────────────────── -->
			<div use:reveal={{ delay: 100 }}>
				<!-- Hero empty card -->
				<div class="flex flex-col items-center rounded-2xl bg-white px-8 py-14 text-center shadow-md ring-1 ring-black/5">
					<div class="gradient-bg flex h-16 w-16 items-center justify-center rounded-2xl shadow-md">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8 text-white">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
						</svg>
					</div>
					<h2 class="mt-5 font-serif text-2xl font-bold text-[#1E1033]">No portfolio yet</h2>
					<p class="mt-2 max-w-sm text-sm text-[#4B5563]">
						Upload your resume and we'll generate a beautiful, shareable portfolio website — automatically.
					</p>
					<a
						href="/app/resumes/upload"
						class="gradient-bg mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						Get Started — Upload Resume
					</a>
				</div>

				<!-- How it works steps -->
				<div class="mt-8">
					<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[#4B5563]">How it works</h3>
					<div class="grid gap-4 sm:grid-cols-3">
						{#each [
							{ step: '1', title: 'Upload Resume', desc: 'Drag & drop your PDF or Word file. We parse it instantly.', icon: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5', bg: 'bg-violet-100', color: 'text-violet-600' },
							{ step: '2', title: 'Pick Role & Template', desc: 'Choose your profession and a design template that fits you.', icon: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z', bg: 'bg-fuchsia-100', color: 'text-fuchsia-600' },
							{ step: '3', title: 'Go Live', desc: 'We generate and host your portfolio with a unique public URL.', icon: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253', bg: 'bg-emerald-100', color: 'text-emerald-600' }
						] as item, i}
							<div
								class="relative flex gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
								use:reveal={{ delay: 80 + i * 80 }}
							>
								<!-- Step number badge -->
								<div class="absolute -top-3 -left-2 flex h-6 w-6 items-center justify-center rounded-full gradient-bg text-xs font-bold text-white shadow-sm">
									{item.step}
								</div>
								<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {item.bg}">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 {item.color}">
										<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
									</svg>
								</div>
								<div>
									<p class="text-sm font-semibold text-[#1E1033]">{item.title}</p>
									<p class="mt-0.5 text-xs text-[#4B5563]">{item.desc}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
