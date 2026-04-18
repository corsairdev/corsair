import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditRequest } from '../client';
import { extractPosts, extractSubreddits, savePostsToDb, saveSubredditsToDb } from './utils';
import type { RedditListingRaw } from './types';

export const searchGlobal: RedditEndpoints['searchGlobal'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditListingRaw>('/search.json', {
		query: input,
	});

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.search.global',
		{ q: input.q },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const searchSubreddit: RedditEndpoints['searchSubreddit'] = async (
	ctx,
	input,
) => {
	const { subreddit, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/r/${subreddit}/search.json`,
		{
			query: { ...query, restrict_sr: true },
		},
	);

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.search.subreddit',
		{ subreddit, q: input.q },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const searchSubreddits: RedditEndpoints['searchSubreddits'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditListingRaw>(
		'/subreddits/search.json',
		{
			query: input,
		},
	);

	const subreddits = extractSubreddits(raw);
	await saveSubredditsToDb(ctx, subreddits);

	await logEventFromContext(
		ctx,
		'reddit.search.subreddits',
		{ q: input.q },
		'completed',
	);

	return {
		subreddits,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? subreddits.length,
	};
};
