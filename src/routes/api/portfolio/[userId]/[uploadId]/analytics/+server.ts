import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';
import { passThroughLimit } from '$lib/server/limits';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');
	if (user.userId !== params.userId) throw error(403, 'Forbidden');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const idToken = cookies.get('id_token') ?? '';
	const upstream = await fetch(
		`${apiBase}/portfolio/${params.userId}/${params.uploadId}/analytics`,
		{ headers: { Authorization: `Bearer ${idToken}` } }
	);

	// Analytics is paid-only — free users get 402, which the page renders as a
	// locked panel rather than an error.
	const limited = await passThroughLimit(upstream);
	if (limited) return limited;

	if (!upstream.ok) throw error(upstream.status, 'Failed to fetch analytics');
	return json(await upstream.json());
};
