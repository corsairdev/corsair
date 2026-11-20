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
 * Persona posts each webhook's events to one endpoint, so this plugin
 * registers a single webhook and reports the event type in its result.
 * Deliveries carry their signature in the Persona-Signature header, over
 * the raw body, keyed with the webhook's signing secret (rotate it with
 * webhooks.rotateSecret and store the new value).
 * https://docs.withpersona.com/docs/webhooks
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
			eventType: parsed.data.type,
			resourceId: parsed.data.data?.id ?? undefined,
		});

		return { success: true, data: parsed.data };
	},
};
