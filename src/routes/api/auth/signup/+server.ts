import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cognitoSignUp, parseCognitoError } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ request }) => {
	let name: string, email: string, password: string;

	try {
		({ name, email, password } = await request.json());
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!name || !email || !password) {
		throw error(400, 'Name, email, and password are required');
	}

	try {
		const res = await cognitoSignUp(email, password, name);

		return json({
			success: true,
			needsConfirmation: res.UserConfirmed === false
		});
	} catch (err) {
		if (err instanceof Error && 'status' in err) throw err;
		throw error(400, parseCognitoError(err));
	}
};
