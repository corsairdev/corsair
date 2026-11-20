import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PenpotContext } from '..';
import type { PenpotWebhookPayload } from './types';
import {
	matchPenpotWebhook,
	PenpotWebhookPayloadSchema,
	verifyPenpotWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: PenpotContext,
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
 * Penpot posts each team webhook's events to one endpoint, so this plugin
 * registers a single webhook and reports the event type in its result.
 * Penpot documents no signature scheme for these deliveries; the handler
 * accepts them on the documented envelope shape and the overview says so
 * plainly.
 * https://help.penpot.app/technical-guide/integration/#webhooks
 */
export const event: CorsairWebhook<
	PenpotContext,
	PenpotWebhookPayload,
	PenpotWebhookPayload
> = {
	match: matchPenpotWebhook,
	handler: async (ctx, request) => {
		const verification = verifyPenpotWebhook(request);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 400,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = PenpotWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Penpot webhook payload',
			};
		}

		await safeLog(ctx, 'penpot.webhook.event', {
			event: parsed.data.event,
		});

		return { success: true, data: parsed.data };
	},
};
