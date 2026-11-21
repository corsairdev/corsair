import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PersonaContext } from '..';
import type { PersonaWebhookPayload } from './types';
import {
	matchPersonaWebhook,
	PersonaWebhookPayloadSchema,
	verifyPersonaWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: PersonaContext,
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
 * Persona posts each webhook's events to one URL, so this plugin registers
 * a single webhook and reports the event name in its result. Deliveries are
 * signed in the Persona-Signature header with the webhook's secret (returned
 * by webhooks.create and webhooks.rotateSecret; store it with
 * keys.set_webhook_signature).
 * https://docs.withpersona.com/webhooks-best-practices
 */
export const event: CorsairWebhook<
	PersonaContext,
	PersonaWebhookPayload,
	PersonaWebhookPayload
> = {
	match: matchPersonaWebhook,
	handler: async (ctx, request) => {
		const verification = verifyPersonaWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = PersonaWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Persona webhook payload',
			};
		}

		await safeLog(ctx, 'persona.webhook.event', {
			eventType: parsed.data.data.attributes.name,
			eventId: parsed.data.data.id,
		});

		return { success: true, data: parsed.data };
	},
};
