import { corsair } from './corsair';

const AVATAR_LOOKUP_TIMEOUT_MS = 2_000;

/**
 * Public, CDN-cached avatar URL — needs no API call and is never
 * rate-limited. Final fallback when the corsair cache is empty and
 * the GitHub API is unavailable or rate-limited.
 */
function getGithubAvatarFallbackUrl(username: string): string {
	return `https://github.com/${encodeURIComponent(username)}.png?size=128`;
}

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((resolve) =>
			setTimeout(() => resolve(fallback), AVATAR_LOOKUP_TIMEOUT_MS),
		),
	]);
}

const AVATAR_MEMO_TTL_MS = 60 * 60 * 1000;
const avatarMemo = new Map<string, { url: string; expiresAt: number }>();

export async function getGithubUserAvatar(
	username: string,
): Promise<string | null> {
	const memoized = avatarMemo.get(username);
	if (memoized && memoized.expiresAt > Date.now()) {
		return memoized.url;
	}

	const url = await resolveGithubUserAvatar(username);
	avatarMemo.set(username, {
		url,
		expiresAt: Date.now() + AVATAR_MEMO_TTL_MS,
	});

	return url;
}

async function resolveGithubUserAvatar(username: string): Promise<string> {
	try {
		const cached = await withTimeout(
			corsair.github.db.users.search({
				data: {
					login: username,
				},
				limit: 1,
			}),
			[],
		);

		const cachedAvatar = cached[0]?.data.avatarUrl;
		if (cachedAvatar) {
			return cachedAvatar;
		}

		const user = await withTimeout(
			corsair.github.api.users.get({ username }),
			null,
		);
		return user?.avatarUrl ?? getGithubAvatarFallbackUrl(username);
	} catch {
		// Avatar lookup is best-effort; never let it break the page.
		return getGithubAvatarFallbackUrl(username);
	}
}

/**
 * Bulk avatar resolution for list pages. Goes straight to the public
 * CDN URLs: per-username corsair lookups are fine for a single user
 * (the signed-in header avatar above) but issue one query + one API
 * call per username, which exhausts the pool on 50-row pages.
 */
export async function getGithubUserAvatars(
	usernames: string[],
): Promise<Map<string, string>> {
	const avatars = new Map<string, string>();
	for (const username of new Set(usernames)) {
		if (username) {
			avatars.set(username, getGithubAvatarFallbackUrl(username));
		}
	}

	return avatars;
}
