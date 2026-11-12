import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const SANITY_WEBHOOK_HEADERS = {
	signature: 'sanity-webhook-signature',
	projectId: 'sanity-project-id',
	dataset: 'sanity-dataset',
	webhookId: 'sanity-webhook-id',
	documentId: 'sanity-document-id',
	operation: 'sanity-operation',
	transactionId: 'sanity-transaction-id',
	transactionTime: 'sanity-transaction-time',
	idempotencyKey: 'idempotency-key',
} as const;

/**
 * Deliveries signed further from now than this are refused. `@sanity/webhook`
 * checks no time at all; a window bounds how long a captured delivery can be
 * replayed. Sanity retries a failed delivery twice, 30 seconds apart, so 15
 * minutes leaves room for those and for queueing.
 */
export const SANITY_WEBHOOK_TOLERANCE_SECONDS = 15 * 60;

export const SANITY_OPERATIONS = ['create', 'update', 'delete'] as const;

// unknown: a webhook's body is the projection its owner wrote, any JSON.
const ProjectionSchema = z.unknown();

export const DocumentChangedPayloadSchema = ProjectionSchema;

export type DocumentChangedPayload = z.infer<
	typeof DocumentChangedPayloadSchema
>;

export const DocumentChangedEventSchema = z.object({
	operation: z
		.enum(SANITY_OPERATIONS)
		.or(z.string())
		.nullish()
		.describe(
			'create, update or delete, from the sanity-operation header. Missing when the webhook was set up without it.',
		),
	documentId: z
		.string()
		.nullish()
		.describe(
			'The changed document. A drafts. or versions. prefix means a draft or release version changed, not the published document.',
		),
	projectId: z.string().nullish(),
	dataset: z.string().nullish(),
	webhookId: z.string().nullish(),
	transactionId: z.string().nullish(),
	transactionTime: z.string().nullish(),
	idempotencyKey: z
		.string()
		.nullish()
		.describe('The same on every retry of one delivery, so deduplicate by it.'),
	// unknown: the body is the webhook's own GROQ projection.
	body: ProjectionSchema.describe(
		"The delivery's body: the webhook's GROQ projection of the document, or the whole document when it has none. On delete, the projection runs on the document as it was.",
	),
});

export type DocumentChangedEvent = z.infer<typeof DocumentChangedEventSchema>;

export type SanityWebhookOutputs = {
	documentChanged: DocumentChangedEvent;
};

export function headerValue(
	// unknown: the payload type plays no part in reading headers.
	headers: WebhookRequest<unknown>['headers'] | RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	const direct = headers[name];
	if (direct !== undefined) return Array.isArray(direct) ? direct[0] : direct;
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
}

/**
 * Sanity's own headers name a delivery: the signature (a signed webhook) or the
 * project id and webhook id every delivery carries. No other provider sends
 * `sanity-*` headers.
 */
export const isSanityWebhook: CorsairWebhookMatcher = (
	request: RawWebhookRequest,
) =>
	Boolean(
		headerValue(request.headers, SANITY_WEBHOOK_HEADERS.signature) ||
			(headerValue(request.headers, SANITY_WEBHOOK_HEADERS.projectId) &&
				headerValue(request.headers, SANITY_WEBHOOK_HEADERS.webhookId)),
	);

const SIGNATURE_RE = /^t=(\d{13})[, ]+v1=([A-Za-z0-9_-]+)$/;

export type SanityVerifyOptions = {
	/** The current time in milliseconds, for tests. */
	now?: number;
	/** Seconds either side of now a signature's time may be. */
	toleranceSeconds?: number;
};

/**
 * Sanity's webhook signature, as `@sanity/webhook` 4 computes it: header
 * `sanity-webhook-signature: t=<unix ms>,v1=<sig>`, where sig is HMAC-SHA256
 * keyed with the secret's UTF-8 bytes over `${t}.${rawBody}`, in base64url
 * without padding. Written with node:crypto so the plugin carries no dependency.
 * Without a secret nothing verifies.
 */
export function verifySanityWebhookSignature(
	// unknown: only the raw body is verified, never the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	options: SanityVerifyOptions = {},
): { valid: boolean; error?: string } {
	if (!secret) return { valid: false, error: 'Missing webhook secret' };

	const rawBody = request.rawBody;
	if (!rawBody) return { valid: false, error: 'Missing raw body' };

	const header = headerValue(request.headers, SANITY_WEBHOOK_HEADERS.signature);
	if (!header) return { valid: false, error: 'The delivery is not signed' };

	const match = header.trim().match(SIGNATURE_RE);
	if (!match) {
		return { valid: false, error: 'Malformed sanity-webhook-signature' };
	}
	const [, timestamp = '', signature = ''] = match;

	const now = options.now ?? Date.now();
	const tolerance =
		options.toleranceSeconds ?? SANITY_WEBHOOK_TOLERANCE_SECONDS;
	if (Math.abs(now - Number(timestamp)) > tolerance * 1000) {
		return { valid: false, error: 'The webhook timestamp is out of range' };
	}

	const expected = createHmac('sha256', Buffer.from(secret, 'utf8'))
		.update(`${timestamp}.${rawBody}`)
		.digest();
	const candidate = Buffer.from(signature, 'base64url');
	const matched =
		candidate.length === expected.length &&
		timingSafeEqual(candidate, expected);
	return matched
		? { valid: true }
		: {
				valid: false,
				error:
					'The signature does not match. Hand processWebhook the raw body text: a parsed body cannot verify.',
			};
}

/** Reads the delivery's headers into the event's fields. */
// unknown: the payload type plays no part in reading headers.
export function deliveryFields(request: WebhookRequest<unknown>) {
	const read = (name: string) => headerValue(request.headers, name);
	return {
		operation: read(SANITY_WEBHOOK_HEADERS.operation),
		documentId: read(SANITY_WEBHOOK_HEADERS.documentId),
		projectId: read(SANITY_WEBHOOK_HEADERS.projectId),
		dataset: read(SANITY_WEBHOOK_HEADERS.dataset),
		webhookId: read(SANITY_WEBHOOK_HEADERS.webhookId),
		transactionId: read(SANITY_WEBHOOK_HEADERS.transactionId),
		transactionTime: read(SANITY_WEBHOOK_HEADERS.transactionTime),
		// Sanity sends it quoted ("..."); the quotes are dropped.
		idempotencyKey: read(SANITY_WEBHOOK_HEADERS.idempotencyKey)?.replace(
			/^"(.*)"$/,
			'$1',
		),
	};
}
