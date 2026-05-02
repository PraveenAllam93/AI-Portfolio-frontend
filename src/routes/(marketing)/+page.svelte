<script lang="ts">
	import Hero from '$lib/components/marketing/Hero.svelte';
	import HowItWorks from '$lib/components/marketing/HowItWorks.svelte';
	import Features from '$lib/components/marketing/Features.svelte';
	import PortfolioShowcase from '$lib/components/marketing/PortfolioShowcase.svelte';
	import TemplatePreview from '$lib/components/marketing/TemplatePreview.svelte';
	import CallToAction from '$lib/components/marketing/CallToAction.svelte';
	import Pricing from '$lib/components/marketing/Pricing.svelte';
	import FAQ from '$lib/components/marketing/FAQ.svelte';
	import FinalCTA from '$lib/components/marketing/FinalCTA.svelte';
</script>

<svelte:head>
	<title>Portfolio.ai | Turn your CV into a portfolio that gets you hired</title>
	<meta
		name="description"
		content="Upload your CV and let AI create a beautiful personal portfolio in under 30 seconds. No design skills needed. Get more interviews."
	/>
</svelte:head>

<Hero />
<HowItWorks />
<Features />
<PortfolioShowcase />
<TemplatePreview />
<CallToAction />
<Pricing />
<FAQ />
<FinalCTA />
