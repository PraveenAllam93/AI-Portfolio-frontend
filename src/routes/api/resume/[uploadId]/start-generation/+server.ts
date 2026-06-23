import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, params }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const body = await request.json();
	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/status/${encodeURIComponent(params.uploadId)}/start-generation`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${idToken}`
			},
			body: JSON.stringify(body)
		}
	);

	const data = await upstream.json();
	if (!upstream.ok) throw error(upstream.status, data?.error ?? 'Failed to start generation');
	return json(data);
};
