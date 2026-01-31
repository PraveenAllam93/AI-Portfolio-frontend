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

<footer class="border-t border-peach-200 bg-peach-50">
	<div class="mx-auto max-w-7xl px-6 py-12 md:py-16">
		<div class="grid gap-10 md:grid-cols-4">
			<!-- Brand -->
			<div>
				<a href="/" class="font-serif text-xl font-bold text-charcoal">AIfolio</a>
				<p class="mt-3 text-sm leading-relaxed text-charcoal-light">
					Turn your resume into a stunning portfolio website with the power of AI.
				</p>
			</div>

			<!-- Link columns -->
			{#each footerLinks as column}
				<div>
					<h4 class="text-sm font-semibold text-charcoal">{column.title}</h4>
					<ul class="mt-4 space-y-3">
						{#each column.links as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-charcoal-light transition-colors hover:text-charcoal"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="mt-12 border-t border-peach-200 pt-8">
			<p class="text-center text-sm text-charcoal-light">
				&copy; {new Date().getFullYear()} AIfolio. All rights reserved.
			</p>
		</div>
	</div>
</footer>
