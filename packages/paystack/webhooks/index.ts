import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PaystackContext } from '..';
import type { PaystackWebhookPayload } from './types';
import {
	matchPaystackEvent,
	PaystackWebhookPayloadSchema,
	verifyPaystackWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: PaystackContext,
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
 * Paystack posts each account's events to one endpoint, so this plugin
 * registers a single webhook and reports the event type in its result.
 * Deliveries are signed under the legacy x-paystack-signature scheme (HMAC
 * SHA-512 of the raw body with the secret key) or the current
 * Paystack-Signature scheme (timestamped, keyed with the whsec_ signing
 * secret); pass the matching secret as webhookSecret.
 * https://paystack.com/docs/payments/webhooks/
 */
export const event: CorsairWebhook<
	PaystackContext,
	PaystackWebhookPayload,
	PaystackWebhookPayload
> = {
	match: matchPaystackEvent,
	handler: async (ctx, request) => {
		const verification = verifyPaystackWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = PaystackWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Paystack webhook payload',
			};
		}

		await safeLog(ctx, 'paystack.webhook.event', {
			event: parsed.data.event,
		});

		return { success: true, data: parsed.data };
	},
};
