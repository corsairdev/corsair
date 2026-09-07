import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
export type { WebhookRequest };

import crypto from 'crypto';
import { z } from 'zod';

export const EverhourWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
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

export type EverhourWebhookOutputs = {
	'api:time:updated': TimeUpdatedEvent;
	'api:timer:started': any;
	'api:timer:stopped': any;
	'api:project:created': any;
	'api:project:updated': any;
	'api:project:removed': any;
	'api:task:created': any;
	'api:task:updated': any;
	'api:task:removed': any;
	'api:task:recovered': any;
	'api:estimate:updated': any;
	'api:section:created': any;
	'api:section:updated': any;
	'api:section:removed': any;
	'api:section:recovered': any;
	'api:client:created': any;
	'api:client:updated': any;
	'api:invoice:created': any;
	'api:invoice:updated': any;
	'api:invoice:deleted': any;
};

export type EverhourWebhooks = {
	[K in keyof EverhourWebhookOutputs]: {
		match: CorsairWebhookMatcher;
		handler: (
			ctx: any,
			request: WebhookRequest<EverhourWebhookPayload>,
		) => Promise<{
			success: boolean;
			statusCode?: number;
			error?: string;
			data?: EverhourWebhookOutputs[K];
		}>;
	};
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
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
