<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { logout } from '$lib/services/auth';
	import { authStore } from '$lib/stores/auth';
	import { reveal } from '$lib/actions/animate';
	import AppHeader from '$lib/components/common/AppHeader.svelte';
	import Badge from '$lib/components/common/Badge.svelte';
	import LoadingState from '$lib/components/common/LoadingState.svelte';

	async function handleLogout() {
		await logout();
		authStore.clear();
		await goto('/');
	}

	let portfolioUrl: string | null = $state(null);
	let portfolioUrlLoading = $state(true);
	let totalViews: number | null = $state(null);
	let activeVersion: string | null = $state(null);
	let analyticsLoading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch('/api/portfolio/url');
			if (res.ok) {
				const data = await res.json();
				portfolioUrl = data.url ?? null;
			}
		} catch {
		} finally {
			portfolioUrlLoading = false;
		}
	});

	let analyticsFetched = false;
	$effect(() => {
		const userId = $authStore.user?.userId;
		if (!portfolioUrlLoading && portfolioUrl && userId && !analyticsFetched) {
			analyticsFetched = true;
			fetch(`/api/portfolio/${userId}/analytics`)
				.then((r) => (r.ok ? r.json() : null))
				.then((data) => {
					if (data) {
						totalViews = data.totalViews;
						if (data.byVersion) {
							const versions = Object.keys(data.byVersion).sort().reverse();
							if (versions.length > 0) activeVersion = versions[0];
						}
					}
				})
				.catch(() => {})
				.finally(() => {
					analyticsLoading = false;
				});
		} else if (!portfolioUrlLoading && !portfolioUrl) {
			analyticsLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Dashboard — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<AppHeader>
		<button
			onclick={handleLogout}
			class="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
		>
			Log Out
		</button>
	</AppHeader>

	<!-- Main content -->
	<main class="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
		<!-- Page title row -->
		<div use:reveal class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				{#if $authStore.user}
					<h1 class="font-serif text-3xl font-bold text-slate-900">
						Welcome, {$authStore.user.name.split(' ')[0]} 👋
					</h1>
				{:else}
					<h1 class="font-serif text-3xl font-bold text-slate-900">Dashboard</h1>
				{/if}
				<p class="mt-2 text-slate-500">Manage your AI-generated portfolio website.</p>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="/app/interview/setup"
					class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:text-slate-900 active:scale-95"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
					</svg>
					Practice Interview
				</a>
				<a
					href="/app/resumes/upload"
					class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					New Upload
				</a>
			</div>
		</div>

		{#if portfolioUrlLoading}
			<LoadingState message="Loading dashboard…" />
		{:else if portfolioUrl}
			<!-- Quick stats row -->
			<div use:reveal={{ delay: 50 }} class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
				{#each [{ label: 'Status', value: 'Live', valueClass: 'text-emerald-600', icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', iconColor: 'text-emerald-500' }, { label: 'Template', value: 'Clean', valueClass: 'text-slate-900', icon: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25Z', iconColor: 'text-blue-500' }, { label: 'Total Views', value: analyticsLoading ? '…' : totalViews !== null ? totalViews.toLocaleString() : '–', valueClass: 'text-slate-900', icon: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', iconColor: 'text-purple-500' }, { label: 'Last Updated', value: 'Recent', valueClass: 'text-slate-600', icon: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', iconColor: 'text-slate-400' }] as stat}
					<div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 {stat.iconColor}" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d={stat.icon} />
						</svg>
						<div class="min-w-0">
							<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">{stat.label}</p>
							<p class="mt-1 truncate text-lg font-bold {stat.valueClass}">{stat.value}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Portfolio card -->
			<div use:reveal={{ delay: 100 }} class="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
				<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div class="flex items-start gap-5">
						<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8 text-slate-900" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
							</svg>
						</div>
						<div class="min-w-0">
							<div class="flex items-center gap-3">
								<h2 class="font-serif text-2xl font-bold text-slate-900">Active Portfolio</h2>
								<div class="flex items-center gap-2">
									<Badge variant="live" pulse>Live</Badge>
									{#if activeVersion}
										<Badge variant="neutral" class="capitalize">{activeVersion}</Badge>
									{/if}
								</div>
							</div>
							<p class="mt-2 text-sm text-slate-500">Your site is up and running securely on the edge network.</p>
							<div class="mt-4 flex items-center gap-2">
								<p class="max-w-xs truncate rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 font-mono text-sm font-medium text-slate-700">{portfolioUrl}</p>
							</div>
						</div>
					</div>
					<div class="flex shrink-0 flex-col gap-3 sm:flex-row">
						{#if $authStore.user}
							<a href="/app/portfolio/{$authStore.user.userId}/analytics" class="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 sm:w-auto sm:py-2.5">Analytics</a>
							<a href="/app/portfolio/{$authStore.user.userId}/edit" class="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 sm:w-auto sm:py-2.5">Edit Content</a>
						{/if}
						<a href={portfolioUrl} target="_blank" rel="noopener noreferrer" class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95 sm:w-auto sm:py-2.5">
							Open Link
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
						</a>
					</div>
				</div>
			</div>
		{:else}
			<!-- Empty state -->
			<div use:reveal={{ delay: 100 }} class="flex flex-col items-center justify-center rounded-[2.5rem] border border-slate-200 bg-white px-8 py-24 text-center shadow-sm">
				<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-10 w-10 text-slate-400" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
					</svg>
				</div>
				<h2 class="font-serif text-3xl font-bold text-slate-900">No portfolio yet</h2>
				<p class="mt-3 max-w-md text-slate-500">Upload your resume to automatically generate a beautiful, fully-functional portfolio website in seconds.</p>
				<a href="/app/resumes/upload" class="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 active:scale-95">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
					</svg>
					Upload Resume to Start
				</a>
			</div>
		{/if}
	</main>
</div>
