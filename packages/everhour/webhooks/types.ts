import type {
	CorsairWebhook,
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
export type { WebhookRequest };

import { z } from 'zod';
import type { EverhourContext } from '../index';

export const EverhourWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	// Everhour webhook data fields are provider-defined per event; unknown
	// values must be narrowed by consumers before use.
	data: z.record(z.string(), z.unknown()),
});

export type EverhourWebhookPayload = z.infer<
	typeof EverhourWebhookPayloadSchema
>;

export const TimeUpdatedEventSchema = EverhourWebhookPayloadSchema.extend({
	type: z.literal('api:time:updated'),
	data: z
		.object({
			id: z.string(),
			task_id: z.string(),
			user_id: z.string(),
		})
		.loose(),
});

export type TimeUpdatedEvent = z.infer<typeof TimeUpdatedEventSchema>;

// All registered handlers persist the raw webhook payload, so every event
// maps to the base payload. Per-event detail lives in TimeUpdatedEventSchema
// (used by the webhook schema registry and the standalone time handler).
export type EverhourWebhookOutputs = {
	'api:time:updated': EverhourWebhookPayload;
	'api:timer:started': EverhourWebhookPayload;
	'api:timer:stopped': EverhourWebhookPayload;
	'api:project:created': EverhourWebhookPayload;
	'api:project:updated': EverhourWebhookPayload;
	'api:project:removed': EverhourWebhookPayload;
	'api:task:created': EverhourWebhookPayload;
	'api:task:updated': EverhourWebhookPayload;
	'api:task:removed': EverhourWebhookPayload;
	'api:task:recovered': EverhourWebhookPayload;
	'api:estimate:updated': EverhourWebhookPayload;
	'api:section:created': EverhourWebhookPayload;
	'api:section:updated': EverhourWebhookPayload;
	'api:section:removed': EverhourWebhookPayload;
	'api:section:recovered': EverhourWebhookPayload;
	'api:client:created': EverhourWebhookPayload;
	'api:client:updated': EverhourWebhookPayload;
	'api:invoice:created': EverhourWebhookPayload;
	'api:invoice:updated': EverhourWebhookPayload;
	'api:invoice:deleted': EverhourWebhookPayload;
};

export type EverhourWebhooks = {
	[K in keyof EverhourWebhookOutputs]: CorsairWebhook<
		EverhourContext,
		EverhourWebhookPayload,
		EverhourWebhookOutputs[K]
	>;
};

// unknown input because webhook bodies arrive untyped; narrowed to a record below.
function toStringRecord(candidate: unknown): Record<string, unknown> | null {
	if (
		candidate === null ||
		typeof candidate !== 'object' ||
		Array.isArray(candidate)
	) {
		return null;
	}
	// Copied record keeps provider fields without claiming their types.
	const record: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(candidate)) {
		record[key] = value;
	}
	return record;
}

// unknown input because raw webhook bodies arrive untyped; narrowed below.
function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			return toStringRecord(JSON.parse(body));
		} catch {
			return null;
		}
	}
	return toStringRecord(body);
}

export function createEverhourMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyEverhourWebhookSignature(
	request: WebhookRequest<EverhourWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	const hookSecret = request.headers['x-hook-secret'];
	if (!hookSecret) {
		return { valid: false, error: 'Missing X-Hook-Secret header' };
	}

	// Handshake verification: POST without body.
	if (
		!request.rawBody ||
		(typeof request.rawBody === 'string' && request.rawBody.trim() === '')
	) {
		return { valid: true };
	}

	// For actual events, we verify the X-Hook-Secret matches the configured secret.
	return { valid: hookSecret === secret };
}
