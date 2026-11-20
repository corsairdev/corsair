import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PasscreatorContext } from '..';
import type { PasscreatorWebhookPayload } from './types';
import {
	matchPasscreatorWebhook,
	PasscreatorWebhookPayloadSchema,
	verifyPasscreatorSignature,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: PasscreatorContext,
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
 * Passcreator posts each subscription's events to one endpoint, so this
 * plugin registers a single webhook and reports the event in its result.
 * Deliveries carry their signature inside the payload (signature and
 * signedData fields, hex ECDSA), verified with the PEM public key from
 * GET /api/hook/publickey — fetched with the account key and cached, since
 * the key is not a per-account secret but a platform key.
 * https://developer.passcreator.com/en/webhooks/webhook-endpoints
 */
export const event: CorsairWebhook<
	PasscreatorContext,
	PasscreatorWebhookPayload,
	PasscreatorWebhookPayload
> = {
	match: matchPasscreatorWebhook,
	handler: async (ctx, request) => {
		if (!request.hubVerified) {
			// The platform public key is not a stored secret; the handler reads
			// it from the option or the stored webhook signature slot.
			const verification = verifyPasscreatorSignature(
				request.payload,
				(await ctx.keys.get_webhook_signature()) ?? undefined,
			);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Webhook verification failed',
				};
			}
		}

		const parsed = PasscreatorWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Passcreator webhook payload',
			};
		}

		await safeLog(ctx, 'passcreator.webhook.event', {
			event: parsed.data.event,
		});

		return { success: true, data: parsed.data };
	},
};
