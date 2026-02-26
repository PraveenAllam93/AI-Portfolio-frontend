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

<div class="flex min-h-screen flex-col bg-[#F5F3FF]">
	<!-- Header -->
	<header class="sticky top-0 z-10 border-b border-gray-100 bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="/" class="font-serif text-xl font-bold">
				<span class="gradient-text">AI</span><span class="text-[#1E1033]">folio</span>
			</a>
			{#if $authStore.user}
				<div class="flex items-center gap-3">
					<div
						class="gradient-bg flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
					>
						{$authStore.user.name
							.split(' ')
							.slice(0, 2)
							.map((n) => n[0]?.toUpperCase() ?? '')
							.join('')}
					</div>
					<span class="hidden text-sm font-medium text-[#1E1033] sm:block">
						{$authStore.user.name}
					</span>
				</div>
			{/if}
		</div>
	</header>

	<main class="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
		<!-- Page title -->
		<div use:reveal class="mb-8">
			<a
				href="/app/dashboard"
				class="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1E1033]"
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
			<h1 class="font-serif text-3xl font-bold text-[#1E1033]">Edit Portfolio Content</h1>
			<p class="mt-1 text-[#4B5563]">
				Update your bio, headline, and unique value proposition. Use AI to refine your copy.
			</p>
		</div>

		{#if pageLoading}
			<div class="flex items-center gap-2 py-12 text-sm text-[#4B5563]">
				<svg class="h-4 w-4 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				Loading your portfolio content…
			</div>
		{:else}
			<!-- Non-blocking load warning -->
			{#if pageError}
				<div class="mb-6 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
					<p class="text-sm text-amber-800">{pageError}</p>
				</div>
			{/if}

			<!-- Unsaved changes banner -->
			{#if isDirty}
				<div
					class="mb-6 flex items-center justify-between rounded-xl bg-amber-50 px-5 py-3 ring-1 ring-amber-200"
				>
					<p class="text-sm text-amber-800">You have unsaved changes.</p>
					<button
						onclick={saveAll}
						disabled={isSavingAny}
						class="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{isSavingAny ? 'Saving…' : 'Save All Changes'}
					</button>
				</div>
			{/if}

			<!-- Fields -->
			<div class="space-y-6">
				{#each FIELDS as { key, label, hint, limit, multiline }}
					{@const f = fields[key]}
					<div
						use:reveal
						class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
					>
						<!-- Top accent bar when dirty -->
						{#if f.value !== f.original}
							<div class="h-0.5 w-full bg-amber-400"></div>
						{:else if f.status === 'saved'}
							<div class="h-0.5 w-full bg-emerald-400"></div>
						{:else}
							<div class="gradient-bg h-0.5 w-full"></div>
						{/if}

						<div class="p-6">
							<!-- Label row -->
							<div class="mb-3 flex items-center justify-between">
								<label for="field-{key}" class="text-sm font-semibold text-[#1E1033]"
									>{label}</label
								>
								<span
									class="text-xs {f.value.length > limit
										? 'text-red-500'
										: 'text-[#9CA3AF]'}"
								>
									{f.value.length}/{limit}
								</span>
							</div>

							<!-- Input or Textarea -->
							{#if multiline}
								<textarea
									id="field-{key}"
									rows="4"
									maxlength={limit}
									placeholder={hint}
									value={f.value}
									oninput={(e) => {
										fields[key].value = (e.currentTarget as HTMLTextAreaElement).value;
									}}
									class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1E1033] placeholder-[#9CA3AF] transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
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
									class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1E1033] placeholder-[#9CA3AF] transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
								/>
							{/if}

							<!-- Action row -->
							<div class="mt-3 flex items-center justify-between gap-3">
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
									class="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="h-3.5 w-3.5"
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
									class="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40
										{f.status === 'saved'
										? 'bg-emerald-100 text-emerald-700'
										: f.status === 'error'
											? 'bg-red-100 text-red-700'
											: 'gradient-bg text-white shadow-sm hover:opacity-90'}"
								>
									{#if f.status === 'saving'}
										<svg
											class="h-3.5 w-3.5 animate-spin"
											fill="none"
											viewBox="0 0 24 24"
										>
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
											stroke-width="2"
											stroke="currentColor"
											class="h-3.5 w-3.5"
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
										Save
									{/if}
								</button>
							</div>

							<!-- Per-field error -->
							{#if f.status === 'error' && f.errorMsg}
								<p class="mt-2 text-xs text-red-600">{f.errorMsg}</p>
							{/if}

							<!-- AI Panel -->
							{#if f.showAiPanel}
								<div class="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-4">
									<p class="mb-2 text-xs font-semibold text-violet-800">
										How should the AI improve this field?
									</p>
									<textarea
										rows="2"
										maxlength="300"
										placeholder="e.g. Make it more confident and concise, highlight impact over responsibilities."
										value={f.aiInstruction}
										oninput={(e) => {
											fields[key].aiInstruction = (
												e.currentTarget as HTMLTextAreaElement
											).value;
										}}
										class="w-full resize-none rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-[#1E1033] placeholder-[#9CA3AF] focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
									></textarea>
									<div class="mt-1 flex items-center justify-between">
										<span class="text-xs text-violet-500">{f.aiInstruction.length}/300</span>
										<div class="flex gap-2">
											<button
												onclick={() => dismissPanel(key)}
												class="rounded-full px-3 py-1 text-xs font-medium text-violet-600 hover:bg-violet-100"
											>
												Cancel
											</button>
											<button
												onclick={() => enhanceField(key)}
												disabled={!f.aiInstruction.trim() || f.aiLoading}
												class="gradient-bg inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
											>
												{#if f.aiLoading}
													<svg class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
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
										<p class="mt-2 text-xs text-red-600">{f.aiError}</p>
									{/if}

									<!-- Suggestion comparison -->
									{#if f.aiSuggestion}
										<div class="mt-4 space-y-3">
											<div>
												<p class="mb-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
													Current
												</p>
												<p class="rounded-lg bg-white px-3 py-2.5 text-sm text-[#4B5563] ring-1 ring-gray-200">
													{f.value || '(empty)'}
												</p>
											</div>
											<div>
												<p class="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-600">
													Suggested
												</p>
												<p class="rounded-lg bg-white px-3 py-2.5 text-sm text-[#1E1033] ring-1 ring-violet-300">
													{f.aiSuggestion}
												</p>
											</div>
											<div class="flex gap-2">
												<button
													onclick={() => acceptSuggestion(key)}
													class="gradient-bg rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
												>
													Accept
												</button>
												<button
													onclick={() => {
														fields[key].aiSuggestion = null;
														fields[key].aiInstruction = '';
													}}
													class="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-[#4B5563] hover:border-gray-400"
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
				<div class="mt-8 flex justify-end">
					<button
						onclick={saveAll}
						disabled={isSavingAny}
						class="gradient-bg rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50"
					>
						{isSavingAny ? 'Saving…' : 'Save All Changes'}
					</button>
				</div>
			{/if}
		{/if}
	</main>
</div>
