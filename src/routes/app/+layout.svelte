<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';

	let { children } = $props();

	$effect(() => {
		if (!$authStore.loading && !$authStore.user) {
			goto('/login', { replaceState: true });
		}
	});
</script>

{#if $authStore.loading}
	<div class="flex min-h-screen items-center justify-center bg-[#F5F3FF]">
		<div class="flex items-center gap-3">
			<svg class="h-5 w-5 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				></path>
			</svg>
			<span class="text-sm font-medium text-[#4B5563]">Loading…</span>
		</div>
	</div>
{:else if $authStore.user}
	{@render children()}
{/if}
