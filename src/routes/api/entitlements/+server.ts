import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

/**
 * Proxy for the backend /entitlements endpoint.
 *
 * The backend derives the user from the token's sub claim, so there is no
 * userId in the path to check here.
 */

export const GET: RequestHandler = async ({ cookies, setHeaders }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(`${apiBase}/entitlements`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});

	if (!upstream.ok) throw error(upstream.status, 'Failed to load entitlements');

	// Usage changes with every AI call and publish, so a cached copy would show
	// stale credit counts.
	setHeaders({ 'Cache-Control': 'no-store' });

	return json(await upstream.json());
};
