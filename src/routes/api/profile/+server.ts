import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser, cognitoRefresh, setAuthCookies } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

/**
 * Proxy for the backend /profile endpoint.
 *
 * The backend derives the user from the token's sub claim, so there is no
 * userId in the path to check here.
 */

function apiBase(): string {
	const base = env.API_BASE_URL;
	if (!base) throw error(500, 'API_BASE_URL is not configured');
	return base;
}

export const GET: RequestHandler = async ({ cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(`${apiBase()}/profile`, {
		headers: { Authorization: `Bearer ${idToken}` }
	});

	if (!upstream.ok) {
		throw error(upstream.status, 'Failed to load profile');
	}

	return json(await upstream.json());
};

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const idToken = cookies.get('id_token') ?? '';
	const body = await request.text();

	const upstream = await fetch(`${apiBase()}/profile`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${idToken}`,
			'Content-Type': 'application/json'
		},
		body
	});

	const data = await upstream.json().catch(() => ({}));

	if (!upstream.ok) {
		throw error(upstream.status, data.error ?? 'Failed to update profile');
	}

	// The username lives on the ID token as preferred_username, so a rename
	// leaves the session stale for up to an hour. Refresh immediately so the
	// UI (and every URL it builds) picks up the new handle right away.
	const refreshToken = cookies.get('refresh_token');
	if (refreshToken && data.username && data.username !== user.username) {
		try {
			const refreshed = await cognitoRefresh(refreshToken);
			if (refreshed.AuthenticationResult) {
				setAuthCookies(cookies, refreshed.AuthenticationResult);
			}
		} catch {
			// Non-fatal: the change is saved, the session just catches up later.
		}
	}

	return json(data);
};
