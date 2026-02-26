<script lang="ts">
	const footerLinks = [
		{
			title: 'Product',
			links: [
				{ label: 'Features', href: '#features' },
				{ label: 'Templates', href: '#templates' },
				{ label: 'Pricing', href: '#' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'About', href: '#' },
				{ label: 'Blog', href: '#' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Privacy', href: '#' },
				{ label: 'Terms', href: '#' }
			]
		}
	];
</script>

<footer style="background-color: #1E1033; border-top: 1px solid; border-image: linear-gradient(135deg, #6D28D9, #A855F7, #EC4899) 1;">
	<div class="mx-auto max-w-7xl px-6 py-12 md:py-16">
		<div class="grid gap-10 md:grid-cols-4">
			<div>
				<a href="/" class="flex items-center gap-0.5 text-xl font-bold">
					<span class="gradient-text">AI</span><span class="text-white">folio</span>
				</a>
				<p class="mt-3 text-sm leading-relaxed text-gray-400">
					Turn your resume into a stunning portfolio website with the power of AI.
				</p>
			</div>

			{#each footerLinks as column}
				<div>
					<h4 class="text-sm font-semibold text-gray-200">{column.title}</h4>
					<ul class="mt-4 space-y-3">
						{#each column.links as link}
							<li>
								<a href={link.href} class="text-sm text-gray-400 transition-colors hover:text-white">
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="mt-12 border-t border-white/10 pt-8">
			<p class="text-center text-sm text-gray-500">
				&copy; {new Date().getFullYear()} AIfolio. All rights reserved.
			</p>
		</div>
	</div>
</footer>
