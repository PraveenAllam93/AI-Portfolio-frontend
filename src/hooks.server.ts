import type { Handle } from '@sveltejs/kit';

/**
 * Global response hardening.
 *
 * Referrer-Policy: `same-origin` — the app's URLs can contain a user/guest id in
 * the path (e.g. /app/portfolio/{userId}/...). With the browser default
 * (strict-origin-when-cross-origin) that path is already stripped cross-origin,
 * but `same-origin` is stricter: cross-origin requests (fonts, images, analytics,
 * outbound links) send NO Referer at all, so an id in the URL can never leak
 * off-site. Same-origin navigation still gets the full referrer.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (!response.headers.has('Referrer-Policy')) {
		response.headers.set('Referrer-Policy', 'same-origin');
	}
	return response;
};
