import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PiggyContext } from '..';
import type { PiggyWebhookPayload } from './types';
import {
	matchPiggyWebhook,
	PiggyWebhookPayloadSchema,
	verifyPiggyWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: PiggyContext,
	event: string,
	fields: LogFields,
): Promise<void> {
	try {
		await logEventFromContext(ctx, event, fields, 'completed');
	} catch (error) {
		console.warn(`Failed to log ${event}:`, error);
	}
}

/**
 * Piggy posts both envelope versions to the one URL set on the webhook
 * subscription, so this plugin registers a single receiver that branches
 * on `version` and reports the event type(s) in its result. Deliveries
 * carry the HMAC-SHA256 signature in the Signature header over the raw
 * body, keyed with the subscription secret. The receiver must stay
 * idempotent: retries re-send the same uuid (V1) or the whole batch
 * (V2), so callers deduplicate on the reported event uuids.
 * https://docs.leat.com/v3/oauth/webhooks
 */
export const event: CorsairWebhook<
	PiggyContext,
	PiggyWebhookPayload,
	PiggyWebhookPayload
> = {
	match: matchPiggyWebhook,
	handler: async (ctx, request) => {
		const verification = verifyPiggyWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = PiggyWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Piggy webhook payload',
			};
		}

		if (parsed.data.version === 'V1') {
			await safeLog(ctx, 'piggy.webhook.event', {
				version: 'V1',
				eventType: parsed.data.type,
				eventUuid: parsed.data.uuid,
			});
		} else {
			await safeLog(ctx, 'piggy.webhook.event', {
				version: 'V2',
				eventType: parsed.data.event_type,
				count: parsed.data.count,
				eventUuids: parsed.data.events.map((e) => e.event_uuid).join(','),
			});
		}

		return { success: true, data: parsed.data };
	},
};
