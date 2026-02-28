<script lang="ts">
	import Hero from '$lib/components/marketing/Hero.svelte';
	import Features from '$lib/components/marketing/Features.svelte';
	import HowItWorks from '$lib/components/marketing/HowItWorks.svelte';
	import PortfolioShowcase from '$lib/components/marketing/PortfolioShowcase.svelte';
	import TemplatePreview from '$lib/components/marketing/TemplatePreview.svelte';
	import CallToAction from '$lib/components/marketing/CallToAction.svelte';
</script>

<svelte:head>
	<title>AIfolio — Turn Your Resume Into a Stunning Portfolio Website</title>
	<meta
		name="description"
		content="Upload your resume and let AI create a beautiful personal website. Choose from professional templates, enhance with AI, and publish in minutes."
	/>
</svelte:head>

<Hero />
<Features />
<HowItWorks />
<PortfolioShowcase />
<TemplatePreview />
<CallToAction />
