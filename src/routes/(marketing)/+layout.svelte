<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import Navbar from '$lib/components/marketing/Navbar.svelte';
	import Footer from '$lib/components/marketing/Footer.svelte';

	let { children } = $props();

	$effect(() => {
		if (!$authStore.loading && $authStore.user) {
			goto('/app/dashboard', { replaceState: true });
		}
	});
</script>

<Navbar />
<main>
	{@render children()}
</main>
<Footer />
