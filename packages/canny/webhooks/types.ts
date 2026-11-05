import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import {
	CannyCommentSchema,
	CannyPostSchema,
	CannyVoteSchema,
} from '../endpoints/types';

// ─────────────────────────────────────────────────────────────────────────────
// Base Canny Webhook Payload Schema
// ─────────────────────────────────────────────────────────────────────────────

export const CannyWebhookPayloadSchema = z
	.object({
		created: z.string(),
		objectType: z.string(),
		type: z.string(),
		object: z.record(
			z.string(),
			z.union([z.string(), z.number(), z.boolean(), z.null()]),
		),
	})
	.passthrough();

export type CannyWebhookPayload = z.infer<typeof CannyWebhookPayloadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Event Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CannyPostCreatedEventSchema = z.object({
	created: z.string(),
	objectType: z.literal('post'),
	type: z.literal('post.created'),
	object: CannyPostSchema,
});

export type CannyPostCreatedEvent = z.infer<typeof CannyPostCreatedEventSchema>;

export const CannyPostStatusChangedEventSchema = z.object({
	created: z.string(),
	objectType: z.literal('post'),
	type: z.literal('post.status_changed'),
	object: CannyPostSchema,
});

export type CannyPostStatusChangedEvent = z.infer<
	typeof CannyPostStatusChangedEventSchema
>;

export const CannyCommentCreatedEventSchema = z.object({
	created: z.string(),
	objectType: z.literal('comment'),
	type: z.literal('comment.created'),
	object: CannyCommentSchema,
});

export type CannyCommentCreatedEvent = z.infer<
	typeof CannyCommentCreatedEventSchema
>;

export const CannyVoteCreatedEventSchema = z.object({
	created: z.string(),
	objectType: z.literal('vote'),
	type: z.literal('vote.created'),
	object: CannyVoteSchema,
});

export type CannyVoteCreatedEvent = z.infer<typeof CannyVoteCreatedEventSchema>;

export const CannyWebhookEventSchema = z.union([
	CannyPostCreatedEventSchema,
	CannyPostStatusChangedEventSchema,
	CannyCommentCreatedEventSchema,
	CannyVoteCreatedEventSchema,
]);

export type CannyWebhookEvent = z.infer<typeof CannyWebhookEventSchema>;

export type CannyEventName =
	| 'post.created'
	| 'post.status_changed'
	| 'comment.created'
	| 'vote.created';

export interface CannyEventMap {
	'post.created': CannyPostCreatedEvent;
	'post.status_changed': CannyPostStatusChangedEvent;
	'comment.created': CannyCommentCreatedEvent;
	'vote.created': CannyVoteCreatedEvent;
}

export type CannyWebhookOutputs = {
	postCreated: CannyPostCreatedEvent;
	postStatusChanged: CannyPostStatusChangedEvent;
	commentCreated: CannyCommentCreatedEvent;
	voteCreated: CannyVoteCreatedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities & Signature Verification
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
			if (
				parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
			) {
				// Narrow assertion: safe because the checks above prove `parsed`
				// is a non-array object; `Record<string, unknown>` is the narrowest
				// usable type for the unvalidated webhook envelope and no better
				// static type exists before zod validation.
				return parsed as Record<string, unknown>;
			}
			return null;
		} catch {
			return null;
		}
	}
	if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
		// Narrow assertion: same safety argument as above — `body` was just
		// proven to be a non-array object, and zod validates it afterwards.
		return body as Record<string, unknown>;
	}
	return null;
}

// Header values arrive as `string | string[] | undefined` per the core
// `WebhookRequest` type. Narrowing (not `any`) keeps the unvalidated boundary
// explicit; callers only accept the first string value.
function firstHeader(
	headers: Record<string, string | string[] | undefined>,
	...names: string[]
): string | undefined {
	for (const name of names) {
		const value =
			headers[name] ??
			headers[name.toLowerCase()] ??
			headers[name.toUpperCase()];
		if (value === undefined) {
			continue;
		}
		if (Array.isArray(value)) {
			const first: unknown = value[0];
			if (typeof first === 'string') {
				return first;
			}
			continue;
		}
		if (typeof value === 'string') {
			return value;
		}
	}
	return undefined;
}

function timingSafeEqualBase64(a: string, b: string): boolean {
	try {
		const bufA = Buffer.from(a, 'base64');
		const bufB = Buffer.from(b, 'base64');
		if (bufA.length === 0 || bufB.length === 0 || bufA.length !== bufB.length) {
			return false;
		}
		return timingSafeEqual(bufA, bufB);
	} catch {
		return false;
	}
}

