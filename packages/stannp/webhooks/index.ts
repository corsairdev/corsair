import type { CorsairWebhook, CorsairWebhookMatcher } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { StannpContext } from '..';
import type { StannpWebhookPayload } from './types';
import {
	createStannpMatch,
	StannpWebhookEventSchemas as Schemas,
	verifyStannpWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

// A logging failure does not fail the delivery.
async function safeLog(ctx: StannpContext, event: string, fields: LogFields) {
	try {
		await logEventFromContext(ctx, event, fields, 'completed');
	} catch (error) {
		console.warn(`Failed to log ${event}:`, error);
	}
}

// unknown: the objects array rides under one of three documented keys
// (mailpieces, campaigns or events) chosen by the event type.
function extractObjects(payload: StannpWebhookPayload): unknown[] {
	for (const key of ['mailpieces', 'campaigns', 'events'] as const) {
		const value = payload[key];
		if (Array.isArray(value)) return value;
	}
	return [];
}

/**
 * One handler per Corsair webhook path: verify the signature, parse the
 * payload, log ids only (mailpiece payloads carry addresses) and return the
 * event. A definitively bad signature answers 401 through `success: false`,
 * which core reports to the sender with that status.
 */
function handlerFor<S extends z.ZodType<StannpWebhookPayload>>(
	path: string,
	schema: S,
	match: CorsairWebhookMatcher,
): CorsairWebhook<StannpContext, StannpWebhookPayload, z.output<S>> {
	return {
		match,
		handler: async (ctx, request) => {
			const verification = verifyStannpWebhook(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Webhook verification failed',
				};
			}

			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid Stannp ${path} payload`,
				};
			}

			const data = parsed.data;
			await safeLog(ctx, `stannp.webhook.${path}`, {
				event: data.event,
				webhookId: data.webhook_id ?? undefined,
				retries: data.retries ?? undefined,
				count: extractObjects(data).length,
			});

			return { success: true, data };
		},
	};
}

export const testUrl = handlerFor(
	'webhooks.testUrl',
	Schemas.testUrl,
	createStannpMatch(['test_url']),
);

export const mailpieceStatus = handlerFor(
	'mailpieces.status',
	Schemas.mailpieceStatus,
	createStannpMatch(['mailpiece_status']),
);

export const campaignStatus = handlerFor(
	'campaigns.status',
	Schemas.campaignStatus,
	createStannpMatch(['campaign_status']),
);

export const recipientEvents = handlerFor(
	'events.created',
	Schemas.recipientEvents,
	createStannpMatch(['recipient_events']),
);
