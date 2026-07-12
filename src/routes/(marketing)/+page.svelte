<script lang="ts">
	import Hero from '$lib/components/marketing/Hero.svelte';
	import PortfolioShowcase from '$lib/components/marketing/PortfolioShowcase.svelte';
	import Features from '$lib/components/marketing/Features.svelte';
	import Testimonials from '$lib/components/marketing/Testimonials.svelte';
	import CallToAction from '$lib/components/marketing/CallToAction.svelte';
	import Pricing from '$lib/components/marketing/Pricing.svelte';
	import FAQ from '$lib/components/marketing/FAQ.svelte';
	import FinalCTA from '$lib/components/marketing/FinalCTA.svelte';
	import UploadDock from '$lib/components/marketing/UploadDock.svelte';
</script>

<svelte:head>
	<title>Portfolio.ai | Turn your CV into a portfolio that gets you hired</title>
	<meta
		name="description"
		content="Upload your CV. AI builds you a recruiter-ready portfolio in under 30 seconds. No design or coding skills needed."
	/>
	<meta property="og:title" content="Portfolio.ai" />
	<meta
		property="og:description"
		content="Your resume gets you read. A portfolio gets you the interview."
	/>
</svelte:head>

<Hero />
<PortfolioShowcase />
<Features />
<Testimonials />
<CallToAction />
<Pricing />
<FAQ />
<FinalCTA />
<UploadDock />
