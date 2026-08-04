import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/** V3 trigger event envelope from Composio webhooks. */
export const TriggerMessageEventSchema = z.object({
	id: z.string().optional(),
	type: z.literal('composio.trigger.message'),
	timestamp: z.string().optional(),
	metadata: z
		.object({
			log_id: z.string().optional(),
			trigger_slug: z.string(),
			trigger_id: z.string().optional(),
			connected_account_id: z.string().optional(),
			auth_config_id: z.string().optional(),
			user_id: z.string().optional(),
		})
		.passthrough(),
	data: z.record(z.string(), z.unknown()),
});
export type TriggerMessageEvent = z.infer<typeof TriggerMessageEventSchema>;

/** Other project events (e.g. connection lifecycle) share the same URL. */
export const ProjectEventSchema = z
	.object({
		type: z.string(),
		timestamp: z.string().optional(),
		data: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type ProjectEvent = z.infer<typeof ProjectEventSchema>;

export type ComposioWebhookPayload = TriggerMessageEvent | ProjectEvent;

export type ComposioWebhookOutputs = {
	triggerMessage: TriggerMessageEvent;
	projectEvent: ProjectEvent;
};

/** request.body may be a pre-parsed object or a raw JSON string from the framework. */
function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return null;
		}
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createComposioMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!('webhook-signature' in request.headers)) return false;
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		return typeof parsedBody.type === 'string' && parsedBody.type === eventType;
	};
}

/** Match any non-trigger project event that still carries Standard Webhooks headers. */
export function createComposioProjectEventMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!('webhook-signature' in request.headers)) return false;
		const parsedBody = parseBody(request.body);
		if (!parsedBody || typeof parsedBody.type !== 'string') return false;
		return parsedBody.type !== 'composio.trigger.message';
	};
}

function headerValue(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = headers[name];
	return Array.isArray(value) ? value[0] : value;
}

function hmacKeyFromSecret(secret: string): Buffer {
	// Standard Webhooks: secrets are often `whsec_<base64>`.
	if (secret.startsWith('whsec_')) {
		try {
			return Buffer.from(secret.slice('whsec_'.length), 'base64');
		} catch {
			// fall through to utf-8
		}
	}
	return Buffer.from(secret, 'utf8');
}

/**
 * Composio signs with Standard Webhooks:
 * HMAC-SHA256 over `{webhook-id}.{webhook-timestamp}.{rawBody}`, digest base64.
 * Header `webhook-signature` looks like `v1,<base64>` (space-separated if multiple).
 */
export function verifyComposioWebhookSignature(
	request: WebhookRequest<ComposioWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) return { valid: false, error: 'Missing webhook secret' };

	const rawBody = request.rawBody;
	if (!rawBody) return { valid: false, error: 'Missing raw body' };

	const webhookId = headerValue(request.headers, 'webhook-id');
	const webhookTimestamp = headerValue(request.headers, 'webhook-timestamp');
	const sigHeader = headerValue(request.headers, 'webhook-signature');

	if (!webhookId || !webhookTimestamp || !sigHeader) {
		return { valid: false, error: 'Missing required webhook headers' };
	}

	const WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000;
	const timestampMs = parseInt(webhookTimestamp, 10) * 1000;
	if (
		Number.isNaN(timestampMs) ||
		Math.abs(Date.now() - timestampMs) > WEBHOOK_TOLERANCE_MS
	) {
		return { valid: false, error: 'Webhook timestamp out of tolerance window' };
	}

	const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
	const expected = createHmac('sha256', hmacKeyFromSecret(secret))
		.update(signedContent)
		.digest('base64');

	const isValid = sigHeader.split(' ').some((part) => {
		const received = part.startsWith('v1,') ? part.slice(3) : part;
		try {
			const a = Buffer.from(expected);
			const b = Buffer.from(received);
			return a.length === b.length && timingSafeEqual(a, b);
		} catch {
			return false;
		}
	});

	if (!isValid) return { valid: false, error: 'Invalid signature' };
	return { valid: true };
}
