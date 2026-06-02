import { logEventFromContext } from 'corsair/core';
import { makeRedditRequest } from '../client';
import type { RedditEndpoints } from '../index';
import type { RedditListingRaw } from './types';
import {
	extractPosts,
	extractSubreddits,
	savePostsToDb,
	saveSubredditsToDb,
} from './utils';

export const getAllFeed: RedditEndpoints['feedsGetAll'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditListingRaw>('/r/all.json', {
		query: input,
	});

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.feeds.getAll',
		{ ...input },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const getPopularFeed: RedditEndpoints['feedsGetPopular'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditListingRaw>('/r/popular.json', {
		query: input,
	});

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.feeds.getPopular',
		{ ...input },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const getSubredditsPopular: RedditEndpoints['listingsSubredditsPopular'] =
	async (ctx, input) => {
		const raw = await makeRedditRequest<RedditListingRaw>(
			'/subreddits/popular.json',
			{
				query: input,
			},
		);

		const subreddits = extractSubreddits(raw);
		await saveSubredditsToDb(ctx, subreddits);

		await logEventFromContext(
			ctx,
			'reddit.listings.subredditsPopular',
			{ ...input },
			'completed',
		);

		return {
			subreddits,
			after: raw.data.after,
			before: raw.data.before,
			dist: raw.data.dist ?? subreddits.length,
		};
	};

export const getSubredditsNew: RedditEndpoints['listingsSubredditsNew'] =
	async (ctx, input) => {
		const raw = await makeRedditRequest<RedditListingRaw>(
			'/subreddits/new.json',
			{
				query: input,
			},
		);

		const subreddits = extractSubreddits(raw);
		await saveSubredditsToDb(ctx, subreddits);

		await logEventFromContext(
			ctx,
			'reddit.listings.subredditsNew',
			{ ...input },
			'completed',
		);

		return {
			subreddits,
			after: raw.data.after,
			before: raw.data.before,
			dist: raw.data.dist ?? subreddits.length,
		};
	};
