import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser, getGuestUid, clearGuestUid } from '$lib/server/cognito';

/**
 * POST /api/guest/claim — after a guest converts to a real account.
 *
 * Migrates the guest's portfolio onto the now-authenticated real account and
 * (optionally) publishes the chosen uploadId. The guest's sub comes from the
 * httpOnly `guest_uid` cookie set when the guest session began; the caller only
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

	const guestUserId = getGuestUid(cookies);
	if (!guestUserId) {
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
		body: JSON.stringify({ guestUserId, uploadId })
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
