import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cognitoResendCode, parseCognitoError } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ request }) => {
	let email: string;

	try {
		({ email } = await request.json());
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!email) {
		throw error(400, 'Email is required');
	}

	try {
		await cognitoResendCode(email);
		return json({ success: true });
	} catch (err) {
		if (err instanceof Error && 'status' in err) throw err;
		throw error(400, parseCognitoError(err));
	}
};
