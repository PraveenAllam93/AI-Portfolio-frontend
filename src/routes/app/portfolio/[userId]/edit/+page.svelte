<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import {
		getPortfolioContent,
		savePortfolioContent,
		getAiEnhancement
	} from '$lib/services/portfolio';
	import { reveal } from '$lib/actions/animate';
	import type { EditableField } from '$lib/types/portfolio';

	// $page.params are string | undefined at the TypeScript level; the route
	// guarantees userId is always present at runtime.
	const userId: string = $derived($page.params.userId ?? '');

	// Ownership guard
	$effect(() => {
		const authUser = $authStore.user;
		if (!$authStore.loading && authUser && authUser.userId !== userId) {
			goto('/app/dashboard');
		}
	});

	// ── Field metadata ─────────────────────────────────────────────────────────
	const FIELDS: Array<{
		key: EditableField;
		label: string;
		hint: string;
		limit: number;
		multiline: boolean;
	}> = [
		{
			key: 'headline',
			label: 'Professional Headline',
			hint: 'e.g. "Full-Stack Engineer · React · Node.js"',
			limit: 150,
			multiline: false
		},
		{
			key: 'bio',
			label: 'About / Bio',
			hint: 'A short paragraph introducing who you are and what you do.',
			limit: 600,
			multiline: true
		},
		{
			key: 'uniqueValue',
			label: 'Unique Value Proposition',
			hint: 'What sets you apart from others in your field?',
			limit: 400,
			multiline: true
		}
	];

	// ── Per-field state ────────────────────────────────────────────────────────
	interface FieldData {
		value: string;
		original: string;
		status: 'idle' | 'saving' | 'saved' | 'error';
		errorMsg: string;
		aiLoading: boolean;
		aiInstruction: string;
		aiError: string;
		aiSuggestion: string | null;
		showAiPanel: boolean;
	}

	function emptyField(): FieldData {
		return {
			value: '',
			original: '',
			status: 'idle',
			errorMsg: '',
			aiLoading: false,
			aiInstruction: '',
			aiError: '',
			aiSuggestion: null,
			showAiPanel: false
		};
	}

	let fields: Record<EditableField, FieldData> = $state({
		headline: emptyField(),
		bio: emptyField(),
		uniqueValue: emptyField()
	});

	const isDirty = $derived(
		(Object.keys(fields) as EditableField[]).some((k) => fields[k].value !== fields[k].original)
	);
	const isSavingAny = $derived(
		(Object.keys(fields) as EditableField[]).some((k) => fields[k].status === 'saving')
	);

	// ── Initial load ───────────────────────────────────────────────────────────
	let pageLoading = $state(true);
	let pageError = $state('');

	onMount(async () => {
		const result = await getPortfolioContent(userId);
		pageLoading = false;
		if (result.ok && result.data) {
			const { bio, headline, uniqueValue } = result.data;
			fields.headline.value = headline;
			fields.headline.original = headline;
			fields.bio.value = bio;
			fields.bio.original = bio;
			fields.uniqueValue.value = uniqueValue;
			fields.uniqueValue.original = uniqueValue;
		} else {
			// Non-blocking — user can still type from scratch
			pageError = 'Could not load existing content. You can still edit and save below.';
		}
	});

	// ── Save a single field ────────────────────────────────────────────────────
	async function saveField(key: EditableField) {
		const f = fields[key];
		if (f.value === f.original || f.status === 'saving') return;

		fields[key].status = 'saving';
		fields[key].errorMsg = '';

		const result = await savePortfolioContent(userId, key, f.value);
		if (result.ok) {
			fields[key].original = f.value;
			fields[key].status = 'saved';
			setTimeout(() => {
				fields[key].status = 'idle';
			}, 2500);
		} else {
			fields[key].status = 'error';
			fields[key].errorMsg = result.error ?? 'Save failed. Please try again.';
		}
	}

	// ── Save all dirty fields ──────────────────────────────────────────────────
	async function saveAll() {
		const dirty = (Object.keys(fields) as EditableField[]).filter(
			(k) => fields[k].value !== fields[k].original && fields[k].status !== 'saving'
		);
		await Promise.all(dirty.map((k) => saveField(k)));
	}

	// ── AI enhancement ─────────────────────────────────────────────────────────
	async function enhanceField(key: EditableField) {
		const f = fields[key];
		if (!f.aiInstruction.trim() || f.aiLoading) return;

		fields[key].aiLoading = true;
		fields[key].aiSuggestion = null;
		fields[key].aiError = '';

		const result = await getAiEnhancement(userId, key, f.aiInstruction, f.value);
		fields[key].aiLoading = false;

		if (result.ok && result.data) {
			fields[key].aiSuggestion = result.data.suggestion;
		} else {
			fields[key].aiError = result.error ?? 'Enhancement failed. Please try again.';
		}
	}

	function acceptSuggestion(key: EditableField) {
		const suggestion = fields[key].aiSuggestion;
		if (!suggestion) return;
		fields[key].value = suggestion;
		fields[key].aiSuggestion = null;
		fields[key].showAiPanel = false;
		fields[key].aiInstruction = '';
		fields[key].aiError = '';
	}

	function dismissPanel(key: EditableField) {
		fields[key].showAiPanel = false;
		fields[key].aiSuggestion = null;
		fields[key].aiInstruction = '';
		fields[key].aiError = '';
	}
