import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cognitoCreateGuest, setAuthCookies, setGuestUid, decodeIdToken } from '$lib/server/cognito';
import { verifyTurnstile } from '$lib/server/turnstile';

/**
 * POST /api/guest/start — begin an anonymous "Try for free" session.
 *
 * Verifies the Turnstile token, throttles per IP, then mints a real (but
 * anonymous) Cognito guest and sets the normal auth cookies. From here the
 * existing pipeline runs unchanged — the guest can upload, generate, and edit;
 * only publishing is gated until they create a real account.
 */

// Best-effort per-IP throttle. NOTE: in-memory, so it only protects within a
// single server instance — Turnstile is the primary defence. For strong limits
// across instances, back this with a shared store (Redis/DynamoDB) later.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
	const now = Date.now();
	const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	recent.push(now);
	hits.set(ip, recent);
	return recent.length > MAX_PER_WINDOW;
}

export const POST: RequestHandler = async ({ request, cookies, getClientAddress }) => {
	let body: { turnstileToken?: string };
	try {
		body = await request.json();
	} catch {
		body = {};
	}

	const ip = getClientAddress();

	const ok = await verifyTurnstile(body.turnstileToken, ip);
	if (!ok) {
		throw error(403, 'Verification failed. Please try again.');
	}

	if (rateLimited(ip)) {
		throw error(429, 'Too many attempts. Please try again later.');
	}

	try {
		const { result } = await cognitoCreateGuest();
		setAuthCookies(cookies, result);

		const user = result.IdToken ? decodeIdToken(result.IdToken) : null;
		if (user) {
			setGuestUid(cookies, user.userId);
		}
		return json({ success: true, user });
	} catch (err) {
		console.error('Guest session creation failed', err);
		throw error(500, 'Could not start a free session. Please try again.');
	}
};
