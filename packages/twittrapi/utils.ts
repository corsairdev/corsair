import type { TwittrApiTweet, TwittrApiUser } from './schema/database';

// PluginDb mirrors the subset of the Corsair plugin ORM used here.
// Loose typings are intentional: the ORM resolves table clients dynamically
// per entity, so no narrower static type is feasible for these slots.
type PluginDb = {
	tweets?: {
		upsertByEntityId: (
			id: string,
			data: TwittrApiTweet,
		) => Promise<{ id?: string } | undefined>;
	};
	users?: {
		// Promise<unknown>: the ORM resolves table clients dynamically per
		// entity, so a narrower static return type is not feasible here.
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

/** Iterate a page payload safely: non-array bodies are treated as empty. */
export function asArray<T>(value: T[] | null | undefined): T[] {
	return Array.isArray(value) ? value : [];
}

export async function persistUsers(
	// unknown: callers pass typed arrays, but a malformed provider body must
	// degrade to a no-op; the runtime Array.isArray guard below is the check,
	// so a static array type would be a lie and is not feasible here.
	users: unknown,
	db: PluginDb,
): Promise<void> {
	// Guarded: persistence is best-effort and must never fail the request.
	if (!db.users || !Array.isArray(users)) return;
	for (const user of users) {
		try {
			await db.users.upsertByEntityId(user.id, user);
		} catch {
			// best-effort
		}
	}
}
