import { logEventFromContext } from 'corsair/core';
import { makeTwittrApiRequest } from '../client';
import type { TwittrApiEndpoints } from '../index';
import { asArray, persistTweetWithAuthor, persistUsers } from '../utils';
import type { TwittrApiEndpointOutputs } from './types';

export const getDetails: TwittrApiEndpoints['listsGetDetails'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['listsGetDetails']
	>('/lists/details', ctx.key, {
		method: 'GET',
		query: { listId: input.listId, format: 'simple' },
	});

	if (response.data && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(response.data.id, response.data);
		} catch {
			// best-effort
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.lists.getDetails',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTweets: TwittrApiEndpoints['listsGetTweets'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['listsGetTweets']
	>('/lists/tweets', ctx.key, {
		method: 'GET',
		query: {
			listId: input.listId,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	for (const tweet of asArray(response.data)) {
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
		'twittrapi.lists.getTweets',
		{ ...input },
		'completed',
	);
	return response;
};

export const getMembers: TwittrApiEndpoints['listsGetMembers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['listsGetMembers']
	>('/lists/members', ctx.key, {
		method: 'GET',
		query: {
			listId: input.listId,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.lists.getMembers',
		{ ...input },
		'completed',
	);
	return response;
};

export const getFollowers: TwittrApiEndpoints['listsGetFollowers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['listsGetFollowers']
	>('/lists/followers', ctx.key, {
		method: 'GET',
		query: {
			listId: input.listId,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.lists.getFollowers',
		{ ...input },
		'completed',
	);
	return response;
};
