import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';
import { publicPath } from '$lib/username';

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

	const apiBase = env.API_BASE_URL ?? '';
	const idToken = cookies.get('id_token') ?? '';

	let portfolioPath: string | null = null;
	try {
		const res = await fetch(`${apiBase}/portfolio/${user.userId}`, {
			headers: { Authorization: `Bearer ${idToken}` }
		});
		if (res.ok) {
			const data = await res.json();
			portfolioPath = data.portfolioPath ?? null;
		}
	} catch {
		// fall through — portfolioPath stays null
	}

	// Public URL is addressed by username; the draft URL stays on the userId
	// form because it is owner-only and never shared.
	const publicLivePath = publicPath(portfolioPath, user.username);
	const liveUrl = publicLivePath ? `${cloudfrontBase}/${publicLivePath}/index.html` : null;

	return json({
		url: liveUrl,
		draftUrl: `${cloudfrontBase}/${user.userId}/draft/index.html`,
		userId: user.userId,
		username: user.username
	});
};
