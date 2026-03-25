import { json, error } from '@sveltejs/kit';
import { cognitoForgotPassword, parseCognitoError } from '$lib/server/cognito';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { email } = await request.json();

	if (!email || typeof email !== 'string') {
		throw error(400, 'Email is required.');
	}

	try {
		await cognitoForgotPassword(email.trim().toLowerCase());
		return json({ success: true });
	} catch (err) {
		// Always return success for unknown emails — prevents user enumeration.
		// UserNotFoundException means email doesn't exist; we silently succeed.
		if (err instanceof Error && err.name === 'UserNotFoundException') {
			return json({ success: true });
		}
		throw error(400, parseCognitoError(err));
	}
};
