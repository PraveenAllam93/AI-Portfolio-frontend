<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import BreadcrumbHeader from '$lib/components/common/BreadcrumbHeader.svelte';
	import LoadingState from '$lib/components/common/LoadingState.svelte';
	import { listVersions, activateVersion, deleteVersion } from '$lib/services/portfolio';
	import type { PortfolioVersion } from '$lib/services/portfolio';

	const userId = $page.params.userId;

	let versions = $state<PortfolioVersion[]>([]);
	let activeVersion = $state<string | null>(null);
	let loading = $state(true);
	let errorMsg = $state('');

	// Per-version loading states
	let activating = $state<Record<string, boolean>>({});
	let deleting = $state<Record<string, boolean>>({});
	let confirmDelete = $state<string | null>(null);
	let toastMsg = $state('');
	let toastOk = $state(true);

	onMount(async () => {
		await load();
	});

	async function load() {
		loading = true;
		errorMsg = '';
		const result = await listVersions(userId);
		if (result.ok && result.data) {
			versions = result.data.versions;
			activeVersion = result.data.activeVersion;
		} else {
			errorMsg = result.error ?? 'Failed to load versions.';
		}
		loading = false;
	}

	function showToast(msg: string, ok = true) {
		toastMsg = msg;
		toastOk = ok;
		setTimeout(() => (toastMsg = ''), 3500);
	}

	async function handleActivate(versionId: string) {
		activating = { ...activating, [versionId]: true };
		const result = await activateVersion(userId, versionId);
		activating = { ...activating, [versionId]: false };
		if (result.ok) {
			activeVersion = versionId;
			versions = versions.map((v) => ({ ...v, isActive: v.versionId === versionId }));
			showToast(`${versionId} is now your live portfolio.`, true);
		} else {
			showToast(result.error ?? 'Could not activate version.', false);
		}
	}

	async function handleDelete(versionId: string) {
		confirmDelete = null;
		deleting = { ...deleting, [versionId]: true };
		const result = await deleteVersion(userId, versionId);
		deleting = { ...deleting, [versionId]: false };
		if (result.ok) {
			versions = versions.filter((v) => v.versionId !== versionId);
			showToast(`${versionId} deleted.`, true);
		} else {
			showToast(result.error ?? 'Could not delete version.', false);
		}
	}

	function formatDate(iso: string) {
		try {
			return new Date(iso).toLocaleDateString('en-US', {
				month: 'short', day: 'numeric', year: 'numeric',
				hour: '2-digit', minute: '2-digit'
			});
		} catch { return iso; }
	}

	const TEMPLATE_LABELS: Record<string, string> = {
		nebula: 'Nebula', galaxy: 'Galaxy', codex: 'Codex', neon: 'Neon',
		circuit: 'Circuit', 'navy-gold': 'Navy Gold', cosmos: 'Cosmos',
		retro: 'Retro', luxe: 'Luxe', aurora: 'Aurora', quantum: 'Quantum',
		minimal: 'Minimal', modern: 'Modern', bold: 'Bold', creative: 'Creative',
		aurora2: 'Aurora', luxury: 'Luxury', executive: 'Executive',
	};
</script>

<svelte:head>
	<title>Portfolio Versions — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<BreadcrumbHeader title="Versions" />

	<main class="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
		<!-- Header row -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="font-display text-2xl font-bold text-ink" style="letter-spacing:-0.02em">
					Portfolio Versions
				</h1>
				<p class="mt-1 text-sm text-ink-soft">
					Each time you upload a resume, a new version is created. Set one as your live site.
				</p>
			</div>
			<a
				href="/app/resumes/upload"
				class="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				New Version
			</a>
		</div>

		{#if loading}
			<LoadingState message="Loading versions…" />

		{:else if errorMsg}
			<div class="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
				{errorMsg}
			</div>

		{:else if versions.length === 0}
			<div class="flex flex-col items-center rounded-3xl border border-surface-muted bg-white px-8 py-20 text-center shadow-sm">
				<div class="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-muted bg-surface-subtle">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8 text-ink-muted">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
					</svg>
				</div>
				<h2 class="font-display text-xl font-bold text-ink">No versions yet</h2>
				<p class="mt-2 max-w-xs text-sm text-ink-soft">Upload your resume to generate your first portfolio version.</p>
				<a href="/app/resumes/upload" class="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-dark active:scale-95">
					Upload Resume
				</a>
			</div>

		{:else}
			<div class="space-y-4">
				{#each versions as v (v.versionId)}
					<div
						in:fly={{ y: 8, duration: 280, easing: cubicOut }}
						class="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md
							{v.isActive ? 'border-brand/30' : 'border-surface-muted'}"
					>
						<!-- Active indicator bar -->
						{#if v.isActive}
							<div class="h-1 w-full bg-brand"></div>
						{/if}

						<div class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
							<!-- Left: version info -->
							<div class="flex items-start gap-4">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-bold
										{v.isActive ? 'border-brand/20 bg-brand/5 text-brand' : 'border-surface-muted bg-surface-subtle text-ink-muted'}"
								>
									{v.versionId}
								</div>
								<div>
									<div class="flex items-center gap-2">
										<span class="font-bold text-ink">{TEMPLATE_LABELS[v.templateId] ?? v.templateId} template</span>
										{#if v.isActive}
											<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
												<span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
												Live
											</span>
										{/if}
									</div>
									<p class="mt-0.5 text-xs text-ink-muted">Created {formatDate(v.createdAt)}</p>
									{#if v.portfolioUrl}
										<a
											href={v.portfolioUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
										>
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3 w-3">
												<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
											</svg>
											Preview
										</a>
									{/if}
								</div>
							</div>

							<!-- Right: actions -->
							<div class="flex shrink-0 items-center gap-2">
								{#if !v.isActive}
									<button
										onclick={() => handleActivate(v.versionId)}
										disabled={activating[v.versionId]}
										class="rounded-xl border border-brand/30 bg-brand/5 px-4 py-2 text-xs font-bold text-brand transition-all hover:bg-brand/10 active:scale-95 disabled:opacity-50"
									>
										{activating[v.versionId] ? 'Activating…' : 'Set as Main'}
									</button>
								{/if}

								{#if confirmDelete === v.versionId}
									<div in:fade={{ duration: 150 }} class="flex items-center gap-2">
										<span class="text-xs text-ink-soft">Are you sure?</span>
										<button
											onclick={() => handleDelete(v.versionId)}
											disabled={deleting[v.versionId]}
											class="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
										>
											{deleting[v.versionId] ? 'Deleting…' : 'Delete'}
										</button>
										<button
											onclick={() => (confirmDelete = null)}
											class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted"
										>
											Keep
										</button>
									</div>
								{:else}
									<button
										onclick={() => (confirmDelete = v.versionId)}
										disabled={v.isActive || deleting[v.versionId]}
										title={v.isActive ? 'Cannot delete the active version' : 'Delete this version'}
										class="rounded-xl border border-surface-muted p-2 text-ink-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
									>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
											<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
										</svg>
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<p class="mt-6 text-center text-xs text-ink-muted">
				{versions.length} version{versions.length === 1 ? '' : 's'} · The active version is your public portfolio URL.
			</p>
		{/if}
	</main>
</div>

<!-- Toast -->
{#if toastMsg}
	<div
		in:fly={{ y: 16, duration: 250 }}
		out:fade={{ duration: 200 }}
		class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-xl
			{toastOk ? 'bg-emerald-600' : 'bg-red-500'}"
	>
		{toastMsg}
	</div>
{/if}
