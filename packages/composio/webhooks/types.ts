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
	// Provider-specific event payload — shapes vary per trigger and evolve,
	// so keep it loosely typed to avoid schema breakage on new trigger types.
	data: z.record(z.string(), z.unknown()),
});
export type TriggerMessageEvent = z.infer<typeof TriggerMessageEventSchema>;

/** Other project events (e.g. connection lifecycle) share the same URL. */
export const ProjectEventSchema = z
	.object({
		type: z.string(),
		timestamp: z.string().optional(),
		// Project-event payload/metadata are provider-defined and vary widely,
		// so they are kept loosely typed (no fixed keys) rather than guessed.
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

/**
 * Explicit raw-body provenance. `rawBody` must be the original inbound bytes —
 * never a `JSON.stringify` reconstruction of a parsed object. Set it via
 * `verifyComposioWebhookSignatureFromRaw` or when the caller has the raw bytes.
 */
export type ComposioWebhookRequest = WebhookRequest<ComposioWebhookPayload> & {
	rawBodyPreserved?: boolean;
};

/**
 * Core `processWebhook` parses JSON before matchers run, so matchers usually
 * see an object. String + try/catch covers direct/unit-test calls only —
 * malformed JSON at the HTTP edge must be caught by the adapter / processWebhook.
 */
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

export function createComposioMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!headerValue(request.headers, 'webhook-signature')) return false;
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		return typeof parsedBody.type === 'string' && parsedBody.type === eventType;
	};
}

/** Match any non-trigger project event that still carries Standard Webhooks headers. */
export function createComposioProjectEventMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!headerValue(request.headers, 'webhook-signature')) return false;
		const parsedBody = parseBody(request.body);
		if (!parsedBody || typeof parsedBody.type !== 'string') return false;
		return parsedBody.type !== 'composio.trigger.message';
	};
}

function headerValue(
	headers: WebhookRequest<unknown>['headers'] | RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	const exact = headers[name] ?? headers[lower];
	if (exact !== undefined) {
		return Array.isArray(exact) ? exact[0] : exact;
	}
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === lower) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
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

/** Generic error returned to callers — never leak which verification gate failed. */
const SIGNATURE_FAILED = 'Signature verification failed';

/**
 * Standard Webhooks replay protection. Remember the (webhook-id, timestamp)
 * of deliveries accepted within the tolerance window so a captured request
 * cannot be re-delivered to trigger duplicate downstream effects (e.g. re-firing
 * a `composio.trigger.message` automation). Entries are evicted lazily once
 * they fall outside the window, keeping the store bounded.
 *
 * WARNING: this cache is in-process only. Each OS process / serverless worker
 * starts with an empty store, so it is NOT a distributed deduplication layer.
 * In multi-worker or serverless deployments a captured delivery can be replayed
 * to a different (cold) worker within the tolerance window. For cross-process
 * protection, plug the deduplication into a shared store (e.g. Redis, Postgres,
 * or the framework's Hub) keyed by `${webhookId}:${webhookTimestamp}`.
 */
const WEBHOOK_REPLAY_WINDOW_MS = 5 * 60 * 1000;
const processedWebhookDeliveries = new Map<string, number>();
let lastReplayEvictionMs = 0;

function isWebhookReplayed(
	webhookId: string,
	webhookTimestamp: string,
): boolean {
	const now = Date.now();

	// Lazy, window-bounded eviction so the map does not grow unboundedly.
	if (now - lastReplayEvictionMs > WEBHOOK_REPLAY_WINDOW_MS) {
		for (const [key, seenAtMs] of processedWebhookDeliveries) {
			if (now - seenAtMs > WEBHOOK_REPLAY_WINDOW_MS) {
				processedWebhookDeliveries.delete(key);
			}
		}
		lastReplayEvictionMs = now;
	}

	const deliveryKey = `${webhookId}:${webhookTimestamp}`;
	if (processedWebhookDeliveries.has(deliveryKey)) {
		return true;
	}
	processedWebhookDeliveries.set(deliveryKey, now);
	return false;
}

/**
 * Composio signs with Standard Webhooks:
 * HMAC-SHA256 over `{webhook-id}.{webhook-timestamp}.{rawBody}`, digest base64.
 * Header `webhook-signature` looks like `v1,<base64>` (space-separated if multiple).
 *
 * Require `rawBodyPreserved === true`. Callers who have the original inbound
 * bytes must set it (see `verifyComposioWebhookSignatureFromRaw`). Verification
 * never runs against a `JSON.stringify` reconstruction of a parsed object.
 */
export function verifyComposioWebhookSignature(
	request: ComposioWebhookRequest,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) return { valid: false, error: SIGNATURE_FAILED };

	// Do not infer provenance from JSON.stringify equality. Only verify when
	// the caller explicitly marks the inbound bytes as original — matching the
	// Databricks plugin pattern (never hash a reconstructed body).
	if (
		request.rawBodyPreserved !== true ||
		typeof request.rawBody !== 'string' ||
		request.rawBody.length === 0
	) {
		return { valid: false, error: SIGNATURE_FAILED };
	}

	const rawBody = request.rawBody;
	const webhookId = headerValue(request.headers, 'webhook-id');
	const webhookTimestamp = headerValue(request.headers, 'webhook-timestamp');
	const sigHeader = headerValue(request.headers, 'webhook-signature');

	if (!webhookId || !webhookTimestamp || !sigHeader) {
		return { valid: false, error: SIGNATURE_FAILED };
	}

	const WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000;
	const timestampMs = parseInt(webhookTimestamp, 10) * 1000;
	if (
		Number.isNaN(timestampMs) ||
		Math.abs(Date.now() - timestampMs) > WEBHOOK_TOLERANCE_MS
	) {
		return { valid: false, error: SIGNATURE_FAILED };
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

	if (!isValid) return { valid: false, error: SIGNATURE_FAILED };

	// Reject a replay: the same (webhook-id, timestamp) already accepted within
	// the tolerance window must not trigger duplicate downstream effects.
	if (isWebhookReplayed(webhookId, webhookTimestamp)) {
		return { valid: false, error: SIGNATURE_FAILED };
	}

	return { valid: true };
}

/**
 * Verify against the inbound string body before JSON parsing.
 * Use this from adapters that still have the original bytes.
 */
export function verifyComposioWebhookSignatureFromRaw(
	request: Pick<RawWebhookRequest, 'body' | 'headers'>,
	secret: string,
): { valid: boolean; error?: string } {
	if (typeof request.body !== 'string') {
		return { valid: false, error: SIGNATURE_FAILED };
	}
	return verifyComposioWebhookSignature(
		{
			payload: {} as ComposioWebhookPayload,
			headers: request.headers,
			rawBody: request.body,
			rawBodyPreserved: true,
		},
		secret,
	);
}
