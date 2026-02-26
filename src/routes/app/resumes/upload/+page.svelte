<script lang="ts">
	import { goto } from '$app/navigation';
	import { uploadResume, isSupportedFileType } from '$lib/services/upload';

	// ─── Types ──────────────────────────────────────────────────────────────────
	type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
	type WizardStep = 1 | 2 | 3;

	interface PortfolioType {
		id: string;
		label: string;
		description: string;
		color: string;
		bgColor: string;
		iconPath: string;
	}

	interface Template {
		id: string;
		name: string;
		tag: string;
		tagColor: string;
		accent: string;
	}

	// ─── State ──────────────────────────────────────────────────────────────────
	let wizardStep: WizardStep = $state(1);
	let uploadStatus: UploadStatus = $state('idle');
	let progress = $state(0);
	let errorMessage = $state('');
	let selectedFile: File | null = $state(null);
	let isDragOver = $state(false);
	let selectedTypeId = $state('');
	let selectedTemplateId = $state('');

	// ─── Data ───────────────────────────────────────────────────────────────────
	const portfolioTypes: PortfolioType[] = [
		{
			id: 'software',
			label: 'Software Engineer',
			description: 'Dev, tech & coding',
			color: 'text-violet-600',
			bgColor: 'bg-violet-100',
			iconPath: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5'
		},
		{
			id: 'designer',
			label: 'Designer',
			description: 'UI/UX, creative & visual',
			color: 'text-fuchsia-600',
			bgColor: 'bg-fuchsia-100',
			iconPath:
				'M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42'
		},
		{
			id: 'healthcare',
			label: 'Healthcare',
			description: 'Doctor, nurse & medical',
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-100',
			iconPath:
				'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
		},
		{
			id: 'marketing',
			label: 'Marketing',
			description: 'Growth, content & brand',
			color: 'text-amber-600',
			bgColor: 'bg-amber-100',
			iconPath:
				'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
		},
		{
			id: 'educator',
			label: 'Educator',
			description: 'Teacher, professor & trainer',
			color: 'text-blue-600',
			bgColor: 'bg-blue-100',
			iconPath:
				'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5'
		},
		{
			id: 'finance',
			label: 'Finance',
			description: 'Analyst, banking & consulting',
			color: 'text-cyan-600',
			bgColor: 'bg-cyan-100',
			iconPath:
				'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z'
		}
	];

	const templates: Template[] = [
		{
			id: 'minimal',
			name: 'Minimal',
			tag: 'Clean',
			tagColor: 'bg-gray-100 text-gray-600',
			accent: '#111827'
		},
		{
			id: 'bold',
			name: 'Bold',
			tag: 'Popular',
			tagColor: 'bg-violet-100 text-violet-700',
			accent: '#1E1033'
		},
		{
			id: 'creative',
			name: 'Creative',
			tag: 'Trendy',
			tagColor: 'bg-fuchsia-100 text-fuchsia-700',
			accent: '#EC4899'
		},
		{
			id: 'classic',
			name: 'Classic',
			tag: 'Professional',
			tagColor: 'bg-blue-100 text-blue-700',
			accent: '#2563EB'
		}
	];

	// ─── Derived ────────────────────────────────────────────────────────────────
	const selectedType = $derived(portfolioTypes.find((t) => t.id === selectedTypeId) ?? null);
	const selectedTemplate = $derived(templates.find((t) => t.id === selectedTemplateId) ?? null);
	const stepLabels = ['Upload File', 'Your Role', 'Template'];

	// ─── File handlers ───────────────────────────────────────────────────────────
	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) setFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) setFile(file);
	}

	function setFile(file: File) {
		errorMessage = '';
		if (!isSupportedFileType(file)) {
			errorMessage = 'Unsupported file type. Please upload a PDF or DOC/DOCX file.';
			return;
		}
		selectedFile = file;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	function clearFile() {
		selectedFile = null;
		errorMessage = '';
		uploadStatus = 'idle';
		progress = 0;
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	// ─── Wizard navigation ───────────────────────────────────────────────────────
	function goNext() {
		if (wizardStep === 1 && selectedFile) wizardStep = 2;
		else if (wizardStep === 2 && selectedTypeId) wizardStep = 3;
	}

	function goBack() {
		if (wizardStep === 2) wizardStep = 1;
		else if (wizardStep === 3) wizardStep = 2;
	}

	function resetWizard() {
		wizardStep = 1;
		selectedFile = null;
		selectedTypeId = '';
		selectedTemplateId = '';
		errorMessage = '';
		uploadStatus = 'idle';
		progress = 0;
	}

	// ─── Upload ──────────────────────────────────────────────────────────────────
	async function handleUpload() {
		if (!selectedFile || !selectedTypeId || !selectedTemplateId) return;

		uploadStatus = 'uploading';
		progress = 0;
		errorMessage = '';

		const result = await uploadResume(selectedFile, (pct) => {
			progress = pct;
		});

		if (result.success && result.uploadId) {
			// Navigate to the processing page — SSE stream starts there
			goto(`/app/resumes/${result.uploadId}/processing`);
		} else if (result.success) {
			// uploadId missing (unexpected) — fall back to dashboard
			goto('/app/dashboard');
		} else {
			uploadStatus = 'error';
			errorMessage = result.error ?? 'Upload failed.';
		}
	}
</script>

<svelte:head>
	<title>Upload Resume — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#F5F3FF]">
	<!-- Header -->
	<header class="sticky top-0 z-10 border-b border-gray-100 bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
			<a
				href="/app/dashboard"
				class="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1E1033]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
				</svg>
				Dashboard
			</a>
			<span class="text-gray-300">/</span>
			<span class="text-sm font-medium text-[#1E1033]">Upload Resume</span>
		</div>
	</header>

	<!-- Main -->
	<main class="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
		<div class="mb-8 text-center">
			<h1 class="font-serif text-3xl font-bold text-[#1E1033]">Build your portfolio</h1>
			<p class="mt-2 text-[#4B5563]">Upload your resume, pick your role and a template — done.</p>
		</div>

		{#if true}
			<!-- ── Step indicator ─────────────────────────────────────────────────── -->
			<div class="mb-6 flex items-start justify-center">
				{#each stepLabels as label, i}
					{@const step = (i + 1) as WizardStep}
					{@const isActive = wizardStep === step}
					{@const isDone = wizardStep > step}
					<div class="flex items-center">
						<div class="flex flex-col items-center gap-1.5">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 {isDone
									? 'gradient-bg text-white shadow-sm'
									: isActive
										? 'gradient-bg text-white shadow-sm ring-4 ring-violet-200'
										: 'bg-gray-200 text-gray-500'}"
							>
								{#if isDone}
									<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">
										<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
									</svg>
								{:else}
									{step}
								{/if}
							</div>
							<span class="text-xs font-medium {isActive ? 'text-violet-600' : isDone ? 'text-[#1E1033]' : 'text-gray-400'}">
								{label}
							</span>
						</div>
						{#if i < stepLabels.length - 1}
							<div class="mb-5 mx-3 h-px w-16 transition-all duration-500 {wizardStep > step ? 'bg-violet-400' : 'bg-gray-200'}"></div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- ── Wizard card ────────────────────────────────────────────────────── -->
			<div class="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
				<div class="gradient-bg h-1.5 w-full"></div>

				<!-- ──────────── Step 1: File upload ──────────────────────────────── -->
				{#if wizardStep === 1}
					<div class="p-8">
						<div class="mb-5">
							<h2 class="font-serif text-xl font-bold text-[#1E1033]">Upload your resume</h2>
							<p class="mt-1 text-sm text-[#4B5563]">PDF or Word documents, up to 10 MB.</p>
						</div>

						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="cursor-pointer overflow-hidden rounded-xl border-2 p-10 text-center transition-all duration-200
							{isDragOver ? 'border-violet-500 bg-violet-50'
							: selectedFile ? 'border-emerald-400 bg-emerald-50'
							: 'border-dashed border-violet-300 hover:border-violet-500 hover:bg-violet-50/50'}
							{uploadStatus === 'idle' && !selectedFile && !isDragOver ? 'animate-ring-pulse' : ''}"
							ondrop={handleDrop}
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
							onclick={() => {
								if (!selectedFile) (document.getElementById('file-input') as HTMLInputElement)?.click();
							}}
						>
							<input
								id="file-input"
								type="file"
								accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								class="hidden"
								onchange={handleFileSelect}
							/>

							{#if selectedFile}
								<div class="flex flex-col items-center gap-3">
									<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-7 w-7 text-emerald-600">
											<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
										</svg>
									</div>
									<div>
										<p class="font-semibold text-[#1E1033]">{selectedFile.name}</p>
										<p class="mt-0.5 text-sm text-[#4B5563]">{formatFileSize(selectedFile.size)}</p>
									</div>
									<button
										type="button"
										class="mt-1 text-xs font-medium text-violet-600 transition-colors hover:text-violet-800"
										onclick={(e) => { e.stopPropagation(); clearFile(); }}
									>
										Remove file
									</button>
								</div>
							{:else}
								<div class="flex flex-col items-center gap-3">
									<div class="flex h-14 w-14 items-center justify-center rounded-xl {isDragOver ? 'gradient-bg' : 'bg-violet-100'}">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-7 w-7 {isDragOver ? 'text-white' : 'text-violet-600'}">
											<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
										</svg>
									</div>
									<div>
										<p class="font-semibold text-[#1E1033]">Drop your resume here, or <span class="text-violet-600">browse</span></p>
										<p class="mt-1 text-sm text-[#4B5563]">PDF, DOC, DOCX up to 10 MB</p>
									</div>
								</div>
							{/if}
						</div>

						{#if errorMessage}
							<div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
						{/if}

						<button
							onclick={goNext}
							disabled={!selectedFile}
							class="gradient-bg mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
						>
							Continue
							<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
							</svg>
						</button>
					</div>

				<!-- ──────────── Step 2: Portfolio type ───────────────────────────── -->
				{:else if wizardStep === 2}
					<div class="p-8">
						<div class="mb-5">
							<h2 class="font-serif text-xl font-bold text-[#1E1033]">What's your field?</h2>
							<p class="mt-1 text-sm text-[#4B5563]">We'll tailor the layout and copy to your profession.</p>
						</div>

						<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{#each portfolioTypes as ptype}
								<button
									onclick={() => (selectedTypeId = ptype.id)}
									class="group relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200
									{selectedTypeId === ptype.id
										? 'border-violet-500 bg-violet-50 shadow-sm'
										: 'border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/40'}"
								>
									{#if selectedTypeId === ptype.id}
										<div class="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600">
											<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" class="h-3 w-3">
												<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
											</svg>
										</div>
									{/if}
									<div class="flex h-10 w-10 items-center justify-center rounded-lg {ptype.bgColor} transition-transform duration-200 group-hover:scale-110">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 {ptype.color}">
											<path stroke-linecap="round" stroke-linejoin="round" d={ptype.iconPath} />
										</svg>
									</div>
									<div>
										<p class="text-sm font-semibold text-[#1E1033]">{ptype.label}</p>
										<p class="mt-0.5 text-xs text-[#4B5563]">{ptype.description}</p>
									</div>
								</button>
							{/each}
						</div>

						<div class="mt-6 flex gap-3">
							<button
								onclick={goBack}
								class="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-[#4B5563] transition-colors hover:border-gray-400 hover:text-[#1E1033]"
							>
								<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
									<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
								</svg>
								Back
							</button>
							<button
								onclick={goNext}
								disabled={!selectedTypeId}
								class="gradient-bg flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
							>
								Continue
								<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
								</svg>
							</button>
						</div>
					</div>

				<!-- ──────────── Step 3: Template selection ───────────────────────── -->
				{:else if wizardStep === 3}
					<div class="p-8">
						<div class="mb-5">
							<h2 class="font-serif text-xl font-bold text-[#1E1033]">Choose a template</h2>
							<p class="mt-1 text-sm text-[#4B5563]">Pick a style for your portfolio. You can change it later.</p>
						</div>

						<div class="grid grid-cols-2 gap-4">
							{#each templates as tmpl}
								<button
									onclick={() => (selectedTemplateId = tmpl.id)}
									class="group relative overflow-hidden rounded-xl border-2 text-left transition-all duration-200
									{selectedTemplateId === tmpl.id
										? 'border-violet-500 shadow-md'
										: 'border-gray-100 hover:border-violet-200 hover:shadow-sm'}"
								>
									{#if selectedTemplateId === tmpl.id}
										<div class="absolute top-2 right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 shadow-sm">
											<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" class="h-3 w-3">
												<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
											</svg>
										</div>
									{/if}

									<!-- CSS mockup preview -->
									<div class="h-36 w-full overflow-hidden bg-gray-50">
										{#if tmpl.id === 'minimal'}
											<div class="flex h-full flex-col bg-white p-3">
												<div class="mb-1 h-2 w-16 rounded-full bg-gray-900"></div>
												<div class="mb-3 h-1 w-10 rounded-full bg-gray-300"></div>
												<div class="flex gap-1.5">
													{#each [6, 8, 5] as w}
														<div class="h-1 rounded-full bg-gray-200" style="width: {w * 4}px"></div>
													{/each}
												</div>
												<div class="my-3 h-px w-full bg-gray-100"></div>
												<div class="grid grid-cols-2 gap-2">
													<div class="space-y-1">
														{#each [1, 0.75, 1] as o}
															<div class="h-1 rounded-full bg-gray-200" style="opacity:{o}; width: 100%"></div>
														{/each}
													</div>
													<div class="space-y-1">
														{#each [1, 0.6] as o}
															<div class="h-1 rounded-full bg-gray-200" style="opacity:{o}; width: 100%"></div>
														{/each}
													</div>
												</div>
												<div class="mt-auto">
													<div class="inline-block h-4 rounded px-2 text-[6px] font-bold leading-4 text-white" style="background: {tmpl.accent}">Hire Me</div>
												</div>
											</div>

										{:else if tmpl.id === 'bold'}
											<div class="flex h-full flex-col">
												<div class="p-3" style="background: {tmpl.accent}">
													<div class="mb-1 h-2 w-14 rounded-full bg-white"></div>
													<div class="mb-2 h-1 w-10 rounded-full bg-white/50"></div>
													<div class="flex gap-1">
														{#each ['Work', 'Skills', 'Bio'] as tab}
															<div class="h-4 rounded px-1.5 text-[6px] font-bold leading-4 text-white" style="background: rgba(255,255,255,0.15)">{tab}</div>
														{/each}
													</div>
												</div>
												<div class="flex-1 bg-white p-3 space-y-1.5">
													{#each [1, 0.8, 1, 0.6] as o}
														<div class="h-1 w-full rounded-full bg-gray-200" style="opacity:{o}"></div>
													{/each}
												</div>
											</div>

										{:else if tmpl.id === 'creative'}
											<div class="flex h-full flex-col">
												<div class="p-3 pb-6" style="background: linear-gradient(135deg, #6D28D9, {tmpl.accent})">
													<div class="mb-1 h-2 w-12 rounded-full bg-white"></div>
													<div class="h-1 w-8 rounded-full bg-white/60"></div>
												</div>
												<div class="-mt-4 flex-1 rounded-t-2xl bg-white p-3">
													<div class="grid grid-cols-2 gap-1.5">
														{#each [1, 2, 3, 4] as _}
															<div class="rounded-lg bg-violet-50 p-1.5">
																<div class="mb-1 h-1 w-3/4 rounded-full bg-violet-200"></div>
																<div class="h-1 w-1/2 rounded-full bg-violet-100"></div>
															</div>
														{/each}
													</div>
												</div>
											</div>

										{:else if tmpl.id === 'classic'}
											<div class="flex h-full">
												<div class="w-1/3 p-2.5" style="background: {tmpl.accent}">
													<div class="mx-auto mb-2 h-7 w-7 rounded-full bg-white/20"></div>
													<div class="space-y-1">
														{#each [1, 0.7, 1, 0.5] as o}
															<div class="h-1 w-full rounded-full bg-white/40" style="opacity:{o}"></div>
														{/each}
													</div>
												</div>
												<div class="flex-1 bg-white p-2.5">
													<div class="mb-1.5 h-1.5 w-12 rounded-full bg-gray-800"></div>
													<div class="space-y-1">
														{#each [1, 0.8, 1, 0.7] as o}
															<div class="h-1 w-full rounded-full bg-gray-200" style="opacity:{o}"></div>
														{/each}
													</div>
												</div>
											</div>
										{/if}
									</div>

									<!-- Card label -->
									<div class="flex items-center justify-between border-t border-gray-100 bg-white px-3 py-2.5">
										<span class="text-sm font-semibold text-[#1E1033]">{tmpl.name}</span>
										<span class="rounded-full px-2 py-0.5 text-xs font-medium {tmpl.tagColor}">{tmpl.tag}</span>
									</div>
								</button>
							{/each}
						</div>

						<!-- Progress bar while uploading -->
						{#if uploadStatus === 'uploading'}
							<div class="mt-6">
								<div class="mb-2 flex items-center justify-between text-sm">
									<span class="font-medium text-[#1E1033]">Uploading…</span>
									<span class="font-semibold text-violet-600">{progress}%</span>
								</div>
								<div class="h-2.5 w-full overflow-hidden rounded-full bg-violet-100">
									<div
										class="h-full rounded-full transition-all duration-300"
										style="width: {progress}%; background: linear-gradient(90deg, #6D28D9, #A855F7, #EC4899); box-shadow: 0 0 8px rgba(139,92,246,0.5);"
									></div>
								</div>
								<p class="mt-2 text-xs text-[#4B5563]">
									{#if progress < 30}Getting upload URL…{:else if progress < 100}Sending to S3…{:else}Finalising…{/if}
								</p>
							</div>
						{/if}

						{#if errorMessage}
							<div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
						{/if}

						{#if uploadStatus !== 'uploading'}
							<div class="mt-6 flex gap-3">
								<button
									onclick={goBack}
									class="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-[#4B5563] transition-colors hover:border-gray-400 hover:text-[#1E1033]"
								>
									<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
										<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
									</svg>
									Back
								</button>
								<button
									onclick={handleUpload}
									disabled={!selectedTemplateId}
									class="gradient-bg flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
								>
									<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
									</svg>
									Generate Portfolio
								</button>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Privacy note -->
			<div class="mt-4 flex items-start gap-2 px-1">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mt-0.5 h-4 w-4 shrink-0 text-gray-400">
					<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
				</svg>
				<p class="text-xs text-gray-400">
					Your resume is uploaded securely to AWS S3. We only use its content to generate your
					portfolio — we never share your data.
				</p>
			</div>
		{/if}
	</main>
</div>
