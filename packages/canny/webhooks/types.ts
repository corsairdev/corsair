import { createHmac } from 'node:crypto';
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
		object: z.record(z.string(), z.unknown()),
	})
	.catchall(z.unknown());

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

function firstHeader(
	headers: Record<string, unknown>,
	...names: string[]
): string | undefined {
	for (const name of names) {
		const value =
			headers[name] ??
			headers[name.toLowerCase()] ??
			headers[name.toUpperCase()];
		if (value !== undefined) {
			return Array.isArray(value) ? value[0] : (value as string | undefined);
		}
	}
	return undefined;
}

function timingSafeEqualBase64(a: string, b: string): boolean {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) {
		return false;
	}
	return bufA.equals(bufB);
}

const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Verify a Canny webhook request using HMAC-SHA256 signature of nonce using secret API key.
 * Canny signs webhooks with:
 * - canny-timestamp: milliseconds since epoch
 * - canny-nonce: random unique string
 * - canny-signature: HMAC-SHA256 signature of the nonce in Base64
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

	if (!signature || !nonce) {
		return {
			valid: false,
			error: 'Missing canny-signature or canny-nonce header',
		};
	}

	if (timestamp) {
		const timestampMs = Number.parseInt(timestamp, 10);
		if (Number.isFinite(timestampMs)) {
			const nowMs = Date.now();
			if (Math.abs(nowMs - timestampMs) > TIMESTAMP_TOLERANCE_MS) {
				return {
					valid: false,
					error: 'Webhook timestamp outside tolerance',
				};
			}
		}
	}

	try {
		const expectedSignature = createHmac('sha256', webhookSecret)
			.update(nonce)
			.digest('base64');

		if (timingSafeEqualBase64(signature, expectedSignature)) {
			return { valid: true };
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

export const createCannyEventMatch = createCannyMatch;
