<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { entitlements } from '$lib/stores/entitlements';
	import Spinner from '$lib/components/common/Spinner.svelte';

	let { children } = $props();

	$effect(() => {
		if (!$authStore.loading && !$authStore.user) {
			goto('/login', { replaceState: true });
		}
	});

	// Load the plan once for the whole authenticated app. Every lock, star badge
	// and credit counter reads from this one store, so no page hardcodes a limit.
	// Not awaited: the UI defaults to permissive while it loads, so a slow
	// response never flashes locks at a paying user.
	let entitlementsRequested = false;
	$effect(() => {
		if ($authStore.user && !entitlementsRequested) {
			entitlementsRequested = true;
			void entitlements.load();
		}
	});
</script>

{#if $authStore.loading}
	<div class="flex min-h-screen items-center justify-center bg-surface-subtle">
		<div class="flex items-center gap-3">
			<Spinner size="sm" class="text-brand" />
			<span class="text-sm font-medium text-ink-soft">Loading…</span>
		</div>
	</div>
{:else if $authStore.user}
	{@render children()}
{/if}
