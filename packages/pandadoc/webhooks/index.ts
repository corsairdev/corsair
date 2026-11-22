import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PandadocContext } from '..';
import type { PandadocWebhookPayload } from './types';
import {
	headerValue,
	matchPandadocWebhook,
	PANDADOC_EVENT_ID_HEADER,
	PandadocWebhookPayloadSchema,
	verifyPandadocWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: PandadocContext,
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
 * PandaDoc posts each subscription's events to one endpoint, so this plugin
 * registers a single webhook and reports the delivered event names in its
 * result. Deliveries carry their signature in the `signature` query
 * parameter and a dedup id in X-PandaDoc-Webhook-Event-Id.
 * https://developers.pandadoc.com/docs/webhook-verification
 */
export const event: CorsairWebhook<
	PandadocContext,
	PandadocWebhookPayload,
	PandadocWebhookPayload
> = {
	match: matchPandadocWebhook,
	handler: async (ctx, request) => {
		const verification = verifyPandadocWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = PandadocWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid PandaDoc webhook payload',
			};
		}

		const deliveryId = headerValue(request.headers, PANDADOC_EVENT_ID_HEADER);
		await safeLog(ctx, 'pandadoc.webhook.event', {
			events: parsed.data.map((item) => item.event).join(','),
			deliveryId: deliveryId ?? undefined,
		});

		return { success: true, data: parsed.data };
	},
};
