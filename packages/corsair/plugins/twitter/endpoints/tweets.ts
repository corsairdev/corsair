import { logEventFromContext } from '../../utils/events';
import type { TwitterEndpoints } from '..';
import { makeTwitterRequest } from '../client';
import type { TwitterEndpointOutputs } from './types';

export const create: TwitterEndpoints['tweetsCreate'] = async (ctx, input) => {
	const { text, quoteTweetId, mediaIds, replySettings } = input;

	const response = await makeTwitterRequest<
		TwitterEndpointOutputs['tweetsCreate']
	>('/2/tweets', ctx.key, {
		method: 'POST',
		body: {
			text,
			...(quoteTweetId ? { quote_tweet_id: quoteTweetId } : {}),
			...(mediaIds ? { media: { media_ids: mediaIds } } : {}),
			...(replySettings ? { reply_settings: replySettings } : {}),
		},
	});

	if (response.data?.id && ctx.db.tweets) {
		try {
			await ctx.db.tweets.upsertByEntityId(response.data.id, {
				id: response.data.id,
				text: response.data.text,
			});
		} catch (error) {
			console.warn('[twitter] Failed to save tweet to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitter.tweets.create',
		{ text },
		'completed',
	);
	return response;
};

export const createReply: TwitterEndpoints['tweetsCreateReply'] = async (
	ctx,
	input,
) => {
	const { text, inReplyToTweetId, excludeReplyUserIds } = input;

	const response = await makeTwitterRequest<
		TwitterEndpointOutputs['tweetsCreateReply']
	>('/2/tweets', ctx.key, {
		method: 'POST',
		body: {
			text,
			reply: {
				in_reply_to_tweet_id: inReplyToTweetId,
				...(excludeReplyUserIds
					? { exclude_reply_user_ids: excludeReplyUserIds }
					: {}),
			},
		},
	});

	if (response.data?.id && ctx.db.tweets) {
		try {
			await ctx.db.tweets.upsertByEntityId(response.data.id, {
				id: response.data.id,
				text: response.data.text,
				referencedTweets: [{ type: 'replied_to', id: inReplyToTweetId }],
			});
		} catch (error) {
			console.warn('[twitter] Failed to save reply tweet to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitter.tweets.createReply',
		{ text, inReplyToTweetId },
		'completed',
	);
	return response;
};
