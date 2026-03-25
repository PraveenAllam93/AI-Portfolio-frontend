/**
 * Scroll-reveal Svelte action.
 * Fades + slides the element into view when it enters the viewport.
 * Uses IntersectionObserver — safe on SSR (actions only run in the browser).
 *
 * Usage:
 *   <div use:reveal>...</div>
 *   <div use:reveal={{ delay: 200 }}>...</div>
 *   <div use:reveal={{ delay: 100, y: 32 }}>...</div>
 */
export function reveal(
	node: HTMLElement,
	opts: { delay?: number; y?: number; threshold?: number } = {}
) {
	const { delay = 0, y = 22, threshold = 0.12 } = opts;

	// Respect user's motion preference — skip animation entirely
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return { destroy() {} };
	}

	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.transition = [
		`opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
		`transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`
	].join(', ');

	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.style.opacity = '1';
				node.style.transform = 'translateY(0)';
				io.disconnect();
			}
		},
		{ threshold, rootMargin: '0px 0px -40px 0px' }
	);

	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
}
