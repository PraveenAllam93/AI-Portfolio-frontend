<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { logout } from '$lib/services/auth';
	import { authStore } from '$lib/stores/auth';
	import { reveal } from '$lib/actions/animate';
	import AppHeader from '$lib/components/common/AppHeader.svelte';
	import Badge from '$lib/components/common/Badge.svelte';
	import LoadingState from '$lib/components/common/LoadingState.svelte';
	import ShareMenu from '$lib/components/portfolio/ShareMenu.svelte';
	import {
		listPortfolios,
		togglePortfolioLive,
		deletePortfolio,
		type PortfolioSummary
	} from '$lib/services/portfolio';

	async function handleLogout() {
		await logout();
		authStore.clear();
		await goto('/');
	}

	let portfolios: PortfolioSummary[] = $state([]);
	let loading = $state(true);
	let deleteConfirmId: string | null = $state(null);
	let deletingId: string | null = $state(null);
	let togglingId: string | null = $state(null);
	let errorMsg: string | null = $state(null);

	onMount(async () => {
		try {
			const userId = $authStore.user?.userId;
			if (!userId) return;
			const result = await listPortfolios(userId);
			if (result.ok && result.data?.portfolios) {
				portfolios = [...result.data.portfolios].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			}
		} catch {
			// leave portfolios as []
		} finally {
			loading = false;
		}
	});

	async function handleToggleLive(portfolio: PortfolioSummary) {
		const userId = $authStore.user?.userId;
		if (!userId || togglingId) return;
		togglingId = portfolio.uploadId;
		const result = await togglePortfolioLive(userId, portfolio.uploadId, !portfolio.isLive);
		if (result.ok) {
			portfolios = portfolios.map((p) =>
				p.uploadId === portfolio.uploadId ? { ...p, isLive: !p.isLive } : p
			);
		} else {
			errorMsg = result.error ?? 'Failed to update live status';
		}
		togglingId = null;
	}

	async function handleDelete(uploadId: string) {
		const userId = $authStore.user?.userId;
		if (!userId) return;
		deletingId = uploadId;
		deleteConfirmId = null;
		const result = await deletePortfolio(userId, uploadId);
		if (result.ok) {
			portfolios = portfolios.filter((p) => p.uploadId !== uploadId);
		} else {
			errorMsg = result.error ?? 'Failed to delete portfolio';
		}
		deletingId = null;
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function templateLabel(id: string | undefined) {
		if (!id) return 'Default';
		return id
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

<svelte:head>
	<title>Dashboard — Portfolio.ai</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<AppHeader>
		<div class="flex items-center gap-4">
			<a
				href="/app/settings"
				class="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
			>
				Settings
			</a>
			<button
				onclick={handleLogout}
				class="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
			>
				Log Out
			</button>
		</div>
	</AppHeader>

	<main class="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
		<!-- Page title row -->
		<div use:reveal class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				{#if $authStore.user}
					<h1 class="font-display text-3xl font-bold text-ink" style="letter-spacing:-0.02em">
						Welcome, {$authStore.user.name.split(' ')[0]} 👋
					</h1>
				{:else}
					<h1 class="font-display text-3xl font-bold text-ink" style="letter-spacing:-0.02em">Dashboard</h1>
				{/if}
				<p class="mt-2 text-ink-soft">Manage your AI-generated portfolio websites.</p>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="/app/interview/history"
					class="inline-flex items-center gap-2 rounded-full border border-surface-muted bg-white px-5 py-3 text-sm font-bold text-ink-soft shadow-sm transition-all hover:border-brand/40 hover:text-ink active:scale-95"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
					</svg>
					Interview History
				</a>
				<a
					href="/app/interview/setup"
					class="inline-flex items-center gap-2 rounded-full border border-surface-muted bg-white px-5 py-3 text-sm font-bold text-ink-soft shadow-sm transition-all hover:border-brand/40 hover:text-ink active:scale-95"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
					</svg>
					Practice Interview
				</a>
				<a
					href="/app/resumes/upload"
					class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-dark active:scale-95"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					New Upload
				</a>
			</div>
		</div>

		{#if errorMsg}
			<div class="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
				<span>{errorMsg}</span>
				<button onclick={() => (errorMsg = null)} class="ml-4 text-red-400 hover:text-red-600" aria-label="Dismiss">✕</button>
			</div>
		{/if}

		{#if loading}
			<LoadingState message="Loading portfolios…" />
		{:else if portfolios.length === 0}
			<!-- Empty state -->
			<div use:reveal={{ delay: 100 }} class="flex flex-col items-center justify-center rounded-[2.5rem] border border-surface-muted bg-white px-8 py-24 text-center shadow-sm">
				<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-surface-muted bg-surface-subtle">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-10 w-10 text-ink-muted" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
					</svg>
				</div>
				<h2 class="font-display text-3xl font-bold text-ink" style="letter-spacing:-0.02em">No portfolios yet</h2>
				<p class="mt-3 max-w-md text-ink-soft">Upload your resume to automatically generate a beautiful, fully-functional portfolio website in seconds.</p>
				<a href="/app/resumes/upload" class="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-brand-dark active:scale-95">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
					</svg>
					Upload Resume to Start
				</a>
			</div>
		{:else}
			<!-- Portfolio cards -->
			<div class="flex flex-col gap-5">
				{#each portfolios as portfolio, i (portfolio.uploadId)}
					<div use:reveal={{ delay: i * 60 }} class="overflow-hidden rounded-3xl border border-surface-muted bg-white shadow-sm">
						<!-- Card header -->
						<div class="flex flex-col gap-4 px-6 pt-6 pb-4 sm:flex-row sm:items-start sm:justify-between">
							<div class="flex items-start gap-4">
								<!-- Icon -->
								<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-surface-muted bg-surface-subtle shadow-inner">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-7 w-7 text-brand" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
									</svg>
								</div>
								<!-- Title + badges -->
								<div class="min-w-0">
									<div class="flex flex-wrap items-center gap-2">
										<h2 class="font-display text-xl font-bold text-ink" style="letter-spacing:-0.01em">
											{templateLabel(portfolio.templateId)}
										</h2>
										{#if portfolio.isLive}
											<Badge variant="live" pulse>Live</Badge>
										{:else}
											<Badge variant="neutral">Offline</Badge>
										{/if}
										{#if portfolio.activeVersion}
											<Badge variant="neutral" class="capitalize">{portfolio.activeVersion}</Badge>
										{/if}
									</div>
									<p class="mt-1 text-sm text-ink-muted">Created {formatDate(portfolio.createdAt)}</p>
									{#if portfolio.portfolioUrl}
										<a
											href={portfolio.portfolioUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="mt-2 inline-flex max-w-xs items-center gap-1.5 truncate rounded-lg border border-surface-muted bg-surface-subtle px-3 py-1.5 font-mono text-xs font-medium text-ink-soft transition-colors hover:text-brand"
										>
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3 w-3 shrink-0" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
											<span class="truncate">{portfolio.portfolioUrl.replace(/^https?:\/\//, '')}</span>
										</a>
									{/if}
								</div>
							</div>

							<!-- Live toggle -->
							{#if $authStore.user}
								<div class="flex shrink-0 items-center gap-2 sm:mt-1">
									<span class="text-xs font-medium text-ink-muted">Live</span>
									<button
										onclick={() => handleToggleLive(portfolio)}
										disabled={togglingId === portfolio.uploadId}
										class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 {portfolio.isLive ? 'bg-emerald-500' : 'bg-surface-muted'}"
										role="switch"
										aria-checked={portfolio.isLive}
										aria-label="Toggle live"
									>
										<span
											class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform {portfolio.isLive ? 'translate-x-5' : 'translate-x-0.5'}"
										></span>
									</button>
								</div>
							{/if}
						</div>

						<!-- Card actions -->
						{#if $authStore.user}
							<div class="flex flex-wrap items-center gap-2 border-t border-surface-muted px-6 py-4">
								<a
									href="/app/portfolio/{$authStore.user.userId}/{portfolio.uploadId}/edit"
									class="inline-flex items-center gap-1.5 rounded-full border border-surface-muted bg-white px-4 py-2 text-sm font-bold text-ink-soft transition-all hover:bg-surface-subtle hover:text-ink"
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
									Edit
								</a>
								<a
									href="/app/portfolio/{$authStore.user.userId}/{portfolio.uploadId}/analytics"
									class="inline-flex items-center gap-1.5 rounded-full border border-surface-muted bg-white px-4 py-2 text-sm font-bold text-ink-soft transition-all hover:bg-surface-subtle hover:text-ink"
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
									Analytics
								</a>
								<a
									href="/app/portfolio/{$authStore.user.userId}/{portfolio.uploadId}/versions"
									class="inline-flex items-center gap-1.5 rounded-full border border-surface-muted bg-white px-4 py-2 text-sm font-bold text-ink-soft transition-all hover:bg-surface-subtle hover:text-ink"
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
									Versions
								</a>
								{#if portfolio.portfolioUrl}
									<!-- Sharing is offered only when the portfolio is actually reachable:
									     an offline portfolio 403s at the edge, so a shared link would be dead. -->
									{#if portfolio.isLive}
										<ShareMenu
											url={portfolio.portfolioUrl}
											title="{$authStore.user?.name ?? 'My'} — Portfolio"
											text="Check out my portfolio"
											align="left"
											compact
										/>
									{/if}
									<a
										href={portfolio.portfolioUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white transition-all hover:bg-brand-dark active:scale-95"
									>
										Open
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
									</a>
								{/if}

								<!-- Delete -->
								<div class="ml-auto flex items-center">
									{#if deleteConfirmId === portfolio.uploadId}
										<div class="flex items-center gap-2">
											<span class="text-xs text-ink-soft">Delete this portfolio?</span>
											<button
												onclick={() => handleDelete(portfolio.uploadId)}
												disabled={deletingId === portfolio.uploadId}
												class="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
											>
												{deletingId === portfolio.uploadId ? 'Deleting…' : 'Yes, Delete'}
											</button>
											<button
												onclick={() => (deleteConfirmId = null)}
												class="rounded-full border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface-subtle"
											>
												Cancel
											</button>
										</div>
									{:else}
										<button
											onclick={() => (deleteConfirmId = portfolio.uploadId)}
											class="inline-flex items-center gap-1.5 rounded-full border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-muted transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
										>
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
											Delete
										</button>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>
