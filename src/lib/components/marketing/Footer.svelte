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

<footer class="bg-white border-t border-slate-200">
	<div class="mx-auto max-w-7xl px-6 py-12 md:py-16">
		<div class="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
			<div>
				<a href="/" class="flex items-center gap-2 text-xl font-bold">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
						<span class="text-xs font-black">AI</span>
					</div>
					<span class="text-slate-900">folio</span>
				</a>
				<p class="mt-4 text-sm leading-relaxed text-slate-500">
					Turn your resume into a stunning portfolio website with the power of AI.
				</p>
			</div>

			{#each footerLinks as column}
				<div>
					<h4 class="text-sm font-semibold text-slate-900">{column.title}</h4>
					<ul class="mt-4 space-y-3">
						{#each column.links as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-slate-500 transition-colors hover:text-slate-900"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="mt-12 border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
			<p class="text-sm text-slate-500">
				&copy; {new Date().getFullYear()} AIfolio. All rights reserved.
			</p>
            <div class="flex gap-4">
                <!-- Social placeholders -->
                <div class="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"></div>
                <div class="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"></div>
                <div class="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"></div>
            </div>
		</div>
	</div>
</footer>
