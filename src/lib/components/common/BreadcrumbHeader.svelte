<script lang="ts">
	let {
		title,
		backHref = '/app/dashboard',
		backLabel = 'Dashboard'
	}: {
		title: string;
		backHref?: string;
		backLabel?: string;
	} = $props();
</script>

<header class="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
		<a
			href={backHref}
			class="flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-4 w-4"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
			</svg>
			{backLabel}
		</a>
		<span class="text-slate-300" aria-hidden="true">/</span>
		<span class="text-sm font-bold text-slate-900">{title}</span>
	</div>
</header>
