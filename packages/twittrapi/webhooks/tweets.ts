import { logEventFromContext } from 'corsair/core';
import type { TwittrApiContext, TwittrApiWebhooks } from '../index';
import { TwittrApiMonitorEvent } from '../schema/database';
import { persistTweetWithAuthor } from '../utils';
import { createTwittrApiMatch, verifyTwittrApiWebhookSignature } from './types';

// TwittrAPI retries a delivery with the same X-TwittrAPI-Delivery id (== event
// id) until the endpoint answers 2xx. Guard on the monitorEvents store so a
// retry returns success without persisting or logging twice. Best-effort: if
// the store is unavailable the event is processed normally.
async function alreadyDelivered(
	db: TwittrApiContext['db'],
	eventId: string,
): Promise<boolean> {
	try {
		const existing = await db.monitorEvents?.findByEntityId(eventId);
		return existing !== null && existing !== undefined;
	} catch {
		return false;
	}
}

async function recordDelivery(
	db: TwittrApiContext['db'],
	event: unknown,
): Promise<void> {
	const parsed = TwittrApiMonitorEvent.safeParse(event);
	if (!parsed.success) return;
	try {
		await db.monitorEvents?.upsertByEntityId(parsed.data.id, parsed.data);
	} catch {
		// best-effort
	}
}

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

		if (await alreadyDelivered(ctx.db, event.id)) {
			return { success: true, data: event };
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

		await recordDelivery(ctx.db, event);

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

		if (await alreadyDelivered(ctx.db, event.id)) {
			return { success: true, data: event };
		}

		await recordDelivery(ctx.db, event);

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
