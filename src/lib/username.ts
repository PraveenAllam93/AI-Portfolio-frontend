/**
 * Username rules, shared by the browser and the server.
 *
 * This MUST stay in sync with src/lambdas/auth/username_utils.py in the
 * backend — that module is the authority. The copy here exists purely so the
 * signup form can give instant feedback without a round trip; every rule is
 * re-checked server-side in the Cognito PreSignUp trigger, which is what
 * actually enforces them.
 */

export const MIN_LENGTH = 3;
export const MAX_LENGTH = 30;

const FORMAT_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

/** Mirrors RESERVED in username_utils.py. */
const RESERVED = new Set([
	// routing / infrastructure
	'u', 'api', 'app', 'www', 'cdn', 'static', 'assets', 'public', 'draft',
	'index', 'error', 'favicon', 'robots', 'sitemap', 'health', 'status',
	'well-known', 'null', 'undefined', 'none', 'test',
	// app routes
	'login', 'signup', 'signin', 'signout', 'logout', 'register', 'auth',
	'confirm', 'verify', 'reset', 'forgot', 'password', 'settings', 'profile',
	'account', 'dashboard', 'portfolio', 'portfolios', 'resume', 'resumes',
	'upload', 'uploads', 'interview', 'templates', 'template', 'analytics',
	'edit', 'new', 'create', 'delete', 'guest',
	// marketing / legal
	'about', 'blog', 'docs', 'help', 'support', 'contact', 'pricing', 'terms',
	'privacy', 'legal', 'careers', 'jobs', 'press', 'faq',
	// impersonation
	'admin', 'administrator', 'root', 'system', 'official', 'staff', 'team',
	'billing', 'security', 'moderator', 'mod', 'owner', 'noreply', 'no-reply',
	'mail', 'email', 'webmaster', 'postmaster', 'abuse'
]);

export function normalizeUsername(raw: string): string {
	return (raw ?? '').trim().toLowerCase();
}

/** Returns an error message, or null when the username is well-formed. */
export function validateUsername(raw: string): string | null {
	const name = normalizeUsername(raw);

	if (!name) return 'Username is required.';
	if (name.length < MIN_LENGTH) return `Username must be at least ${MIN_LENGTH} characters.`;
	if (name.length > MAX_LENGTH) return `Username must be at most ${MAX_LENGTH} characters.`;
	if (!FORMAT_RE.test(name)) {
		return (
			'Username can only use letters, numbers, hyphens and underscores, ' +
			'and must start and end with a letter or number.'
		);
	}
	if (RESERVED.has(name)) return 'That username is reserved. Please choose another.';
	if (/^\d+$/.test(name)) return 'Username cannot be only numbers.';

	return null;
}

/**
 * Turn a stored portfolioPath ("{userId}/{uploadId}/v1") into its public,
 * username-addressed form ("u/{username}/{uploadId}/v1").
 *
 * Falls back to the raw userId form when the username is unknown — that path
 * still resolves through the edge gate, it is just not the pretty one.
 */
export function publicPath(portfolioPath: string | null, username?: string | null): string | null {
	if (!portfolioPath) return null;

	const parts = portfolioPath.replace(/^\/+|\/+$/g, '').split('/');
	if (parts.length < 2) return null;
	if (!username) return parts.join('/');

	return `u/${normalizeUsername(username)}/${parts.slice(1).join('/')}`;
}
