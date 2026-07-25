import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser, getValidGuestAccessToken, clearGuestUid } from '$lib/server/cognito';

/**
 * POST /api/guest/claim — after a guest converts to a real account.
 *
 * Migrates the guest's portfolio onto the now-authenticated real account and
 * (optionally) publishes the chosen uploadId. Ownership of the guest session is
 * proven by forwarding the guest's own ACCESS token (from an httpOnly cookie the
 * browser can't read/forge) to the backend, which validates it. The caller only
 * chooses which uploadId to publish.
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) {
		throw error(401, 'Not authenticated');
	}
	// The caller must be a REAL account (guests cannot claim).
	if (user.isGuest) {
		throw error(403, 'Create a real account before publishing.');
	}

	const guestAccessToken = await getValidGuestAccessToken(cookies);
	if (!guestAccessToken) {
		throw error(400, 'No guest session to claim.');
	}

	let uploadId: string | undefined;
	try {
		({ uploadId } = await request.json());
	} catch {
		uploadId = undefined;
	}

	const apiBase = env.API_BASE_URL;
	if (!apiBase) {
		throw error(500, 'API_BASE_URL is not configured');
	}

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(`${apiBase}/guest/claim`, {
		method: 'POST',
		headers: {
			Authorization: idToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ guestAccessToken, uploadId })
	});

	const text = await upstream.text();
	if (!upstream.ok) {
		throw error(upstream.status, text || 'Claim failed');
	}

	// Migration succeeded — the guest namespace is gone; drop the cookie.
	clearGuestUid(cookies);

	let data: unknown;
	try {
		data = JSON.parse(text);
	} catch {
		data = {};
	}
	return json(data);
};
