<script lang="ts">
	import { goto } from '$app/navigation';
	import { uploadResume, isSupportedFileType, type ResumeCategory } from '$lib/services/upload';
	import BreadcrumbHeader from '$lib/components/common/BreadcrumbHeader.svelte';

	type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
	type WizardStep = 1 | 2 | 3;

	interface PortfolioType {
		id: ResumeCategory;
		label: string;
		description: string;
	}

	let wizardStep: WizardStep = $state(1);
	let uploadStatus: UploadStatus = $state('idle');
	let progress = $state(0);
	let errorMessage = $state('');
	let selectedFile: File | null = $state(null);
	let isDragOver = $state(false);
	let selectedTypeId = $state<ResumeCategory | ''>('');
	let selectedTemplateId = $state('');

	const portfolioTypes: PortfolioType[] = [
		{ id: 'software_engineer', label: 'Software Engineer', description: 'Dev, tech & coding' },
		{ id: 'designer', label: 'Designer', description: 'UI/UX, creative & visual' },
		{ id: 'marketing', label: 'Marketing', description: 'Growth, content & brand' },
		{ id: 'finance', label: 'Finance', description: 'Analyst, banking & consulting' }
	];

	interface Template {
		id: string;
		name: string;
		tag: string;
		preview: {
			bg: string;
			accent: string;
			bar: string;
			lines: string[];
		};
	}

	const templates: Template[] = [
		{
			id: 'nebula', name: 'Nebula', tag: 'Cyberpunk',
			preview: { bg: '#07070f', accent: '#a855f7', bar: '#22d3ee', lines: ['#1a1a2e', '#1a1a2e', '#111122'] }
		},
		{
			id: 'galaxy', name: 'Galaxy', tag: 'Dark Purple',
			preview: { bg: '#0f172a', accent: '#c084fc', bar: '#ec4899', lines: ['#1e1b4b', '#1e1b4b', '#1a1a3e'] }
		},
		{
			id: 'codex', name: 'Codex', tag: 'Light Tech',
			preview: { bg: '#f0f9ff', accent: '#0ea5e9', bar: '#6366f1', lines: ['#ffffff', '#ffffff', '#f8fafc'] }
		},
		{
			id: 'neon', name: 'Neon', tag: 'Cyber Green',
			preview: { bg: '#0a0e27', accent: '#39ff14', bar: '#00e5ff', lines: ['#0d1137', '#0d1137', '#0a0e27'] }
		},
		{
			id: 'circuit', name: 'Circuit', tag: 'Dark Tech',
			preview: { bg: '#0a0d14', accent: '#00d4ff', bar: '#7c3aed', lines: ['#0f1320', '#0f1320', '#141926'] }
		},
		{
			id: 'navy-gold', name: 'Navy Gold', tag: 'Elegant',
			preview: { bg: '#0c1f3f', accent: '#c8a96e', bar: '#e8c97d', lines: ['#0f2550', '#0f2550', '#0c1f3f'] }
		},
		{
			id: 'cosmos', name: 'Cosmos', tag: 'Space',
			preview: { bg: '#020510', accent: '#00f5ff', bar: '#8b5cf6', lines: ['#060d1f', '#060d1f', '#020510'] }
		},
		{
			id: 'retro', name: 'Retro', tag: 'Vintage',
			preview: { bg: '#f5f0e8', accent: '#c85a1e', bar: '#c48b14', lines: ['#1c1410', '#ede7db', '#1c1410'] }
		},
		{
			id: 'luxe', name: 'Luxe', tag: 'Classy',
			preview: { bg: '#0a0a0a', accent: '#c9a84c', bar: '#e8c97d', lines: ['#111111', '#111111', '#0a0a0a'] }
		},
		{
			id: 'aurora', name: 'Aurora', tag: 'Modern',
			preview: { bg: '#f8f9fa', accent: '#ff6b6b', bar: '#1a1f36', lines: ['#ffffff', '#ffffff', '#f8f9fa'] }
		},
		{
			id: 'quantum', name: 'Quantum', tag: 'Futuristic',
			preview: { bg: '#030712', accent: '#06b6d4', bar: '#8b5cf6', lines: ['#060d1f', '#060d1f', '#030712'] }
		},
	];

	const stepLabels = ['File', 'Role', 'Theme'];

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

	function formatFileSize(bytes: number): string {
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function goNext() {
		if (wizardStep === 1 && selectedFile) wizardStep = 2;
		else if (wizardStep === 2 && selectedTypeId) wizardStep = 3;
	}

	function goBack() {
		if (wizardStep === 2) wizardStep = 1;
		else if (wizardStep === 3) wizardStep = 2;
	}

	async function handleUpload() {
		if (!selectedFile || !selectedTypeId || !selectedTemplateId) return;

		uploadStatus = 'uploading';
		progress = 0;
		errorMessage = '';

		const result = await uploadResume(selectedFile, selectedTypeId as ResumeCategory, selectedTemplateId, (pct) => {
			progress = pct;
		});

		if (result.success && result.uploadId) {
			goto(`/app/resumes/${result.uploadId}/processing`);
		} else if (result.success) {
			goto('/app/dashboard');
		} else {
			uploadStatus = 'error';
			errorMessage = result.error ?? 'Upload failed.';
		}
	}
</script>

<svelte:head>
	<title>Upload Resume — Portfolio.ai</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<BreadcrumbHeader title="Upload" />

	<main class="mx-auto w-full max-w-2xl flex-1 px-6 py-8 sm:py-16">
		<div class="mb-10 text-center">
			<h1 class="font-display text-4xl font-bold text-ink" style="letter-spacing:-0.02em">Build your portfolio</h1>
			<p class="mt-3 text-lg text-ink-soft">Upload your resume, pick a role and a theme.</p>
		</div>

		<!-- Step indicator -->
		<div class="mb-10 flex items-center justify-center gap-4">
			{#each stepLabels as label, i}
				{@const step = (i + 1) as WizardStep}
				{@const isActive = wizardStep === step}
				{@const isDone = wizardStep > step}
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 {isDone || isActive
								? 'bg-brand text-white shadow-md'
								: 'bg-surface-muted text-ink-muted border border-surface-muted'}"
						>
							{#if isDone}
								<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
							{:else}
								{step}
							{/if}
						</div>
						<span class="text-sm font-bold hidden sm:block {isActive || isDone ? 'text-ink' : 'text-ink-muted'}">{label}</span>
					</div>
					{#if i < stepLabels.length - 1}
						<div class="h-px w-8 sm:w-16 {wizardStep > step ? 'bg-brand' : 'bg-surface-muted'}"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Wizard card -->
		<div class="overflow-hidden rounded-[2rem] border border-surface-muted bg-white p-8 sm:p-10 shadow-xl">
			{#if wizardStep === 1}
				<div>
					<h2 class="font-display text-2xl font-bold text-ink mb-6" style="letter-spacing:-0.02em">Upload your resume</h2>
					<div
						role={selectedFile ? undefined : 'button'}
						tabindex={selectedFile ? undefined : 0}
						aria-label={selectedFile ? undefined : 'Upload resume — click or drag and drop a PDF or DOCX file'}
						class="rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-200 {isDragOver ? 'border-brand bg-brand/5' : selectedFile ? 'border-surface-muted bg-white' : 'cursor-pointer border-surface-muted bg-surface-subtle hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30'}"
						ondrop={handleDrop}
						ondragover={handleDragOver}
						ondragleave={handleDragLeave}
						onclick={() => { if (!selectedFile) document.getElementById('file-input')?.click(); }}
						onkeydown={(e) => { if (!selectedFile && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); document.getElementById('file-input')?.click(); } }}
					>
						<input id="file-input" type="file" accept=".pdf,.doc,.docx" class="hidden" onchange={handleFileSelect} aria-label="Choose resume file" />
						{#if selectedFile}
							<div class="flex flex-col items-center gap-3">
								<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-brand/10 text-brand border border-brand/20">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
								</div>
								<div>
									<p class="font-bold text-ink">{selectedFile.name}</p>
									<p class="mt-1 text-sm text-ink-soft">{formatFileSize(selectedFile.size)}</p>
								</div>
								<button type="button" class="mt-2 min-h-[44px] px-4 text-xs font-bold text-ink-soft hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 rounded-lg" onclick={(e) => { e.stopPropagation(); selectedFile = null; errorMessage = ''; }}>Change file</button>
							</div>
						{:else}
							<div class="flex flex-col items-center gap-3">
								<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-muted text-ink-muted border border-surface-muted transition-colors {isDragOver ? 'bg-brand/10 text-brand border-brand/20' : ''}">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
								</div>
								<div>
									<p class="font-bold text-ink">Drop your resume here</p>
									<p class="mt-1 text-sm text-ink-soft">or click to browse (PDF, DOCX)</p>
								</div>
							</div>
						{/if}
					</div>

					{#if errorMessage}
						<div id="upload-error" role="alert" aria-live="assertive" class="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{errorMessage}</div>
					{/if}

					<button onclick={goNext} disabled={!selectedFile} class="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
						Continue
					</button>
				</div>
			{:else if wizardStep === 2}
				<div>
					<h2 class="font-display text-2xl font-bold text-ink mb-2" style="letter-spacing:-0.02em">What's your field?</h2>
					<p class="mb-6 text-ink-soft">We'll tailor the layout to your profession.</p>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{#each portfolioTypes as ptype}
							<button onclick={() => (selectedTypeId = ptype.id)} class="flex flex-col items-start gap-1 rounded-2xl border-2 p-5 text-left transition-all duration-200 {selectedTypeId === ptype.id ? 'border-brand bg-brand/5 shadow-sm' : 'border-surface-muted bg-white hover:border-brand/30'}">
								<p class="font-bold text-ink">{ptype.label}</p>
								<p class="text-sm text-ink-soft">{ptype.description}</p>
							</button>
						{/each}
					</div>

					<div class="mt-8 flex gap-4">
						<button onclick={goBack} class="flex items-center justify-center rounded-xl bg-surface-subtle px-6 py-4 text-sm font-bold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink">Back</button>
						<button onclick={goNext} disabled={!selectedTypeId} class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50">Continue</button>
					</div>
				</div>
			{:else if wizardStep === 3}
				<div>
					<h2 class="font-display text-2xl font-bold text-ink mb-2" style="letter-spacing:-0.02em">Choose a theme</h2>
					<p class="mb-6 text-ink-soft">Pick a starting style. You can change it later.</p>

					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{#each templates as tmpl}
							<button onclick={() => (selectedTemplateId = tmpl.id)} class="group flex flex-col items-start rounded-2xl border-2 p-1 text-left transition-all duration-200 {selectedTemplateId === tmpl.id ? 'border-brand shadow-md' : 'border-surface-muted hover:border-brand/30'}">
								<!-- Mini color preview -->
								<div class="h-24 w-full rounded-xl overflow-hidden relative" style="background:{tmpl.preview.bg}">
									<!-- Nav bar -->
									<div class="absolute top-0 left-0 right-0 h-5 flex items-center px-2 gap-1" style="background:{tmpl.preview.lines[0]}">
										<div class="w-3 h-1.5 rounded-full" style="background:{tmpl.preview.accent}"></div>
										<div class="flex-1 h-1 rounded-full ml-1 opacity-40" style="background:{tmpl.preview.lines[2]}"></div>
										<div class="w-5 h-1 rounded-full opacity-60" style="background:{tmpl.preview.bar}"></div>
									</div>
									<!-- Content lines -->
									<div class="absolute top-7 left-3 right-3 flex flex-col gap-1.5">
										<div class="h-2 rounded-full w-3/4" style="background:{tmpl.preview.accent};opacity:0.85"></div>
										<div class="h-1 rounded-full w-1/2" style="background:{tmpl.preview.bar};opacity:0.45"></div>
										<div class="mt-0.5 h-1 rounded-full w-full" style="background:{tmpl.preview.lines[1]};opacity:0.3"></div>
										<div class="h-1 rounded-full w-4/5" style="background:{tmpl.preview.lines[1]};opacity:0.2"></div>
									</div>
									<!-- Accent glow -->
									<div class="absolute bottom-2 right-2 w-5 h-5 rounded-full opacity-25" style="background:{tmpl.preview.accent}"></div>
									{#if selectedTemplateId === tmpl.id}
										<div class="absolute inset-0 rounded-xl ring-2 ring-brand"></div>
									{/if}
								</div>
								<div class="px-3 pt-2 pb-3 w-full flex justify-between items-center">
									<div>
										<span class="font-bold text-ink text-sm">{tmpl.name}</span>
										<span class="ml-1.5 text-xs text-ink-muted">{tmpl.tag}</span>
									</div>
									{#if selectedTemplateId === tmpl.id}
										<div class="w-2 h-2 rounded-full bg-brand shrink-0"></div>
									{/if}
								</div>
							</button>
						{/each}
					</div>

					{#if uploadStatus === 'uploading'}
						<div class="mt-8">
							<div class="mb-2 flex items-center justify-between text-sm font-bold">
								<span class="text-ink">Uploading & Analyzing...</span>
								<span class="text-ink-soft">{progress}%</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
								<div class="h-full rounded-full bg-brand transition-all duration-300" style="width: {progress}%"></div>
							</div>
						</div>
					{/if}

					{#if errorMessage}
						<div class="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{errorMessage}</div>
					{/if}

					{#if uploadStatus !== 'uploading'}
						<div class="mt-8 flex gap-4">
							<button onclick={goBack} class="flex items-center justify-center rounded-xl bg-surface-subtle px-6 py-4 text-sm font-bold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink">Back</button>
							<button onclick={handleUpload} disabled={!selectedTemplateId} class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50">Generate Portfolio</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</main>
</div>
