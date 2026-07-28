import { json, error } from '@sveltejs/kit';
import { cognitoResetPassword, parseCognitoError } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	// Accepts a username or an email; `email` kept for older clients.
	const identifier = body.identifier ?? body.email;
	const { code, newPassword } = body;

	if (!identifier || !code || !newPassword) {
		throw error(400, 'Username or email, code, and new password are required.');
	}

	try {
		await cognitoResetPassword(identifier.trim().toLowerCase(), code.trim(), newPassword);
		return json({ success: true });
	} catch (err) {
		throw error(400, parseCognitoError(err));
	}
};
