import { logEventFromContext } from '../../utils/events';
import type { TwitterApiIOWebhooks } from '..';
import { persistTweetWithAuthor } from '../utils';
import {
	createTwitterApiIOMatch,
	verifyTwitterApiIOWebhookSignature,
} from './types';

export const tweetCreated: TwitterApiIOWebhooks['tweetCreated'] = {
	match: createTwitterApiIOMatch('tweet.created'),

	handler: async (ctx, request) => {
		const verification = verifyTwitterApiIOWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook signature verification failed',
			};
		}

		const event = request.payload as import('./types').TweetCreatedEvent;

		if (event.type !== 'tweet.created') {
			return { success: true, data: undefined };
		}

		const tweet = event.data.tweet;

		console.log('[twitterapiio] Tweet created event:', {
			tweetId: tweet.id,
			userId: event.userId,
			text: tweet.text?.slice(0, 80),
		});

		let corsairEntityId = '';

		if (tweet.id) {
			try {
				const entity = await persistTweetWithAuthor(tweet, ctx.db);
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('[twitterapiio] Failed to save tweet to database:', error);
			}
		}

		if (event.data.user && ctx.db.users) {
			try {
				await ctx.db.users.upsertByEntityId(
					event.data.user.id,
					event.data.user,
				);
			} catch (error) {
				console.warn('[twitterapiio] Failed to save user to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.webhook.tweetCreated',
			{ tweetId: tweet.id, userId: event.userId },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const tweetFilterMatch: TwitterApiIOWebhooks['tweetFilterMatch'] = {
	match: createTwitterApiIOMatch('tweet.filter_match'),

	handler: async (ctx, request) => {
		const verification = verifyTwitterApiIOWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook signature verification failed',
			};
		}

		const event = request.payload as import('./types').TweetFilterMatchEvent;

		if (event.type !== 'tweet.filter_match') {
			return { success: true, data: undefined };
		}

		const tweet = event.data.tweet;

		console.log('[twitterapiio] Tweet filter match event:', {
			tweetId: tweet.id,
			matchedRules: event.data.matchedRules?.map((r) => r.tag ?? r.value),
		});

		let corsairEntityId = '';

		if (tweet.id) {
			try {
				const entity = await persistTweetWithAuthor(tweet, ctx.db);
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('[twitterapiio] Failed to save tweet to database:', error);
			}
		}

		if (event.data.user && ctx.db.users) {
			try {
				await ctx.db.users.upsertByEntityId(
					event.data.user.id,
					event.data.user,
				);
			} catch (error) {
				console.warn('[twitterapiio] Failed to save user to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.webhook.tweetFilterMatch',
			{
				tweetId: tweet.id,
				matchedRules: event.data.matchedRules,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