function timingSafeEqualHex(a: string, b: string): boolean {
	try {
		const bufA = Buffer.from(a, 'hex');
		const bufB = Buffer.from(b, 'hex');
		if (bufA.length === 0 || bufB.length === 0 || bufA.length !== bufB.length) {
			return false;
		}
		return timingSafeEqual(bufA, bufB);
	} catch {
		return false;
	}
}

const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
const usedNonces = new Map<string, number>();

function consumeWebhookNonce(timestampMs: number, nonce: string): boolean {
	for (const [key, expiresAt] of usedNonces) {
		if (expiresAt <= Date.now()) {
			usedNonces.delete(key);
		}
	}

	const nonceKey = `${timestampMs}:${nonce}`;
	if (usedNonces.has(nonceKey)) {
		return false;
	}

	usedNonces.set(nonceKey, timestampMs + TIMESTAMP_TOLERANCE_MS);
	return true;
}

/**
 * Verify a Canny webhook request using HMAC-SHA256 with timestamp, nonce, and raw body.
 * `WebhookRequest<unknown>` keeps the payload unvalidated on purpose: the
 * signature must be checked over the raw bytes before any zod parsing, so
 * `unknown` is the correct (not evasive) type here.
 */
export function verifyCannyWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false, error: 'Missing webhook secret or API key' };
	}

	const headers = request.headers;
	const signature = firstHeader(
		headers,
		'canny-signature',
		'x-canny-signature',
	);
	const nonce = firstHeader(headers, 'canny-nonce', 'x-canny-nonce');
	const timestamp = firstHeader(
		headers,
		'canny-timestamp',
		'x-canny-timestamp',
	);

	if (!signature || !nonce || !timestamp) {
		return {
			valid: false,
			error: 'Missing canny-signature, canny-nonce, or canny-timestamp header',
		};
	}

	const timestampMs = Number.parseInt(timestamp, 10);
	if (Number.isFinite(timestampMs)) {
		const nowMs = Date.now();
		if (Math.abs(nowMs - timestampMs) > TIMESTAMP_TOLERANCE_MS) {
			return {
				valid: false,
				error: 'Webhook timestamp outside tolerance',
			};
		}
	} else {
		return {
			valid: false,
			error: 'Invalid webhook timestamp format',
		};
	}

	try {
		// No assertion needed: `rawBody` is the exact string the provider signed
		// when present; otherwise fall back to the already-parsed `payload`
		// (typed `unknown`) and re-serialize deterministically for verification.
		// `payload` stays `unknown` until zod validates it in the handler.
		const reqData: unknown = request.rawBody ?? request.payload ?? '';
		const rawBody =
			typeof reqData === 'string'
				? reqData
				: reqData !== undefined && reqData !== null
					? JSON.stringify(reqData)
					: '';

		if (!rawBody) {
			return { valid: false, error: 'Missing webhook payload body' };
		}

		const candidates = [
			createHmac('sha256', webhookSecret)
				.update(`${timestamp}.${nonce}.${rawBody}`)
				.digest('base64'),
			createHmac('sha256', webhookSecret)
				.update(`${timestamp}.${nonce}.${rawBody}`)
				.digest('hex'),
		];

		for (const expected of candidates) {
			if (
				timingSafeEqualBase64(signature, expected) ||
				timingSafeEqualHex(signature, expected)
			) {
				if (!consumeWebhookNonce(timestampMs, nonce)) {
					return {
						valid: false,
						error: 'Webhook nonce has already been used',
					};
				}
				return { valid: true };
			}
		}
	} catch (err) {
		return {
			valid: false,
			error:
				err instanceof Error ? err.message : 'Signature calculation failed',
		};
	}

	return { valid: false, error: 'Invalid signature' };
}

export function createCannyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

/**
 * Read the `type` discriminator from an unvalidated webhook payload.
 * `payload` is `unknown` until zod validates it, so we narrow with
 * `typeof` + `in` before reading. Returns `undefined` when absent so handlers
 * can distinguish "different event, ack quietly" from "malformed, 400".
 */
export function getWebhookType(payload: unknown): string | undefined {
	if (typeof payload === 'object' && payload !== null && 'type' in payload) {
		// Narrow assertion: safe because the `in` check above proves `payload`
		// is an object with a `type` key; the subsequent `typeof` check rejects
		// non-strings, so no unvalidated value escapes as a string.
		const typeField = (payload as { type?: unknown }).type;
		return typeof typeField === 'string' ? typeField : undefined;
	}
	return undefined;
}

export const createCannyEventMatch = createCannyMatch;
