<script lang="ts">
	let {
		size = 'sm',
		class: className = ''
	}: {
		size?: 'xs' | 'sm' | 'md' | 'lg';
		class?: string;
	} = $props();

	const sizeClass: Record<string, string> = {
		xs: 'h-4 w-4',
		sm: 'h-5 w-5',
		md: 'h-6 w-6',
		lg: 'h-8 w-8'
	};
</script>

<svg
	class="{sizeClass[size]} animate-spin {className}"
	fill="none"
	viewBox="0 0 24 24"
	aria-hidden="true"
>
	<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
	></circle>
	<path
		class="opacity-75"
		fill="currentColor"
		d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
	></path>
</svg>
