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

<header class="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<a href="/" class="flex items-center gap-2 text-xl font-bold text-slate-900">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md transition-transform hover:rotate-12"
			>
				<span class="text-xs font-black">AI</span>
			</div>
			folio
		</a>

		{#if $authStore.user}
			<div class="flex items-center gap-4">
				<div
					class="flex items-center gap-3 {children
						? 'border-r border-slate-200 pr-4'
						: ''}"
				>
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-700 shadow-sm"
					>
						{userInitials}
					</div>
					<span class="hidden text-sm font-medium text-slate-700 sm:block">
						{$authStore.user.name}
					</span>
				</div>
				{@render children?.()}
			</div>
		{/if}
	</div>
</header>
