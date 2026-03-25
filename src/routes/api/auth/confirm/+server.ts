import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cognitoConfirm, parseCognitoError } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ request }) => {
	let email: string, code: string;

	try {
		({ email, code } = await request.json());
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!email || !code) {
		throw error(400, 'Email and confirmation code are required');
	}

	try {
		await cognitoConfirm(email, code);
		return json({ success: true });
	} catch (err) {
		if (err instanceof Error && 'status' in err) throw err;
		throw error(400, parseCognitoError(err));
	}
};
