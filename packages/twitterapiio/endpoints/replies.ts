import { logEventFromContext } from 'corsair/core';
import { makeTwitterApiIORequest } from '../client';
import type { TwitterApiIOEndpoints } from '../index';
import { persistReplyWithAuthor } from '../utils';
import type { TwitterApiIOEndpointOutputs } from './types';

export const get: TwitterApiIOEndpoints['repliesGet'] = async (ctx, input) => {
	const { tweetId, sinceTime, untilTime, cursor } = input;
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['repliesGet']
	>('/twitter/tweet/replies', ctx.key, {
		method: 'GET',
		query: { tweetId, sinceTime, untilTime, cursor },
	});

	if (response.replies) {
		try {
			for (const reply of response.replies) {
				await persistReplyWithAuthor(reply, ctx.db);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save replies to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.replies.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getV2: TwitterApiIOEndpoints['repliesGetV2'] = async (
	ctx,
	input,
) => {
	const { tweetId, queryType, cursor } = input;
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['repliesGetV2']
	>('/twitter/tweet/replies_v2', ctx.key, {
		method: 'GET',
		query: { tweetId, queryType, cursor },
	});

	if (response.replies) {
		try {
			for (const reply of response.replies) {
				await persistReplyWithAuthor(reply, ctx.db);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save replies to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.replies.getV2',
		{ ...input },
		'completed',
	);
	return response;
};
