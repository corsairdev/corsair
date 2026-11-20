import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ParsioContext } from '..';
import type { ParsioWebhookPayload } from './types';
import {
	matchParsioWebhook,
	ParsioWebhookPayloadSchema,
	verifyParsioWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: ParsioContext,
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
 * Parsio posts each webhook's documents to one endpoint, so this plugin
 * registers a single webhook and reports the document in its result.
 * Deliveries carry their signature in the parsio-signature header, over the
 * raw payload, keyed with the signing secret Parsio generated for the
 * webhook.
 * https://help.parsio.io/data-export-integrations/send-data-to-webhook-1
 */
export const event: CorsairWebhook<
	ParsioContext,
	ParsioWebhookPayload,
	ParsioWebhookPayload
> = {
	match: matchParsioWebhook,
	handler: async (ctx, request) => {
		const verification = verifyParsioWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = ParsioWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Parsio webhook payload',
			};
		}

		await safeLog(ctx, 'parsio.webhook.event', {
			documentId: parsed.data.doc_id,
			status: parsed.data.status,
		});

		return { success: true, data: parsed.data };
	},
};
