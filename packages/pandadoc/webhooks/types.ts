import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

/**
 * PandaDoc delivers webhook events to the endpoint registered in a
 * subscription (created through this plugin's webhooks.createSubscription).
 * Every delivery is a JSON array of event objects and carries its signature
 * in the `signature` QUERY parameter, not in a header.
 * https://developers.pandadoc.com/docs/webhook-verification
 * https://developers.pandadoc.com/docs/webhook-events
 */

/** Query parameter carrying the HMAC-SHA256 hex digest of the raw body. */
export const PANDADOC_SIGNATURE_QUERY = 'signature';

/** Header carrying a stable id for de-duplicating redelivered events. */
export const PANDADOC_EVENT_ID_HEADER = 'x-pandadoc-webhook-event-id';

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

/** Extracts one query parameter value regardless of the adapter's shape. */
export function queryValue(
	query: RawWebhookRequest['query'] | undefined,
	name: string,
): string | undefined {
	const value = query?.[name];
	return Array.isArray(value) ? value[0] : value;
}

function safeEqual(left: string, right: string): boolean {
	// Compare bytes: two strings of equal length can differ in byte length,
	// and timingSafeEqual throws on unequal buffers.
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Verifies the `signature` query parameter against the raw body: HMAC-SHA256
 * hex, keyed with the subscription's shared key, exactly as the docs
 * prescribe. A delivery is rejected unless a shared key is configured on the
 * plugin or stored with keys.set_webhook_signature.
 */
export function verifyPandadocWebhook(
	// unknown: the payload stays unknown until the event schema parses it;
	// this only reads the query and the raw body.
	request: WebhookRequest<unknown>,
	sharedKey: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const expected = sharedKey?.trim();
	if (!expected) {
		return {
			valid: false,
			error:
				'No PandaDoc shared key configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = queryValue(request.query, PANDADOC_SIGNATURE_QUERY);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${PANDADOC_SIGNATURE_QUERY} query parameter`,
		};
	}

	const digest = createHmac('sha256', expected)
		.update(request.rawBody)
		.digest('hex');
	if (safeEqual(digest, provided)) return { valid: true };
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payload ────────────────────────────────────────────────────────────────
//
// Every delivery is an array of event objects. `data` holds the ids relevant
// to the event ({id, status} for document_state_changed, {id} for
// document_deleted, ...), so it stays an open record: its keys depend on the
// event type.

export const PandadocWebhookEventSchema = z
	.object({
		/** The event that fired, e.g. "document_state_changed". */
		event: z.string().min(1),
		// unknown: the data object's keys depend on the event type, so it
		// stays an open record.
		data: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export const PandadocWebhookPayloadSchema = z
	.array(PandadocWebhookEventSchema)
	.min(1)
	.describe('The array of events PandaDoc put in one delivery');

export type PandadocWebhookEvent = z.infer<typeof PandadocWebhookEventSchema>;
export type PandadocWebhookPayload = z.infer<
	typeof PandadocWebhookPayloadSchema
>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * PandaDoc sends every event type to the one endpoint of a subscription, so
 * matching only needs the documented array-of-events shape. A body parsed by
 * processWebhook is an array here; anything else is not a PandaDoc delivery.
 */
export function matchPandadocWebhook(request: RawWebhookRequest): boolean {
	// unknown: the delivery body is untyped until the schema parses it; the
	// matcher only needs the array-of-events shape.
	const body = request.body;
	if (!Array.isArray(body) || body.length === 0) return false;
	return body.every((item) => {
		// unknown: the delivery body is untyped until the schema parses it;
		// the matcher only checks for the event string.
		const entry = item as Record<string, unknown> | null;
		return entry !== null && typeof entry.event === 'string';
	});
}
