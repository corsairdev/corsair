import { corsair } from './corsair';

export async function getGithubUserAvatar(
	username: string,
): Promise<string | null> {
	const cached = await corsair.github.db.users.search({
		data: {
			lowercaseUsername: username.toLowerCase(),
		},
		limit: 1,
	});

	const cachedAvatar = cached[0]?.data.avatarUrl;
	if (cachedAvatar) {
		return cachedAvatar;
	}

	try {
		const user = await corsair.github.api.users.get({ username });
		return user.avatarUrl ?? null;
	} catch {
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
