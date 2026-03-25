import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: RequestHandler = async ({ params, cookies }) => {
	// 1. Reject malformed uploadId before touching auth or upstream
	if (!UUID_REGEX.test(params.uploadId)) {
		throw error(400, 'Invalid uploadId');
	}

	// 2. Validate session — same pattern as all other proxy routes
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	// 3. idToken from HttpOnly cookie — never exposed to browser JS
	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(`${apiBase}/status/${params.uploadId}`, {
		headers: { Authorization: idToken }
	});

	if (!upstream.ok) {
		throw error(upstream.status, 'Failed to fetch status');
	}

	const data = (await upstream.json()) as Record<string, unknown>;

	// 4. portfolioPath from backend is a relative path e.g. "{userId}/v1"
	//    Construct the full CloudFront URL here so the browser never needs
	//    CLOUDFRONT_URL as a public env var.
	//    Pattern matches /api/portfolio/url: https://{cloudfront}/{userId}/v1/index.html
	if (typeof data.portfolioPath === 'string' && data.portfolioPath) {
		const rawCloudfront = env.CLOUDFRONT_URL ?? '';
		if (rawCloudfront) {
			const cloudfrontBase = rawCloudfront.startsWith('http')
				? rawCloudfront
				: `https://${rawCloudfront}`;

			// Normalise: strip leading/trailing slashes from the path segment
			const path = data.portfolioPath.replace(/^\/+|\/+$/g, '');

			// Only assemble if not already a full URL (defensive)
			if (!path.startsWith('http')) {
				const withIndex = path.endsWith('index.html') ? path : `${path}/index.html`;
				data.portfolioPath = `${cloudfrontBase}/${withIndex}`;
			}
		}
	}

	return json(data);
};
