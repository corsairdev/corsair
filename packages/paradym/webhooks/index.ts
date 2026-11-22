import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ParadymContext } from '..';
import type { ParadymWebhookPayload } from './types';
import {
	matchParadymWebhook,
	ParadymWebhookPayloadSchema,
	verifyParadymWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: ParadymContext,
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
 * Paradym posts each wallet subscription's events to one endpoint, so this
 * plugin registers a single webhook and reports the event type in its
 * result. Deliveries carry their signature in the X-Paradym-HMAC-SHA-256
 * header, over the raw body, keyed with the subscription secret.
 * https://docs.paradym.id/api-and-dashboard/using-webhooks
 */
export const event: CorsairWebhook<
	ParadymContext,
	ParadymWebhookPayload,
	ParadymWebhookPayload
> = {
	match: matchParadymWebhook,
	handler: async (ctx, request) => {
		const verification = verifyParadymWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = ParadymWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Paradym webhook payload',
			};
		}

		await safeLog(ctx, 'paradym.webhook.event', {
			eventType: parsed.data.eventType,
			webhookId: parsed.data.webhookId,
			walletId: parsed.data.walletId,
			publishedAt: parsed.data.webhookPublishedAt,
		});

		return { success: true, data: parsed.data };
	},
};
