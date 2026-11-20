import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import type { z } from 'zod';
import { DocumentSchema } from '../endpoints/types';

/**
 * Parsio delivers parsed documents to the endpoint configured in a webhook
 * subscription (created through this plugin's webhooks.create operations).
 * Deliveries are signed in the parsio-signature header: base64
 * HMAC-SHA256 over the raw payload, keyed with the signing secret Parsio
 * generated when the webhook was created.
 * https://help.parsio.io/data-export-integrations/send-data-to-webhook-1
 */

/** Header carrying the base64 HMAC-SHA256 signature of the raw payload. */
export const PARSIO_SIGNATURE_HEADER = 'parsio-signature';

/** Extracts one header value regardless of the adapter's value shape. */
export function headerValue(
	// Header values are string | string[] | undefined depending on the
	// HTTP adapter.
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

function safeEqual(left: string, right: string): boolean {
	// Compare bytes: two strings of equal length can differ in byte length,
	// and timingSafeEqual throws on unequal buffers.
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Verifies the parsio-signature header against the raw payload: HMAC-SHA256
 * digested base64, keyed with the webhook's signing secret, exactly as the
 * docs prescribe. A delivery is rejected unless a secret is configured on
 * the plugin or stored with keys.set_webhook_signature.
 */
export function verifyParsioWebhook(
	// unknown: the payload stays unknown until the event schema parses it;
	// this only reads headers and the raw body.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const expected = secret?.trim();
	if (!expected) {
		return {
			valid: false,
			error:
				'No Parsio signing secret configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = headerValue(request.headers, PARSIO_SIGNATURE_HEADER);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${PARSIO_SIGNATURE_HEADER} header`,
		};
	}

	const digest = createHmac('sha256', expected)
		.update(request.rawBody)
		.digest('base64');
	if (safeEqual(digest, provided)) return { valid: true };
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payload ────────────────────────────────────────────────────────────────
//
// The delivery payload is the parsed document JSON, the same style
// GET /docs/{id} answers with; which event it carries (doc.parsed,
// doc.fail, doc.received, table.parsed) is a property of the webhook
// subscription, not of the payload body.

export const ParsioWebhookPayloadSchema = DocumentSchema.describe(
	'The parsed document Parsio delivered',
);

export type ParsioWebhookPayload = z.infer<typeof ParsioWebhookPayloadSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Parsio sends every event type to the one endpoint of a webhook, so
 * matching only needs the documented document shape (doc_id is the anchor).
 * A body parsed by processWebhook is an object here (readBodyRecord returns
 * null otherwise).
 */
export function matchParsioWebhook(request: RawWebhookRequest): boolean {
	const body = request.body;
	if (body === null || typeof body !== 'object' || Array.isArray(body)) {
		return false;
	}
	// unknown: the delivery body is untyped until the schema parses it; the
	// matcher only checks for the documented doc_id anchor.
	const record = body as Record<string, unknown>;
	return typeof record.doc_id === 'string';
}
