import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cognitoSignUp, parseCognitoError } from '$lib/server/cognito';
import { normalizeUsername, validateUsername } from '$lib/username';

export const POST: RequestHandler = async ({ request }) => {
	let name: string, email: string, password: string, username: string;

	try {
		({ name, email, password, username } = await request.json());
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!name || !email || !password || !username) {
		throw error(400, 'Name, username, email, and password are required');
	}

	// Format only. Uniqueness is decided by the conditional write in the
	// PreSignUp trigger — checking availability here would race with a
	// concurrent signup for the same handle.
	const usernameError = validateUsername(username);
	if (usernameError) {
		throw error(400, usernameError);
	}

	try {
		const res = await cognitoSignUp(email, password, name, normalizeUsername(username));

		return json({
			success: true,
			needsConfirmation: res.UserConfirmed === false
		});
	} catch (err) {
		if (err instanceof Error && 'status' in err) throw err;
		throw error(400, parseCognitoError(err));
	}
};
