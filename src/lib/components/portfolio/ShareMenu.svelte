<script lang="ts">
	/**
	 * Share a published portfolio link.
	 *
	 * Every network here is reached through its documented web-intent URL, so
	 * nothing is loaded from a third party — no SDKs, no tracking pixels, no
	 * external requests. Icons are inline SVG for the same reason.
	 *
	 * Instagram is deliberately handled differently: it has no web intent for
	 * sharing a link, and there is no way to prefill a post from the browser.
	 * Pretending otherwise would just open a dead end, so it copies the link and
	 * says where to paste it. On mobile the native share sheet ("More") reaches
	 * Instagram properly.
	 */
	import { onMount } from 'svelte';

	let {
		url,
		title = 'My portfolio',
		text = 'Check out my portfolio',
		align = 'right',
		compact = false
	}: {
		url: string;
		title?: string;
		text?: string;
		align?: 'left' | 'right';
		/** Icon-only trigger, for rows that are already busy (e.g. dashboard cards). */
		compact?: boolean;
	} = $props();

	let open = $state(false);
	let copied = $state(false);
	let copyHint = $state('');
	let canNativeShare = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let menuEl = $state<HTMLDivElement | null>(null);

	// Placement is done by hand, and the menu is portalled to <body>, because
	// the callers would otherwise clip or mis-anchor it:
	//   - the dashboard card is `overflow-hidden`, which clips an absolutely
	//     positioned dropdown at the card edge
	//   - `use:reveal` leaves `transform: translateY(0)` on the card, and ANY
	//     non-none transform makes that element the containing block for
	//     position:fixed descendants — so even fixed positioning stays trapped
	//     inside the card and gets clipped
	// Moving the node to <body> is the only placement that is immune to both.
	let menuTop = $state(0);
	let menuLeft = $state(0);

	/** Move the node out to <body> so no ancestor transform/overflow applies. */
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	const MENU_WIDTH = 264; // matches w-66 below
	const GAP = 8;

	const EDGE = 12;

	function place() {
		if (!triggerEl) return;
		const r = triggerEl.getBoundingClientRect();
		const menuH = menuEl?.offsetHeight ?? 250;
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		// Prefer below the trigger; flip above when it would overflow the bottom.
		const below = r.bottom + GAP;
		const fitsBelow = below + menuH <= vh - EDGE;
		menuTop = fitsBelow ? below : Math.max(EDGE, r.top - GAP - menuH);

		// Align the menu's edge with the trigger's, then clamp into the viewport.
		let left = align === 'right' ? r.right - MENU_WIDTH : r.left;
		left = Math.min(Math.max(EDGE, left), vw - MENU_WIDTH - EDGE);
		menuLeft = left;
	}

	function toggle() {
		if (open) {
			open = false;
			return;
		}
		// Place BEFORE the node exists so it never paints at 0,0 first.
		place();
		open = true;
	}

	// Re-place once the real height is known (the estimate above may flip it).
	$effect(() => {
		if (open && menuEl) place();
	});

	onMount(() => {
		canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
	});

	const shareText = $derived(`${text} — ${title}`);
	const encodedUrl = $derived(encodeURIComponent(url));
	const encodedText = $derived(encodeURIComponent(shareText));
	const encodedTitle = $derived(encodeURIComponent(title));

	interface Target {
		id: string;
		label: string;
		href: string;
		/** Brand colour used for the icon on hover. */
		colour: string;
	}

	const targets = $derived<Target[]>([
		{
			id: 'x',
			label: 'X',
			href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedText}`,
			colour: '#000000'
		},
		{
			id: 'linkedin',
			label: 'LinkedIn',
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
			colour: '#0A66C2'
		},
		{
			id: 'whatsapp',
			label: 'WhatsApp',
			href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
			colour: '#25D366'
		},
		{
			id: 'facebook',
			label: 'Facebook',
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
			colour: '#1877F2'
		},
		{
			id: 'reddit',
			label: 'Reddit',
			href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
			colour: '#FF4500'
		},
		{
			id: 'telegram',
			label: 'Telegram',
			href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
			colour: '#26A5E4'
		},
		{
			id: 'email',
			label: 'Email',
			href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
			colour: '#6B7280'
		}
	]);

	// Minimal inline brand marks (24x24 viewBox), so the menu makes no network
	// requests and works under the portfolio CSP.
	const icons: Record<string, string> = {
		x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
		linkedin:
			'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
		whatsapp:
			'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z',
		facebook:
			'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
		reddit:
			'M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286A.72.72 0 0 0 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199a2 2 0 1 1-1.947 2.46 2.37 2.37 0 0 0-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363a2.802 2.802 0 1 1 3.135 4.647c-.532 2.85-3.898 5.033-7.941 5.033-4.043 0-7.409-2.183-7.941-5.033a2.802 2.802 0 1 1 3.135-4.647c1.286-.796 2.91-1.296 4.686-1.363v-.007a3.71 3.71 0 0 1 3.37-3.671 2 2 0 0 1 .849-1.13Zm-8.514 8.53a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm8.252 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm-4.126 5.65c-1.18 0-2.29.28-3.24.77a.5.5 0 0 0 .48.88 6.13 6.13 0 0 1 2.76-.65c.98 0 1.92.22 2.76.65a.5.5 0 1 0 .48-.88 7.16 7.16 0 0 0-3.24-.77Z',
		telegram:
			'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
		instagram:
			'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z'
	};

	function openTarget(href: string) {
		// noopener/noreferrer so the opened tab cannot reach back via window.opener.
		window.open(href, '_blank', 'noopener,noreferrer,width=640,height=640');
		open = false;
	}

	async function writeClipboard(value: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(value);
			return true;
		} catch {
			return false;
		}
	}

	async function copyLink() {
		const ok = await writeClipboard(url);
		copied = ok;
		copyHint = ok ? 'Link copied' : 'Press Ctrl/Cmd+C to copy';
		setTimeout(() => {
			copied = false;
			copyHint = '';
		}, 2500);
	}

	async function shareToInstagram() {
		// No web intent exists for Instagram links — copy instead and say so.
		const ok = await writeClipboard(url);
		copied = ok;
		copyHint = ok
			? 'Link copied — paste it in your Instagram bio or story'
			: 'Copy the link, then paste it in your Instagram bio';
		setTimeout(() => {
			copied = false;
			copyHint = '';
		}, 4000);
	}

	async function nativeShare() {
		try {
			await navigator.share({ title, text: shareText, url });
			open = false;
		} catch {
			// User dismissed the sheet, or the browser refused — nothing to do.
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
			triggerEl?.focus();
		}
	}

	function onPointerDown(e: MouseEvent) {
		if (!open) return;
		const t = e.target as Node;
		// The menu is a sibling in the DOM (fixed position), so test both.
		if (rootEl?.contains(t) || menuEl?.contains(t)) return;
		open = false;
	}

	function reposition() {
		if (open) place();
	}
</script>

<svelte:window
	onkeydown={onKeydown}
	onmousedown={onPointerDown}
	onresize={reposition}
	onscroll={reposition}
/>

<div class="relative inline-flex" bind:this={rootEl}>
	<button
		bind:this={triggerEl}
		type="button"
		onclick={toggle}
		aria-haspopup="menu"
		aria-expanded={open}
		aria-label="Share portfolio"
		title={compact ? 'Share' : undefined}
		class="inline-flex items-center justify-center gap-1.5 rounded-full border transition-all {open
			? 'border-brand/40 bg-brand/5 text-brand'
			: 'border-surface-muted bg-white text-ink-soft hover:bg-surface-subtle hover:text-ink'} {compact
			? 'h-9 w-9'
			: 'px-4 py-2 text-sm font-bold'}"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class={compact ? 'h-4 w-4' : 'h-3.5 w-3.5'}
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
			/>
		</svg>
		{#if !compact}Share{/if}
	</button>
</div>

{#if open}
	<div
		bind:this={menuEl}
		use:portal
		role="menu"
		aria-label="Share to"
		style="position:fixed; top:{menuTop}px; left:{menuLeft}px; width:{MENU_WIDTH}px;"
		class="z-[100] rounded-2xl border border-surface-muted bg-white p-3 shadow-2xl"
	>
			<p class="mb-2 px-1 text-xs font-bold tracking-widest text-ink-muted uppercase">Share to</p>

			<div class="grid grid-cols-4 gap-1">
				{#each targets as t (t.id)}
					<button
						type="button"
						role="menuitem"
						onclick={() => openTarget(t.href)}
						title={t.label}
						aria-label="Share on {t.label}"
						class="group flex flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors hover:bg-surface-subtle"
					>
						<svg
							viewBox="0 0 24 24"
							class="h-5 w-5 fill-ink-soft transition-colors group-hover:fill-[var(--brand-colour)]"
							style="--brand-colour: {t.colour}"
							aria-hidden="true"
						>
							<path d={icons[t.id]} />
						</svg>
						<span class="text-[10px] font-medium text-ink-muted">{t.label}</span>
					</button>
				{/each}

				<!-- Instagram: copy-only, see component docblock -->
				<button
					type="button"
					role="menuitem"
					onclick={shareToInstagram}
					title="Instagram — copies the link to paste"
					aria-label="Copy link for Instagram"
					class="group flex flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors hover:bg-surface-subtle"
				>
					<svg
						viewBox="0 0 24 24"
						class="h-5 w-5 fill-ink-soft transition-colors group-hover:fill-[#E4405F]"
						aria-hidden="true"
					>
						<path d={icons.instagram} />
					</svg>
					<span class="text-[10px] font-medium text-ink-muted">Instagram</span>
				</button>
			</div>

			<div class="mt-2 space-y-1 border-t border-surface-muted pt-2">
				<button
					type="button"
					role="menuitem"
					onclick={copyLink}
					class="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-surface-subtle hover:text-ink"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-4 w-4 shrink-0"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
						/>
					</svg>
					{copied ? 'Copied!' : 'Copy link'}
				</button>

				{#if canNativeShare}
					<button
						type="button"
						role="menuitem"
						onclick={nativeShare}
						class="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-surface-subtle hover:text-ink"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="h-4 w-4 shrink-0"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v12m6-6H6"
							/>
						</svg>
						More apps…
					</button>
				{/if}
			</div>

		{#if copyHint}
			<p class="mt-2 px-1 text-xs font-medium text-emerald-600" aria-live="polite">{copyHint}</p>
		{/if}
	</div>
{/if}
