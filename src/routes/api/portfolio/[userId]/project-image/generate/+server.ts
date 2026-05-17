import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ params, cookies, request }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');
	if (user.userId !== params.userId) throw error(403, 'Forbidden');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const body = await request.json();
	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/portfolio/${params.userId}/project-image/generate`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	);

	if (!upstream.ok) {
		const err = await upstream.json().catch(() => ({}));
		throw error(
			upstream.status,
			(err as { error?: string }).error ?? 'Image generation failed'
		);
	}
	return json(await upstream.json());
};
