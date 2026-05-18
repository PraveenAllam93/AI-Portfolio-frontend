<script lang="ts">
	import Spinner from './Spinner.svelte';

	let {
		message = 'Loading…',
		size = 'sm'
	}: {
		message?: string;
		size?: 'sm' | 'lg';
	} = $props();
</script>

{#if size === 'lg'}
	<div
		role="status"
		aria-label={message}
		class="flex flex-col items-center justify-center py-20 text-sm text-ink-soft"
	>
		<Spinner size="lg" class="text-ink-muted" />
		<span class="mt-4 font-bold text-ink-muted">{message}</span>
	</div>
{:else}
	<div
		role="status"
		aria-label={message}
		class="flex items-center justify-center gap-3 py-12 text-sm font-medium text-ink-soft"
	>
		<Spinner size="sm" />
		<span>{message}</span>
	</div>
{/if}
