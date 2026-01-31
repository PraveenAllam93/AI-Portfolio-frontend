<script lang="ts">
	import Navbar from '$lib/components/marketing/Navbar.svelte';
	import Footer from '$lib/components/marketing/Footer.svelte';

	let { children } = $props();
</script>

<Navbar />
<main>
	{@render children()}
</main>
<Footer />
