import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(`${apiBase}/interview/${params.sessionId}/report`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});

	const data = await upstream.json();
	if (!upstream.ok) throw error(upstream.status, data?.error ?? 'Failed to fetch report');
	return json(data);
};
