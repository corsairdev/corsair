import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PasscreatorContext } from '..';
import type { PasscreatorSignedData, PasscreatorWebhookPayload } from './types';
import {
	matchPasscreatorWebhook,
	PasscreatorSignedDataSchema,
	PasscreatorWebhookPayloadSchema,
	verifyPasscreatorSignature,
	verifyPasscreatorWebhookToken,
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
 * the key is not a per-account secret but a platform key. Because that key
 * is shared by every Passcreator account, each delivery URL also carries a
 * per-account token (see verifyPasscreatorWebhookToken).
 * https://developer.passcreator.com/en/webhooks/webhook-endpoints
 */
export const event: CorsairWebhook<
	PasscreatorContext,
	PasscreatorWebhookPayload,
	PasscreatorSignedData
> = {
	match: matchPasscreatorWebhook,
	handler: async (ctx, request) => {
		if (!request.hubVerified) {
			// The platform public key is not a stored secret; the handler reads
			// it from the option or the stored webhook signature slot.
			// ctx.key is what the keyBuilder resolved: the webhookSecret option
			// or the stored public key.
			const verification = verifyPasscreatorSignature(
				request.payload,
				ctx.key || undefined,
			);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Webhook verification failed',
				};
			}
		}

		// Always, even when the Hub verified the signature: the signature is
		// Passcreator's platform-wide one and does not say which account a
		// delivery belongs to; the URL token does.
		const apiKey =
			ctx.options.key || (await ctx.keys.get_api_key()) || undefined;
		const ownership = verifyPasscreatorWebhookToken(request.query, apiKey);
		if (!ownership.valid) {
			return {
				success: false,
				statusCode: 401,
				error: ownership.error ?? 'Webhook delivery token rejected',
			};
		}

		const parsed = PasscreatorWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Passcreator webhook payload',
			};
		}

		// Only signedData is authenticated, so the result is built from it,
		// not from the outer fields a sender could change.
		// unknown: JSON.parse output is untyped until PasscreatorSignedDataSchema
		// parses it just below.
		let signed: unknown;
		try {
			signed = JSON.parse(parsed.data.signedData);
		} catch {
			return {
				success: false,
				statusCode: 400,
				error: 'signedData is not JSON',
			};
		}
		const data = PasscreatorSignedDataSchema.safeParse(signed);
		if (!data.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Passcreator signed data',
			};
		}

		// No pass identifiers in the event: they identify a customer's pass.
		await safeLog(ctx, 'passcreator.webhook.event', { verified: true });

		return { success: true, data: data.data };
	},
};
