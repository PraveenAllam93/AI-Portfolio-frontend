<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import Spinner from '$lib/components/common/Spinner.svelte';

	let { children } = $props();

	$effect(() => {
		if (!$authStore.loading && !$authStore.user) {
			goto('/login', { replaceState: true });
		}
	});
</script>

{#if $authStore.loading}
	<div class="flex min-h-screen items-center justify-center bg-slate-50">
		<div class="flex items-center gap-3">
			<Spinner size="sm" class="text-brand" />
			<span class="text-sm font-medium text-ink-soft">Loading…</span>
		</div>
	</div>
{:else if $authStore.user}
	{@render children()}
{/if}
