/**
 * Server-only Cloudflare Turnstile verification.
 *
 * Guards the anonymous guest-session endpoint so bots cannot spawn unlimited
 * guest pipelines (each of which costs OpenAI credits). The secret key never
 * reaches the browser — the widget renders with a public site key, and this
 * verifies the resulting token server-side.
 *
 * If TURNSTILE_SECRET_KEY is not configured, verification is skipped (returns
 * true) so local/dev without Cloudflare still works. Configure it in prod.
 */
import { env } from '$env/dynamic/private';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(
	token: string | undefined | null,
	remoteip?: string
): Promise<boolean> {
	const secret = env.TURNSTILE_SECRET_KEY;
	// Not configured → skip (dev convenience). In prod, set the secret.
	if (!secret) return true;
	if (!token) return false;

	const form = new URLSearchParams();
	form.set('secret', secret);
	form.set('response', token);
	if (remoteip) form.set('remoteip', remoteip);

	try {
		const res = await fetch(VERIFY_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: form
		});
		const data = (await res.json()) as { success?: boolean };
		return data.success === true;
	} catch {
		return false;
	}
}
