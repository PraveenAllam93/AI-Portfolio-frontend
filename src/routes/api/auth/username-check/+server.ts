import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { normalizeUsername, validateUsername } from '$lib/username';

/**
 * Live availability feedback for the signup form.
 *
 * Advisory only — the answer can go stale between the keystroke and the
 * submit. Uniqueness is decided by the conditional write in the backend's
 * PreSignUp trigger, not here.
 *
 * Format is checked locally first so obviously invalid input never reaches the
 * backend.
 */
export const GET: RequestHandler = async ({ url, fetch }) => {
	const raw = url.searchParams.get('username') ?? '';

	const formatError = validateUsername(raw);
	if (formatError) {
		return json({ available: false, reason: formatError });
	}

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const username = normalizeUsername(raw);

	try {
		const upstream = await fetch(
			`${apiBase}/username/check?username=${encodeURIComponent(username)}`
		);
		if (!upstream.ok) {
			// Don't block signup on a check outage — let the trigger decide.
			return json({ available: true, reason: '', unverified: true });
		}
		return json(await upstream.json());
	} catch {
		return json({ available: true, reason: '', unverified: true });
	}
};
