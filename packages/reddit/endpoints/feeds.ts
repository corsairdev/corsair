import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditRequest } from '../client';
import { PostDataSchema, SubredditDataSchema } from './types';
import type { RedditListingRaw } from './types';

export const getAllFeed: RedditEndpoints['feedsGetAll'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditListingRaw>('/r/all.json', {
		query: input,
	});

	const posts = raw.data.children
		.filter((child) => child.kind === 't3') // t3 = link/post
		.map((child) => PostDataSchema.parse(child.data));

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

	const posts = raw.data.children
		.filter((child) => child.kind === 't3') // t3 = link/post
		.map((child) => PostDataSchema.parse(child.data));

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

		const subreddits = raw.data.children
			.filter((child) => child.kind === 't5') // t5 = subreddit
			.map((child) => SubredditDataSchema.parse(child.data));

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

		const subreddits = raw.data.children
			.filter((child) => child.kind === 't5') // t5 = subreddit
			.map((child) => SubredditDataSchema.parse(child.data));

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
