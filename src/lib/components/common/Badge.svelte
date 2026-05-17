<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'neutral',
		pulse = false,
		class: className = '',
		children
	}: {
		variant?: 'live' | 'neutral' | 'error' | 'warning' | 'processing';
		pulse?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();

	const containerStyles: Record<string, string> = {
		live: 'bg-emerald-50 border-emerald-100 text-emerald-600',
		neutral: 'bg-surface-muted border-surface-muted text-ink-soft',
		error: 'bg-red-50 border-red-100 text-red-600',
		warning: 'bg-amber-50 border-amber-200 text-amber-700',
		processing: 'bg-brand/10 border-brand/20 text-brand'
	};

	const dotStyles: Record<string, string> = {
		live: 'bg-emerald-500',
		neutral: 'bg-ink-muted',
		error: 'bg-red-500',
		warning: 'bg-amber-500',
		processing: 'bg-brand'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold {containerStyles[variant]} {className}"
>
	{#if pulse}
		<span class="h-1.5 w-1.5 rounded-full {dotStyles[variant]} animate-pulse"></span>
	{/if}
	{@render children?.()}
</span>
