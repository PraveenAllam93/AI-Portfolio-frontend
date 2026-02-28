import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearAuthCookies } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ cookies }) => {
	clearAuthCookies(cookies);
	return json({ success: true });
};
