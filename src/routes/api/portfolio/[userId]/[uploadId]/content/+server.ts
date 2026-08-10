import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';
import { passThroughLimit } from '$lib/server/limits';

export const PATCH: RequestHandler = async ({ params, cookies, request }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');
	if (user.userId !== params.userId) throw error(403, 'Forbidden');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const body = await request.json();
	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/portfolio/${params.userId}/${params.uploadId}/content`,
		{
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	);

	// A template switch to a paid template comes back as 402 — forward the
	// payload so the editor can open the upgrade modal instead of showing a
	// generic save failure.
	const limited = await passThroughLimit(upstream);
	if (limited) return limited;

	if (!upstream.ok) {
		const err = await upstream.json().catch(() => ({}));
		throw error(upstream.status, (err as { message?: string }).message ?? 'Failed to save content');
	}
	return json(await upstream.json());
};
