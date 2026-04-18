import type { RedditContext } from '..';
import type {
	CommentData,
	PostData,
	RedditListingRaw,
	SubredditAboutData as SubredditData,
	UserAboutData as UserData,
} from './types';
import {
	CommentDataSchema,
	PostDataSchema,
	SubredditDataSchema,
} from './types';

type RedditDb = NonNullable<RedditContext['db']>;

/**
 * Minimal context for DB persistence: only `upsertByEntityId` is used. Tests can pass
 * jest mocks; full `RedditContext` remains assignable via structural typing.
 */
type RedditDbContext = {
	db?: {
		posts?: Pick<RedditDb['posts'], 'upsertByEntityId'>;
		comments?: Pick<RedditDb['comments'], 'upsertByEntityId'>;
		subreddits?: Pick<RedditDb['subreddits'], 'upsertByEntityId'>;
		users?: Pick<RedditDb['users'], 'upsertByEntityId'>;
	};
};

/**
 * Reddit "thing" type prefixes (used in `kind` fields within listings):
 * t1 = comment
 * t2 = account
 * t3 = link (post)
 * t4 = message
 * t5 = subreddit
 * t6 = award
 */

export function extractPosts(raw: RedditListingRaw) {
	return raw.data.children
		.filter((child) => child.kind === 't3')
		.map((child) => PostDataSchema.parse(child.data));
}

export function extractComments(raw: RedditListingRaw) {
	return raw.data.children
		.filter((child) => child.kind === 't1')
		.map((child) => CommentDataSchema.parse(child.data));
}

export function extractSubreddits(raw: RedditListingRaw) {
	return raw.data.children
		.filter((child) => child.kind === 't5')
		.map((child) => SubredditDataSchema.parse(child.data));
}

// Testing Utilities
export const TEST_SUBREDDIT = process.env.TEST_REDDIT_SUBREDDIT ?? 'javascript';
export const TEST_USERNAME = process.env.TEST_REDDIT_USERNAME ?? 'spez';

export async function savePostsToDb(ctx: RedditDbContext, posts: PostData[]) {
	if (!ctx.db?.posts) return;
	for (const post of posts) {
		try {
			await ctx.db.posts.upsertByEntityId(String(post.id), { ...post });
		} catch (error) {
			console.warn('Failed to save post to database:', error);
		}
	}
}

export async function saveCommentsToDb(ctx: RedditDbContext, comments: CommentData[]) {
	if (!ctx.db?.comments) return;
	for (const comment of comments) {
		try {
			await ctx.db.comments.upsertByEntityId(String(comment.id), {
				...comment,
			});
		} catch (error) {
			console.warn('Failed to save comments to database:', error);
		}
	}
}

export async function saveSubredditsToDb(
	ctx: RedditDbContext,
	subreddits: SubredditData[],
) {
	if (!ctx.db?.subreddits) return;
	for (const subreddit of subreddits) {
		try {
			await ctx.db.subreddits.upsertByEntityId(String(subreddit.id), {
				...subreddit,
			});
		} catch (error) {
			console.warn('Failed to save subreddit to database:', error);
		}
	}
}

export async function saveUserToDb(ctx: RedditDbContext, user: UserData) {
	if (!ctx.db?.users) return;
	try {
		await ctx.db.users.upsertByEntityId(String(user.id), { ...user });
	} catch (error) {
		console.warn('Failed to save user to database:', error);
	}
}
