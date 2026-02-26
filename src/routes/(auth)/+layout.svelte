<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';

	let { children } = $props();

	$effect(() => {
		if (!$authStore.loading && $authStore.user) {
			goto('/app/dashboard', { replaceState: true });
		}
	});
</script>

{@render children()}
