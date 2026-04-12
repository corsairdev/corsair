import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditGlobalRequest } from '../client';
import { PostDataSchema, SubredditDataSchema } from './types';

type RedditListingResponse = {
	kind: 'Listing';
	data: {
		modhash: string | null;
		dist: number | null;
		after: string | null;
		before: string | null;
		children: Array<{
			kind: string;
			data: Record<string, any>;
		}>;
	};
};

export const getAllFeed: RedditEndpoints['feedsGetAll'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditGlobalRequest<RedditListingResponse>(
		'/r/all.json',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
			},
		},
	);

	const posts = raw.data.children
		.filter((child) => child.kind === 't3')
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
	const raw = await makeRedditGlobalRequest<RedditListingResponse>(
		'/r/popular.json',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
			},
		},
	);

	const posts = raw.data.children
		.filter((child) => child.kind === 't3')
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
		const raw = await makeRedditGlobalRequest<RedditListingResponse>(
			'/subreddits/popular.json',
			{
				query: {
					limit: input.limit,
					after: input.after,
					before: input.before,
					count: input.count,
				},
			},
		);

		const subreddits = raw.data.children
			.filter((child) => child.kind === 't5')
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
		const raw = await makeRedditGlobalRequest<RedditListingResponse>(
			'/subreddits/new.json',
			{
				query: {
					limit: input.limit,
					after: input.after,
					before: input.before,
					count: input.count,
				},
			},
		);

		const subreddits = raw.data.children
			.filter((child) => child.kind === 't5')
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
