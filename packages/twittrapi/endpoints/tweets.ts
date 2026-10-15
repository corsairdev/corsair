import { logEventFromContext } from 'corsair/core';
import { makeTwittrApiRequest } from '../client';
import type { TwittrApiEndpoints } from '../index';
import { persistTweetWithAuthor, persistUsers } from '../utils';
import type { TwittrApiEndpointOutputs } from './types';

export const search: TwittrApiEndpoints['tweetsSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['tweetsSearch']
	>('/search', ctx.key, {
		method: 'GET',
		query: {
			searchItem: input.searchItem,
			category: input.category,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	for (const tweet of response.data ?? []) {
		if (!('unavailable' in tweet)) {
			try {
				await persistTweetWithAuthor(tweet, ctx.db);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.tweets.search',
		{ ...input },
		'completed',
	);
	return response;
};

export const getById: TwittrApiEndpoints['tweetsGetById'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['tweetsGetById']
	>(`/simpletweet/${input.tweetId}`, ctx.key, {
		method: 'GET',
		query: { format: 'simple' },
	});

	const tweet = response.data;
	if (tweet && !('unavailable' in tweet)) {
		try {
			await persistTweetWithAuthor(tweet, ctx.db);
		} catch {
			// best-effort
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.tweets.getById',
		{ ...input },
		'completed',
	);
	return response;
};

export const getReplies: TwittrApiEndpoints['tweetsGetReplies'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['tweetsGetReplies']
	>(`/tweet/${input.tweetId}`, ctx.key, {
		method: 'GET',
		query: {
			rankingMode: input.rankingMode,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	for (const tweet of response.data ?? []) {
		if (!('unavailable' in tweet)) {
			try {
				await persistTweetWithAuthor(tweet, ctx.db);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.tweets.getReplies',
		{ ...input },
		'completed',
	);
	return response;
};

export const getQuotes: TwittrApiEndpoints['tweetsGetQuotes'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['tweetsGetQuotes']
	>(`/tweet/${input.tweetId}/quotes`, ctx.key, {
		method: 'GET',
		query: { count: input.count, cursor: input.cursor, format: 'simple' },
	});

	for (const tweet of response.data ?? []) {
		if (!('unavailable' in tweet)) {
			try {
				await persistTweetWithAuthor(tweet, ctx.db);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.tweets.getQuotes',
		{ ...input },
		'completed',
	);
	return response;
};

export const getRetweeters: TwittrApiEndpoints['tweetsGetRetweeters'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['tweetsGetRetweeters']
	>(`/tweet/${input.tweetId}/retweets`, ctx.key, {
		method: 'GET',
		query: { count: input.count, cursor: input.cursor, format: 'simple' },
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.tweets.getRetweeters',
		{ ...input },
		'completed',
	);
	return response;
};

export const getLikers: TwittrApiEndpoints['tweetsGetLikers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['tweetsGetLikers']
	>(`/tweet/${input.tweetId}/favorites`, ctx.key, {
		method: 'POST',
		query: { format: 'simple' },
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.tweets.getLikers',
		{ ...input },
		'completed',
	);
	return response;
};
