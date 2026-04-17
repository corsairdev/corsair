import { CommentDataSchema, PostDataSchema, SubredditDataSchema } from './types';
import type { RedditListingRaw, PostData, CommentData, SubredditAboutData as SubredditData, UserAboutData as UserData } from './types';

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

export async function savePostsToDb(ctx: any, posts: PostData[]) {
	if (!ctx.db?.posts) return;
	try {
		for (const post of posts) {
			await ctx.db.posts.upsertByEntityId(String(post.id), { ...post });
		}
	} catch (error) {
		console.warn('Failed to save posts to database:', error);
	}
}

export async function saveCommentsToDb(ctx: any, comments: CommentData[]) {
	if (!ctx.db?.comments) return;
	try {
		for (const comment of comments) {
			await ctx.db.comments.upsertByEntityId(String(comment.id), {
				...comment,
			});
		}
	} catch (error) {
		console.warn('Failed to save comments to database:', error);
	}
}

export async function saveSubredditsToDb(
	ctx: any,
	subreddits: SubredditData[],
) {
	if (!ctx.db?.subreddits) return;
	try {
		for (const subreddit of subreddits) {
			await ctx.db.subreddits.upsertByEntityId(String(subreddit.id), {
				...subreddit,
			});
		}
	} catch (error) {
		console.warn('Failed to save subreddits to database:', error);
	}
}

export async function saveUserToDb(ctx: any, user: UserData) {
	if (!ctx.db?.users) return;
	try {
		await ctx.db.users.upsertByEntityId(String(user.id), { ...user });
	} catch (error) {
		console.warn('Failed to save user to database:', error);
	}
}
