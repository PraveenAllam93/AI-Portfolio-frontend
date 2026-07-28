import { json, error } from '@sveltejs/kit';
import { cognitoForgotPassword, parseCognitoError } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	// Accepts a username or an email; `email` kept for older clients.
	const identifier = body.identifier ?? body.email;

	if (!identifier || typeof identifier !== 'string') {
		throw error(400, 'Username or email is required.');
	}

	try {
		await cognitoForgotPassword(identifier.trim().toLowerCase());
		return json({ success: true });
	} catch (err) {
		// Always return success for unknown accounts — prevents enumeration of
		// both emails and usernames. UserNotFoundException means no such
		// account; we silently succeed.
		if (err instanceof Error && err.name === 'UserNotFoundException') {
			return json({ success: true });
		}
		throw error(400, parseCognitoError(err));
	}
};
