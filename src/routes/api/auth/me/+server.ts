import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';

export const GET: RequestHandler = async ({ cookies }) => {
	const user = await getSessionUser(cookies);

	if (!user) {
		throw error(401, 'Not authenticated');
	}

	return json({ user });
};
