import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';

export const GET: RequestHandler = async ({ cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) {
		throw error(401, 'Not authenticated');
	}

	const rawCloudfront = env.CLOUDFRONT_URL ?? '';
	if (!rawCloudfront) {
		throw error(500, 'CLOUDFRONT_URL is not configured');
	}

	const cloudfrontBase = rawCloudfront.startsWith('http')
		? rawCloudfront
		: `https://${rawCloudfront}`;

	return json({ url: `${cloudfrontBase}/${user.userId}/v1/index.html` });
};
