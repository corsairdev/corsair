import { logEventFromContext } from 'corsair/core';
import type { TwittrApiContext, TwittrApiWebhooks } from '../index';
import { TwittrApiMonitorEvent } from '../schema/database';
import { persistTweetWithAuthor } from '../utils';
import { createTwittrApiMatch, verifyTwittrApiWebhookSignature } from './types';

// TwittrAPI retries a delivery with the same X-TwittrAPI-Delivery id (== event
// id) until the endpoint answers 2xx. Guard on the monitorEvents store so a
// retry returns success without persisting or logging twice. Best-effort: if
// the store is unavailable the event is processed normally.
export async function alreadyDelivered(
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

export async function recordDelivery(
	db: TwittrApiContext['db'],
	// unknown: deliveries arrive as raw provider JSON of varying shapes (full
	// tweet events or minimal test events); no static type fits, so
	// safeParse below is the validation and stricter typing is not feasible.
	event: unknown,
): Promise<void> {
	// Test events carry only {event, id}; fall back to empty strings so the
	// delivery id is still recorded and retries dedupe instead of re-logging.
	const shape =
		typeof event === 'object' && event !== null
			? (event as Record<string, unknown>)
			: {};
	const parsed = TwittrApiMonitorEvent.safeParse({
		event: 'tweet',
		id: '',
		monitoredUserId: '',
		tweetId: '',
		tweetCreatedAt: '',
		detectedAt: '',
		...shape,
	});
	if (!parsed.success || !parsed.data.id) return;
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

		// Narrowed after match(): the matcher already confirmed event === 'tweet'.
		const event = request.payload as import('./types').TwittrApiTweetEvent;

		if (event.event !== 'tweet') {
			return { success: true, data: undefined };
		}

		if (await alreadyDelivered(ctx.db, event.id)) {
			// Already handled: ack without re-running webhookHooks.after.
			// processWebhook answers 2xx regardless of this flag, so the
			// provider stops retrying while downstream hooks fire only once.
			return { success: false, statusCode: 200, data: event };
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

		// Narrowed after match(): the matcher already confirmed event === 'test'.
		const event = request.payload as import('./types').TwittrApiTestEvent;

		if (event.event !== 'test') {
			return { success: true, data: undefined };
		}

		if (await alreadyDelivered(ctx.db, event.id)) {
			// Same duplicate-hook protection as the tweet handler above.
			return { success: false, statusCode: 200, data: event };
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
