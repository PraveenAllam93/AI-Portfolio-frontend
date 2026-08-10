import { json } from '@sveltejs/kit';

/**
 * Plan-limit pass-through for the API proxy routes.
 *
 * The backend answers "your plan does not allow this" with HTTP 402 and a
 * structured body:
 *
 *   { error, code: 'LIMIT_EXCEEDED', limit: {...}, upgradeTo: 'pro' }
 *
 * SvelteKit's `error(status, message)` would flatten that to a bare string, and
 * the upgrade modal needs the `limit` object to say WHICH limit was hit, how
 * much of it is used and when it resets. So a 402 is forwarded verbatim rather
 * than thrown — it is a normal, expected answer for a free user, not a fault.
 *
 * Usage in a proxy, immediately after the upstream fetch:
 *
 *   const limited = await passThroughLimit(upstream);
 *   if (limited) return limited;
 */
export const LIMIT_STATUS = 402;

export async function passThroughLimit(upstream: Response): Promise<Response | null> {
	if (upstream.status !== LIMIT_STATUS) return null;

	const body = await upstream.json().catch(() => ({
		error: 'Your plan does not include this.',
		code: 'LIMIT_EXCEEDED'
	}));

	return json(body, { status: LIMIT_STATUS });
}
