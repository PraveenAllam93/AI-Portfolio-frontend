import { json, error } from '@sveltejs/kit';
import { cognitoResetPassword, parseCognitoError } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { email, code, newPassword } = await request.json();

	if (!email || !code || !newPassword) {
		throw error(400, 'Email, code, and new password are required.');
	}

	try {
		await cognitoResetPassword(email.trim().toLowerCase(), code.trim(), newPassword);
		return json({ success: true });
	} catch (err) {
		throw error(400, parseCognitoError(err));
	}
};
