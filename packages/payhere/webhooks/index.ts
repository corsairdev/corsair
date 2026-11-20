import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PayhereContext } from '..';
import type { PayhereWebhookPayload } from './types';
import {
	matchPayhereWebhook,
	PayhereWebhookPayloadSchema,
	verifyPayhereWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: PayhereContext,
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
 * Payhere posts each account's events to one endpoint, so this plugin
 * registers a single webhook and reports the event type in its result.
 * Deliveries carry their signature in the X-Signature header (HMAC-SHA1 hex
 * over the raw body with the account's shared secret).
 * https://developers.payhere.co/docs/webhooks
 */
export const event: CorsairWebhook<
	PayhereContext,
	PayhereWebhookPayload,
	PayhereWebhookPayload
> = {
	match: matchPayhereWebhook,
	handler: async (ctx, request) => {
		const verification = verifyPayhereWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = PayhereWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Payhere webhook payload',
			};
		}

		await safeLog(ctx, 'payhere.webhook.event', {
			event: parsed.data.event,
		});

		return { success: true, data: parsed.data };
	},
};
