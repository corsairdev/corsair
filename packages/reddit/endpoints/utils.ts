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
	for (const post of posts) {
		try {
			await ctx.db.posts.upsertByEntityId(String(post.id), { ...post });
		} catch (error) {
			console.warn('Failed to save post to database:', error);
		}
	}
}

export async function saveCommentsToDb(ctx: any, comments: CommentData[]) {
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
	ctx: any,
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

export async function saveUserToDb(ctx: any, user: UserData) {
	if (!ctx.db?.users) return;
	try {
		await ctx.db.users.upsertByEntityId(String(user.id), { ...user });
	} catch (error) {
		console.warn('Failed to save user to database:', error);
	}
}
