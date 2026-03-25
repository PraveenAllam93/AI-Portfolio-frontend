import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';

/**
 * Server-side proxy check for portfolio file existence.
 * Browser cannot HEAD CloudFront directly due to CORS — this route runs on Node.js
 * where there are no CORS restrictions.
 *
 * Returns:
 *   { ready: boolean }              — draft exists and is text/html
 *   { ready: boolean, publishedReady: boolean } — on initial load
 */
export const GET: RequestHandler = async ({ cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const rawCloudfront = env.CLOUDFRONT_URL ?? '';
	if (!rawCloudfront) throw error(500, 'CLOUDFRONT_URL is not configured');

	const cloudfrontBase = rawCloudfront.startsWith('http')
		? rawCloudfront
		: `https://${rawCloudfront}`;

	async function checkUrl(url: string): Promise<boolean> {
		try {
			const res = await fetch(url, { method: 'HEAD' });
			const ct = res.headers.get('Content-Type') ?? '';
			return res.ok && ct.includes('text/html');
		} catch {
			return false;
		}
	}

	const draftUrl = `${cloudfrontBase}/${user.userId}/draft/index.html`;
	const publishedUrl = `${cloudfrontBase}/${user.userId}/v1/index.html`;

	const [ready, publishedReady] = await Promise.all([
		checkUrl(draftUrl),
		checkUrl(publishedUrl)
	]);

	return json({ ready, publishedReady });
};
