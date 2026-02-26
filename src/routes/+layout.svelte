<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { getAuthUser } from '$lib/services/auth';
	import { authStore } from '$lib/stores/auth';

	let { children } = $props();

	// Check session via server — Cognito never called from browser
	onMount(async () => {
		const user = await getAuthUser();
		authStore.setUser(user);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
