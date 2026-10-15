import { logEventFromContext } from 'corsair/core';
import type { TwittrApiWebhooks } from '../index';
import { persistTweetWithAuthor } from '../utils';
import { createTwittrApiMatch, verifyTwittrApiWebhookSignature } from './types';

export const tweet: TwittrApiWebhooks['tweet'] = {
	match: createTwittrApiMatch('tweet'),

	handler: async (ctx, request) => {
		const verification = verifyTwittrApiWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook signature verification failed',
			};
		}

		const event = request.payload as import('./types').TwittrApiTweetEvent;

		if (event.event !== 'tweet') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (event.tweet && !('unavailable' in event.tweet)) {
			try {
				const entity = await persistTweetWithAuthor(event.tweet, ctx.db);
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('[twittrapi] Failed to save tweet to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'twittrapi.webhook.tweet',
			{ tweetId: event.tweetId, monitoredUserId: event.monitoredUserId },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const test: TwittrApiWebhooks['test'] = {
	match: createTwittrApiMatch('test'),

	handler: async (ctx, request) => {
		const verification = verifyTwittrApiWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook signature verification failed',
			};
		}

		const event = request.payload as import('./types').TwittrApiTestEvent;

		if (event.event !== 'test') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'twittrapi.webhook.test',
			{ deliveryId: event.id },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
