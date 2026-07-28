import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');
	if (user.userId !== params.userId) throw error(403, 'Access denied');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/portfolio/${params.userId}/${params.uploadId}/versions`,
		{ headers: { Authorization: `Bearer ${idToken}` } }
	);

	if (!upstream.ok) {
		throw error(upstream.status, 'Failed to fetch versions');
	}

	const data = (await upstream.json()) as Record<string, unknown>;

	// Resolve to a full CloudFront URL for each version. Prefer the backend's
	// publicPath (the /u/{username} form); fall back to the raw userId path for
	// accounts that have no username yet.
	const rawCloudfront = env.CLOUDFRONT_URL ?? '';
	if (rawCloudfront && Array.isArray(data.versions)) {
		const base = rawCloudfront.startsWith('http') ? rawCloudfront : `https://${rawCloudfront}`;
		data.versions = (data.versions as Array<Record<string, unknown>>).map((v) => {
			const path =
				(v.publicPath as string | undefined) || (v.portfolioPath as string | undefined) || '';
			if (path && !path.startsWith('http')) {
				const clean = path.replace(/^\/+|\/+$/g, '');
				v = { ...v, portfolioUrl: `${base}/${clean}/index.html` };
			}
			return v;
		});
	}

	return json(data);
};