</script>

<svelte:head>
	<title>Edit Portfolio — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#fafafa]">
	<!-- Header -->
	<header class="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="/" class="flex items-center gap-2 font-bold text-xl text-slate-900">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md">
                    <span class="text-xs font-black">AI</span>
                </div>
                folio
			</a>
			{#if $authStore.user}
				<div class="flex items-center gap-3">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 shadow-sm"
					>
						{$authStore.user.name
							.split(' ')
							.slice(0, 2)
							.map((n) => n[0]?.toUpperCase() ?? '')
							.join('')}
					</div>
					<span class="hidden text-sm font-medium text-slate-700 sm:block">
						{$authStore.user.name}
					</span>
				</div>
			{/if}
		</div>
	</header>

	<main class="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
		<!-- Page title -->
		<div use:reveal class="mb-10">
			<a
				href="/app/dashboard"
				class="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
				Back to Dashboard
			</a>
			<h1 class="font-serif text-4xl font-bold text-slate-900">Edit Content</h1>
			<p class="mt-2 text-lg text-slate-500">
				Update your bio, headline, and unique value proposition. Use AI to refine your copy.
			</p>
		</div>

		{#if pageLoading}
			<div class="flex flex-col items-center justify-center py-20 text-sm text-slate-500">
				<svg class="h-8 w-8 animate-spin text-slate-300" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				<span class="mt-4 font-bold text-slate-400">Loading your portfolio content…</span>
			</div>
		{:else}
			<!-- Non-blocking load warning -->
			{#if pageError}
				<div class="mb-8 rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
					<p class="text-sm font-medium text-amber-800">{pageError}</p>
				</div>
			{/if}

			<!-- Unsaved changes banner -->
			{#if isDirty}
				<div
					class="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-900 px-6 py-4 shadow-xl"
				>
					<p class="text-sm font-bold text-white">You have unsaved changes.</p>
					<button
						onclick={saveAll}
						disabled={isSavingAny}
						class="w-full sm:w-auto rounded-xl bg-white px-5 py-2 text-sm font-bold text-slate-900 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
					>
						{isSavingAny ? 'Saving…' : 'Save All Changes'}
					</button>
				</div>
			{/if}

			<!-- Fields -->
			<div class="space-y-8">
				{#each FIELDS as { key, label, hint, limit, multiline }}
					{@const f = fields[key]}
					<div
						use:reveal
						class="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200"
					>
						<!-- Top accent bar when dirty -->
						{#if f.value !== f.original}
							<div class="h-1.5 w-full bg-amber-400"></div>
						{:else if f.status === 'saved'}
							<div class="h-1.5 w-full bg-emerald-400"></div>
						{:else}
							<div class="h-1.5 w-full bg-slate-100"></div>
						{/if}

						<div class="p-8">
							<!-- Label row -->
							<div class="mb-4 flex items-center justify-between">
								<label for="field-{key}" class="font-serif text-xl font-bold text-slate-900">{label}</label>
								<span class="text-xs font-bold {f.value.length > limit ? 'text-red-500' : 'text-slate-400'}">
									{f.value.length}/{limit}
								</span>
							</div>

							<!-- Input or Textarea -->
							{#if multiline}
								<textarea
									id="field-{key}"
									rows="5"
									maxlength={limit}
									placeholder={hint}
									value={f.value}
									oninput={(e) => {
										fields[key].value = (e.currentTarget as HTMLTextAreaElement).value;
									}}
									class="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:outline-none"
								></textarea>
							{:else}
								<input
									id="field-{key}"
									type="text"
									maxlength={limit}
									placeholder={hint}
									value={f.value}
									oninput={(e) => {
										fields[key].value = (e.currentTarget as HTMLInputElement).value;
									}}
									class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:outline-none"
								/>
							{/if}

							<!-- Action row -->
							<div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
								<!-- AI panel toggle -->
								<button
									onclick={() => {
										fields[key].showAiPanel = !f.showAiPanel;
										if (!f.showAiPanel) {
											fields[key].aiSuggestion = null;
											fields[key].aiInstruction = '';
											fields[key].aiError = '';
										}
									}}
									class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="h-4 w-4"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
										/>
									</svg>
									Enhance with AI
								</button>

								<!-- Save button -->
								<button
									onclick={() => saveField(key)}
									disabled={f.value === f.original || f.status === 'saving'}
									class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2 text-sm font-bold transition-all disabled:opacity-50 disabled:hover:scale-100
										{f.status === 'saved'
										? 'bg-emerald-100 text-emerald-700'
										: f.status === 'error'
											? 'bg-red-100 text-red-700'
											: 'bg-slate-900 text-white shadow-md hover:bg-slate-800 active:scale-95'}"
								>
									{#if f.status === 'saving'}
										<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
											></path>
										</svg>
										Saving…
									{:else if f.status === 'saved'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2.5"
											stroke="currentColor"
											class="h-4 w-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m4.5 12.75 6 6 9-13.5"
											/>
										</svg>
										Saved
									{:else if f.status === 'error'}
										Error — Retry
									{:else}
										Save changes
									{/if}
								</button>
							</div>

							<!-- Per-field error -->
							{#if f.status === 'error' && f.errorMsg}
								<p class="mt-3 text-sm font-medium text-red-600">{f.errorMsg}</p>
							{/if}

							<!-- AI Panel -->
							{#if f.showAiPanel}
								<div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
									<p class="mb-3 font-serif text-lg font-bold text-slate-900">
										How should AI improve this?
									</p>
									<textarea
										rows="2"
										maxlength="300"
										placeholder="e.g. Make it more confident and concise, highlight impact over responsibilities."
										value={f.aiInstruction}
										oninput={(e) => {
											fields[key].aiInstruction = (e.currentTarget as HTMLTextAreaElement).value;
										}}
										class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 focus:outline-none"
									></textarea>
									<div class="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
										<span class="text-xs font-bold text-slate-400">{f.aiInstruction.length}/300</span>
										<div class="flex gap-3">
											<button
												onclick={() => dismissPanel(key)}
												class="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
											>
												Cancel
											</button>
											<button
												onclick={() => enhanceField(key)}
												disabled={!f.aiInstruction.trim() || f.aiLoading}
												class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
											>
												{#if f.aiLoading}
													<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
														<circle
															class="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															stroke-width="4"
														></circle>
														<path
															class="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
														></path>
													</svg>
													Generating…
												{:else}
													Generate
												{/if}
											</button>
										</div>
									</div>

									<!-- AI error -->
									{#if f.aiError}
										<p class="mt-3 text-sm font-medium text-red-600">{f.aiError}</p>
									{/if}

									<!-- Suggestion comparison -->
									{#if f.aiSuggestion}
										<div class="mt-6 space-y-4 border-t border-slate-200 pt-6">
											<div>
												<p
													class="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase"
												>
													Current
												</p>
												<p
													class="rounded-xl bg-white px-4 py-3 text-sm text-slate-500 border border-slate-200"
												>
													{f.value || '(empty)'}
												</p>
											</div>
											<div>
												<p
													class="mb-2 text-xs font-bold tracking-widest text-slate-900 uppercase"
												>
													Suggested
												</p>
												<p
													class="rounded-xl bg-white px-4 py-3 text-base text-slate-900 border-2 border-slate-900 shadow-sm"
												>
													{f.aiSuggestion}
												</p>
											</div>
											<div class="flex gap-3 pt-2">
												<button
													onclick={() => acceptSuggestion(key)}
													class="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
												>
													Accept changes
												</button>
												<button
													onclick={() => {
														fields[key].aiSuggestion = null;
														fields[key].aiInstruction = '';
													}}
													class="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
												>
													Dismiss
												</button>
											</div>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<!-- Bottom save all -->
			{#if isDirty}
				<div class="mt-10 flex justify-end">
					<button
						onclick={saveAll}
						disabled={isSavingAny}
						class="rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
					>
						{isSavingAny ? 'Saving…' : 'Save All Changes'}
					</button>
				</div>
			{/if}
		{/if}
	</main>
</div>
