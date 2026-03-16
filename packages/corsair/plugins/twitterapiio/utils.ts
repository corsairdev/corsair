import type { RawApiTweet, TwitterApiIOTweet, TwitterApiIOUser } from './schema/database';

type PluginDb = {
	tweets?: {
		upsertByEntityId: (id: string, data: TwitterApiIOTweet) => Promise<{ id?: string } | undefined>;
	};
	users?: {
		upsertByEntityId: (id: string, data: TwitterApiIOUser) => Promise<unknown>;
	};
};

/**
 * Extracts the embedded author from a raw API tweet, upserts the author to the
 * users table, and upserts the tweet with `author` replaced by the Twitter user
 * ID string. Returns the persisted tweet entity (for callers that need the
 * internal Corsair entity id).
 */
export async function persistTweetWithAuthor(
	tweet: RawApiTweet,
	db: PluginDb,
): Promise<{ id?: string } | undefined> {
	const { author, ...tweetData } = tweet;

	if (author && db.users) {
		await db.users.upsertByEntityId(author.id, author);
	}

	if (db.tweets) {
		const normalizedTweet: TwitterApiIOTweet = {
			...tweetData,
			...(author ? { author: author.id } : {}),
		};
		return db.tweets.upsertByEntityId(tweet.id, normalizedTweet);
	}

	return undefined;
}
