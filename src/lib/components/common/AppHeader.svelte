<script lang="ts">
	import type { Snippet } from 'svelte';
	import { authStore } from '$lib/stores/auth';

	let { children }: { children?: Snippet } = $props();

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

<header class="sticky top-0 z-10 border-b border-surface-muted bg-white shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<a href="/" class="flex items-center gap-1 font-display font-black text-[17px] tracking-tight text-ink" style="letter-spacing:-0.02em">
			<div class="h-2 w-2 rounded-full bg-brand mr-0.5 shrink-0"></div>
			Portfolio<span class="text-brand">.ai</span>
		</a>

		{#if $authStore.user}
			<div class="flex items-center gap-4">
				<div
					class="flex items-center gap-3 {children
						? 'border-r border-surface-muted pr-4'
						: ''}"
				>
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full border border-surface-muted bg-surface-subtle text-sm font-bold text-ink-soft shadow-sm"
					>
						{userInitials}
					</div>
					<span class="hidden text-sm font-medium text-ink-soft sm:block">
						{$authStore.user.name}
					</span>
				</div>
				{@render children?.()}
			</div>
		{/if}
	</div>
</header>
