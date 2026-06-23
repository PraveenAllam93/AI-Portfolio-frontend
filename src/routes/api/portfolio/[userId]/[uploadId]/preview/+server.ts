import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');
	if (user.userId !== params.userId) throw error(403, 'Access denied');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const versionId = url.searchParams.get('versionId');
	if (!versionId) throw error(400, 'Missing versionId');

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/portfolio/${params.userId}/${params.uploadId}/preview?versionId=${encodeURIComponent(versionId)}`,
		{ headers: { Authorization: `Bearer ${idToken}` } }
	);

	if (!upstream.ok) {
		const err = await upstream.json().catch(() => ({}));
		throw error(upstream.status, (err as { error?: string }).error ?? 'Failed to get preview URL');
	}

	return json(await upstream.json());
};
