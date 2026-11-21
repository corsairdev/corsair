import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Storeganise calls your HTTPS endpoint when events happen in the system.
 * Deliveries are created in the Storeganise admin portal (Main Settings >
 * Developer > Webhooks), not through the API, so this plugin only receives
 * them. https://help.storeganise.com/article/19-webhooks
 */

/** Header carrying the HMAC-SHA256 signature of the raw body. */
export const SG_SIGNATURE_HEADER = 'sg-signature';

function headerValue(
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
 * Verifies the sg-signature header against the raw body: HMAC-SHA256 keyed
 * with the account's webhook secret (visible from GET /admin/settings),
 * digested base64, exactly as the docs prescribe. Every delivery is signed,
 * so a delivery is rejected unless a secret is configured on the plugin or
 * with keys.set_webhook_signature. The header carries no algorithm prefix,
 * so the whole header value is the digest.
 */
export function verifyStoreganiseWebhook(
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
				'No webhook secret configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = headerValue(request.headers, SG_SIGNATURE_HEADER);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${SG_SIGNATURE_HEADER} header`,
		};
	}

	const digest = createHmac('sha256', expected)
		.update(request.rawBody)
		.digest('base64');
	if (safeEqual(digest, provided)) return { valid: true };
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payload ───────────────────────────────────────────────────────────────
//
// Every delivery carries the same four fields; `data` holds the ids relevant
// to the event ({jobId} for jobs, {invoiceId, siteId} for invoices,
// {unitRentalId} for rental updates, ...). `data` therefore stays an open
// record: its keys depend on the event type.

export const StoreganiseEventSchema = z
	.object({
		id: z.string().min(1),
		created: z.string().min(1),
		/** The event that triggered the webhook, e.g. "job.unit_moveIn.completed". */
		type: z.string().min(1),
		// unknown: the data object's keys depend on the event type (jobId,
		// invoiceId, unitRentalId, ...), so it stays an open record.
		data: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type StoreganiseWebhookEventPayload = z.infer<
	typeof StoreganiseEventSchema
>;

// ── Matching ──────────────────────────────────────────────────────────────

// processWebhook parses string bodies before any matcher runs, so the body
// is an object here (readBodyRecord returns null otherwise).

/** The shape every Storeganise delivery shares: id, created and type. */
export function matchStoreganiseWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return (
		body !== null &&
		typeof body.id === 'string' &&
		body.id.length > 0 &&
		typeof body.created === 'string' &&
		body.created.length > 0 &&
		typeof body.type === 'string' &&
		body.type.length > 0
	);
}
