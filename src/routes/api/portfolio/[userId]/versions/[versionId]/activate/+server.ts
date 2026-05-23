import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');
	if (user.userId !== params.userId) throw error(403, 'Access denied');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/portfolio/${params.userId}/versions/${params.versionId}/activate`,
		{ method: 'POST', headers: { Authorization: idToken } }
	);

	if (!upstream.ok) {
		const body = await upstream.json().catch(() => ({})) as Record<string, string>;
		throw error(upstream.status, body.error ?? 'Failed to activate version');
	}

	return json(await upstream.json());
};
