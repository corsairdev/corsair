import { corsair } from './corsair';

const AVATAR_LOOKUP_TIMEOUT_MS = 2_000;

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((resolve) =>
			setTimeout(() => resolve(fallback), AVATAR_LOOKUP_TIMEOUT_MS),
		),
	]);
}

export async function getGithubUserAvatar(
	username: string,
): Promise<string | null> {
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
		return user?.avatarUrl ?? null;
	} catch {
		// Avatar lookup is best-effort; never let it break the page.
		return null;
	}
}

export async function getGithubUserAvatars(
	usernames: string[],
): Promise<Map<string, string>> {
	const unique = [...new Set(usernames.filter(Boolean))];
	const entries = await Promise.all(
		unique.map(async (username) => {
			const avatarUrl = await getGithubUserAvatar(username);
			return [username, avatarUrl] as const;
		}),
	);

	const avatars = new Map<string, string>();
	for (const [username, avatarUrl] of entries) {
		if (avatarUrl) {
			avatars.set(username, avatarUrl);
		}
	}

	return avatars;
}
