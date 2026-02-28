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
		neutral: 'bg-slate-100 border-slate-200 text-slate-600',
		error: 'bg-red-50 border-red-100 text-red-600',
		warning: 'bg-amber-50 border-amber-200 text-amber-700',
		processing: 'bg-blue-50 border-blue-100 text-blue-600'
	};

	const dotStyles: Record<string, string> = {
		live: 'bg-emerald-500',
		neutral: 'bg-slate-400',
		error: 'bg-red-500',
		warning: 'bg-amber-500',
		processing: 'bg-blue-500'
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
