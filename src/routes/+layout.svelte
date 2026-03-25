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

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700;800&display=swap"
	/>
</svelte:head>
{@render children()}
