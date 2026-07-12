/**
 * Client-side helpers for the anonymous "Try for free" flow.
 * All calls proxy through SvelteKit +server.ts routes; Cognito is never called
 * from the browser.
 */
import type { AuthUser, AuthResult } from '$lib/services/auth';

/** Start an anonymous guest session (after solving the Turnstile challenge). */
export async function startGuestSession(turnstileToken: string): Promise<AuthResult<AuthUser>> {
	const res = await fetch('/api/guest/start', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ turnstileToken })
	});

	if (!res.ok) {
		let msg = 'Could not start a free session.';
		try {
			const data = await res.json();
			msg = data.message || data.error || msg;
		} catch {
			/* ignore */
		}
		return { success: false, error: msg };
	}

	const data = await res.json();
	return { success: true, data: data.user };
}

/**
 * Migrate the current guest's work onto the (now authenticated) real account
 * and publish the given uploadId. Call only after the real account is logged in.
 */
export async function claimGuestPortfolio(
	uploadId: string
): Promise<AuthResult<{ claimed: string[]; published: string | null }>> {
	const res = await fetch('/api/guest/claim', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ uploadId })
	});

	if (!res.ok) {
		let msg = 'Could not publish your portfolio.';
		try {
			const data = await res.json();
			msg = data.message || data.error || msg;
		} catch {
			/* ignore */
		}
		return { success: false, error: msg };
	}

	return { success: true, data: await res.json() };
}
