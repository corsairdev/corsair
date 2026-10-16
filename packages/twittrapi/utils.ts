import type { TwittrApiTweet, TwittrApiUser } from './schema/database';

// PluginDb mirrors the subset of the Corsair plugin ORM used here. The entity
// clients are typed loosely (Promise<unknown>) because the ORM resolves table
// clients dynamically per entity and no narrower static type is available.
type PluginDb = {
	tweets?: {
		upsertByEntityId: (
			id: string,
			data: TwittrApiTweet,
		) => Promise<{ id?: string } | undefined>;
	};
	users?: {
		upsertByEntityId: (id: string, data: TwittrApiUser) => Promise<unknown>;
	};
};

/**
 * Upserts a simple-format tweet plus its embedded author. The simple format
 * already returns flat camelCase objects, so no field mapping is needed —
 * only the author is split out into the users table.
 */
export async function persistTweetWithAuthor(
	tweet: TwittrApiTweet,
	db: PluginDb,
): Promise<{ id?: string } | undefined> {
	const { author, ...rest } = tweet;

	if (author && db.users) {
		try {
			await db.users.upsertByEntityId(author.id, author);
		} catch {
			// Persistence is best-effort; the API response is still returned.
		}
	}

	if (db.tweets) {
		const stored = { ...rest, author: author ?? null } as TwittrApiTweet;
		return db.tweets.upsertByEntityId(tweet.id, stored);
	}

	return undefined;
}

export async function persistUsers(
	users: TwittrApiUser[],
	db: PluginDb,
): Promise<void> {
	if (!db.users) return;
	for (const user of users) {
		try {
			await db.users.upsertByEntityId(user.id, user);
		} catch {
			// best-effort
		}
	}
}
