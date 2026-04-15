import { CommentDataSchema, PostDataSchema, SubredditDataSchema } from './types';
import type { RedditListingRaw } from './types';

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
