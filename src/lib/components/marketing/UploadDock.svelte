<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isSupportedFileType } from '$lib/services/upload';
	import { setPendingUpload } from '$lib/stores/pendingUpload';

	let expanded = $state(false);
	let hidden = $state(false);
	let overDark = $state(false);
	let dragOver = $state(false);
	let selectedFile: File | null = $state(null);
	let errorMessage = $state('');
	let fileInput: HTMLInputElement | undefined = $state();

	onMount(() => {
		// Hide the dock while the dedicated upload section is on screen — a floating
		// upload button over an upload form is redundant.
		const uploadSection = document.getElementById('upload-cta');
		const hideIo = new IntersectionObserver(
			([entry]) => {
				hidden = entry.isIntersecting;
				if (entry.isIntersecting) expanded = false;
			},
			{ threshold: 0.15 }
		);
		if (uploadSection) hideIo.observe(uploadSection);

		// Theme-sync: when a dark section scrolls under the dock (bottom strip of
		// the viewport), flip the pill to its light variant. rootMargin collapses
		// the observation area to roughly the strip the dock floats in.
		const intersectingDark = new Set<Element>();
		const themeIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) intersectingDark.add(entry.target);
					else intersectingDark.delete(entry.target);
				}
				overDark = intersectingDark.size > 0;
			},
			{ rootMargin: '-85% 0px 0px 0px', threshold: 0 }
		);
		document
			.querySelectorAll('#different, footer, .ts-stage, .sx')
			.forEach((el) => themeIo.observe(el));

		return () => {
			hideIo.disconnect();
			themeIo.disconnect();
		};
	});

	function toggle() {
		expanded = !expanded;
		if (!expanded) reset();
	}

	function reset() {
		selectedFile = null;
		errorMessage = '';
		dragOver = false;
	}

	function acceptFile(file: File) {
		if (!isSupportedFileType(file)) {
			errorMessage = 'Please upload a PDF or DOC/DOCX resume.';
			selectedFile = null;
			return;
		}
		errorMessage = '';
		selectedFile = file;
	}

	function onFileChange(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (file) acceptFile(file);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) acceptFile(file);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && expanded) toggle();
	}

	function continueToBuild() {
		// Same entry path as the navbar's "Get Started Free": /try mints the guest
		// session (behind the Turnstile check) and lands on the upload wizard. The
		// picked file rides along so it isn't re-selected there. Signup only comes
		// later, when the guest chooses to publish.
		if (selectedFile) setPendingUpload(selectedFile);
		goto('/try');
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="dock" class:hidden>
	{#if expanded}
		<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
		<div class="dock-backdrop" onclick={toggle}></div>
		<div class="dock-panel" role="dialog" aria-label="Upload your resume">
			<button class="panel-close" onclick={toggle} aria-label="Close">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
			</button>
			<div class="panel-ttl">Upload your resume</div>
			<div class="panel-sub">AI reads it and builds your portfolio in under 30 seconds.</div>

			{#if selectedFile}
				<div class="file-ready">
					<span class="file-ico">📄</span>
					<div class="file-info">
						<div class="file-name">{selectedFile.name}</div>
						<button class="file-change" onclick={() => fileInput?.click()}>Change file</button>
					</div>
					<span class="file-check">✓</span>
				</div>
				<button class="panel-cta" onclick={continueToBuild}>✨ Build my portfolio — no account needed</button>
				<div class="panel-priv">🔒 Your resume is never stored, shared, or sold.</div>
			{:else}
				<button
					class="panel-drop"
					class:over={dragOver}
					onclick={() => fileInput?.click()}
					ondragover={(e) => {
						e.preventDefault();
						dragOver = true;
					}}
					ondragleave={() => (dragOver = false)}
					ondrop={onDrop}
				>
					<div class="drop-ico">📄</div>
					<div class="drop-ttl">Drag &amp; drop your CV here</div>
					<div class="drop-sub">or click to browse — PDF, DOCX</div>
				</button>
				{#if errorMessage}
					<div class="panel-err">{errorMessage}</div>
				{/if}
			{/if}
			<input
				bind:this={fileInput}
				type="file"
				accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				onchange={onFileChange}
				hidden
			/>
		</div>
	{/if}

	<button class="dock-pill" class:open={expanded} class:light={overDark} onclick={toggle} aria-expanded={expanded}>
		<span class="pill-badge">
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12" /><path d="m17 8-5-5-5 5" /><path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5" /></svg>
		</span>
		<span class="pill-txt">
			Upload your resume
			<span class="pill-hint">Free · 30 seconds · No account</span>
		</span>
		<span class="pill-arrow" class:flip={expanded}>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg>
		</span>
	</button>
</div>

<style>
	.dock {
		position: fixed;
		bottom: 18px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 250;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s;
	}
	.dock.hidden {
		transform: translateX(-50%) translateY(120px);
		opacity: 0;
		pointer-events: none;
	}

	/* Glassy pill that adapts to the section beneath it: dark ink over the cream
	   sections, white over the dark ones. One coral accent, no noise. */
	.dock-pill {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font-family: var(--font-body-dm);
		color: #fff;
		background: rgba(18, 18, 22, 0.88);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 7px 20px 7px 8px;
		border-radius: 100px;
		cursor: pointer;
		box-shadow: 0 12px 34px rgba(0, 0, 0, 0.28);
		transition: transform 0.2s, box-shadow 0.3s, background 0.35s, color 0.35s, border-color 0.35s;
		animation: dockIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.8s backwards;
	}
	.dock-pill:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
	}
	.dock-pill.open {
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
	}
	/* Light variant — floats over dark sections */
	.dock-pill.light {
		background: rgba(255, 255, 255, 0.94);
		color: var(--color-warm-ink);
		border-color: rgba(255, 255, 255, 0.6);
		box-shadow: 0 12px 34px rgba(0, 0, 0, 0.45);
	}
	@keyframes dockIn {
		from {
			opacity: 0;
			transform: translateY(60px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.pill-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: linear-gradient(135deg, #ff5c3a, #7c5cff);
		color: #fff;
		flex-shrink: 0;
		box-shadow: 0 4px 14px rgba(255, 92, 58, 0.35);
	}
	.pill-txt {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		line-height: 1.2;
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.pill-hint {
		font-size: 10px;
		font-weight: 500;
		color: #9b9ba8;
		letter-spacing: 0.02em;
		transition: color 0.35s;
	}
	.dock-pill.light .pill-hint {
		color: var(--color-warm-muted);
	}
	.pill-arrow {
		display: inline-flex;
		transition: transform 0.25s;
		opacity: 0.6;
	}
	.pill-arrow.flip {
		transform: rotate(180deg);
	}

	.dock-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(10, 10, 13, 0.35);
		backdrop-filter: blur(2px);
		z-index: -1;
	}

	.dock-panel {
		position: relative;
		width: min(420px, calc(100vw - 32px));
		background: #fff;
		border: 1px solid var(--color-warm-border);
		border-radius: 20px;
		padding: 24px;
		margin-bottom: 14px;
		box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
		text-align: center;
		animation: panelIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes panelIn {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.panel-close {
		position: absolute;
		top: 12px;
		right: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: none;
		background: var(--color-warm-cream);
		color: var(--color-warm-muted);
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}
	.panel-close:hover {
		background: var(--color-warm-cream2);
		color: var(--color-warm-ink);
	}
	.panel-ttl {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 16px;
		letter-spacing: -0.01em;
		color: var(--color-warm-ink);
		margin-bottom: 4px;
	}
	.panel-sub {
		font-size: 12px;
		color: var(--color-warm-muted);
		margin-bottom: 16px;
	}
	.panel-drop {
		width: 100%;
		border: 1.5px dashed var(--color-warm-border-dark);
		border-radius: 12px;
		background: none;
		padding: 24px;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}
	.panel-drop:hover,
	.panel-drop.over {
		border-color: var(--color-warm-indigo);
		background: var(--color-warm-lav);
	}
	.drop-ico {
		font-size: 26px;
		margin-bottom: 6px;
	}
	.drop-ttl {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 13px;
		color: var(--color-warm-ink);
		margin-bottom: 2px;
	}
	.drop-sub {
		font-size: 11px;
		color: var(--color-warm-muted);
	}
	.panel-err {
		margin-top: 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-warm-coral);
	}

	.file-ready {
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--color-warm-mint-bg);
		border: 1px solid rgba(0, 200, 150, 0.3);
		border-radius: 12px;
		padding: 12px 14px;
		margin-bottom: 12px;
		text-align: left;
	}
	.file-ico {
		font-size: 20px;
	}
	.file-info {
		flex: 1;
		min-width: 0;
	}
	.file-name {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-warm-ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.file-change {
		background: none;
		border: none;
		padding: 0;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-warm-muted);
		cursor: pointer;
		text-decoration: underline;
	}
	.file-change:hover {
		color: var(--color-warm-ink);
	}
	.file-check {
		color: #008a67;
		font-weight: 800;
	}
	/* Solid ink CTA — matches every other primary button on the page */
	.panel-cta {
		width: 100%;
		font-family: var(--font-body-dm);
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		background: var(--color-warm-ink);
		border: none;
		cursor: pointer;
		padding: 13px;
		border-radius: 100px;
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.panel-cta:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
	}
	.panel-priv {
		margin-top: 10px;
		font-size: 10px;
		color: var(--color-warm-dim);
	}

	@media (max-width: 600px) {
		.dock {
			bottom: 12px;
		}
		.dock-pill {
			padding: 6px 16px 6px 7px;
		}
		.pill-txt {
			font-size: 12.5px;
		}
		.pill-hint {
			font-size: 9px;
		}
	}
</style>
