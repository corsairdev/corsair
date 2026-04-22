import { logEventFromContext } from 'corsair/core';
import { makeTwitterApiIORequest } from '../client';
import type { TwitterApiIOEndpoints } from '../index';
import { persistTweetWithAuthor } from '../utils';
import type { TwitterApiIOEndpointOutputs } from './types';

export const getFollowers: TwitterApiIOEndpoints['listsGetFollowers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['listsGetFollowers']
	>('/twitter/list/followers', ctx.key, {
		method: 'GET',
		query: { listId: input.listId, cursor: input.cursor },
	});

	if (response.users && ctx.db.users) {
		try {
			for (const user of response.users) {
				await ctx.db.users.upsertByEntityId(user.id, user);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.lists.getFollowers',
		{ ...input },
		'completed',
	);
	return response;
};

export const getMembers: TwitterApiIOEndpoints['listsGetMembers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['listsGetMembers']
	>('/twitter/list/members', ctx.key, {
		method: 'GET',
		query: { listId: input.listId, cursor: input.cursor },
	});

	if (response.users && ctx.db.users) {
		try {
			for (const user of response.users) {
				await ctx.db.users.upsertByEntityId(user.id, user);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.lists.getMembers',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTweets: TwitterApiIOEndpoints['listsGetTweets'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['listsGetTweets']
	>('/twitter/list/tweets', ctx.key, {
		method: 'GET',
		query: { listId: input.listId, cursor: input.cursor },
	});

	if (response.tweets) {
		try {
			for (const tweet of response.tweets) {
				await persistTweetWithAuthor(tweet, ctx.db);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save tweets to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.lists.getTweets',
		{ ...input },
		'completed',
	);
	return response;
};
