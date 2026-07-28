import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cognitoConfirm, parseCognitoError } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ request }) => {
	let identifier: string, code: string;

	try {
		const body = await request.json();
		// Accepts a username or an email; `email` kept for older clients.
		identifier = body.identifier ?? body.email;
		code = body.code;
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!identifier || !code) {
		throw error(400, 'Username or email, and confirmation code are required');
	}

	try {
		await cognitoConfirm(identifier, code);
		return json({ success: true });
	} catch (err) {
		if (err instanceof Error && 'status' in err) throw err;
		throw error(400, parseCognitoError(err));
	}
};
