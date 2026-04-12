import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import {
	makeRedditGlobalRequest,
	makeRedditSubredditRequest,
} from '../client';
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

export const searchGlobal: RedditEndpoints['searchGlobal'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditGlobalRequest<RedditListingResponse>(
		'/search.json',
		{
			query: {
				q: input.q,
				sort: input.sort,
				t: input.t,
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
				restrict_sr: input.restrict_sr,
				sr_name: input.sr_name,
				type: input.type,
			},
		},
	);

	const posts = raw.data.children
		.filter((child) => child.kind === 't3')
		.map((child) => PostDataSchema.parse(child.data));

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
	const raw = await makeRedditSubredditRequest<RedditListingResponse>(
		input.subreddit,
		'search',
		{
			query: {
				q: input.q,
				sort: input.sort,
				t: input.t,
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
				restrict_sr: true,
			},
		},
	);

	const posts = raw.data.children
		.filter((child) => child.kind === 't3')
		.map((child) => PostDataSchema.parse(child.data));

	await logEventFromContext(
		ctx,
		'reddit.search.subreddit',
		{ subreddit: input.subreddit, q: input.q },
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
	const raw = await makeRedditGlobalRequest<RedditListingResponse>(
		'/subreddits/search.json',
		{
			query: {
				q: input.q,
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
