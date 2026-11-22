import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Piggy (Leat) delivers webhook events to the URL set on a webhook
 * subscription. Deliveries are signed in the `Signature` header: an
 * HMAC-SHA256 over the raw JSON body, keyed with the subscription's secret
 * (or the account secret when the subscription has none), hex-encoded. The
 * same scheme covers both envelope versions.
 * https://docs.leat.com/v3/oauth/webhooks
 */

/** Header carrying the hex HMAC-SHA256 signature of the raw body. */
export const PIGGY_SIGNATURE_HEADER = 'signature';

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
 * Verifies the Signature header against the raw body: HMAC-SHA256 hex,
 * keyed with the webhook's subscription secret, as the docs prescribe. A
 * delivery is rejected unless a secret is configured on the plugin or
 * stored with keys.set_webhook_signature.
 */
export function verifyPiggyWebhook(
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
				'No Piggy webhook secret configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = headerValue(request.headers, PIGGY_SIGNATURE_HEADER);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${PIGGY_SIGNATURE_HEADER} header`,
		};
	}

	const digest = createHmac('sha256', expected)
		.update(request.rawBody)
		.digest('hex');
	if (safeEqual(digest, provided)) return { valid: true };
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payload ────────────────────────────────────────────────────────────────

/**
 * The V1 envelope: one event per request, `{ uuid, version, type, data }`.
 * Deduplicate on `uuid` — a retry re-sends the same value.
 * https://docs.leat.com/v3/oauth/webhooks-v1
 */
export const PiggyV1EnvelopeSchema = z
	.object({
		uuid: z
			.string()
			.min(1)
			.describe('Event id; deduplicate on it across retries'),
		version: z.literal('V1'),
		type: z.string().min(1).describe('The event type, e.g. voucher_created'),
		data: z
			// unknown: the payload shape depends on the event type; the event
			// catalogue on the webhooks page documents each one.
			.record(z.string(), z.unknown())
			.describe('The event payload'),
	})
	.loose();
export type PiggyV1Envelope = z.infer<typeof PiggyV1EnvelopeSchema>;

/**
 * The V2 envelope: a batch under `{ batch_uuid, version, event_type,
 * count, events }`. Deduplicate on `events[].event_uuid` — a retried batch
 * re-sends every event in it, including ones already handled.
 * https://docs.leat.com/v3/oauth/webhooks-v2
 */
export const PiggyV2EnvelopeSchema = z
	.object({
		batch_uuid: z
			.string()
			.min(1)
			.describe('Batch id; for support traces, not deduplication'),
		version: z.literal('V2'),
		event_type: z
			.string()
			.min(1)
			.describe('The event type every event in the batch carries'),
		count: z
			.number()
			.int()
			.min(1)
			.max(100)
			.describe('Number of events in the batch'),
		events: z
			.array(
				z
					.object({
						event_uuid: z
							.string()
							.min(1)
							.describe('Event id; deduplicate on it across retries'),
						event_type: z.string().min(1),
						data: z
							// unknown: the payload shape depends on the event type.
							.record(z.string(), z.unknown())
							.describe('The event payload'),
					})
					.loose(),
			)
			.min(1),
	})
	.loose();
export type PiggyV2Envelope = z.infer<typeof PiggyV2EnvelopeSchema>;

/**
 * A delivery is a V1 single-event envelope or a V2 batch. The union
 * branches on `version`, exactly as the docs advise receivers to.
 */
export const PiggyWebhookPayloadSchema = z.union([
	PiggyV1EnvelopeSchema,
	PiggyV2EnvelopeSchema,
]);
export type PiggyWebhookPayload = z.infer<typeof PiggyWebhookPayloadSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * A body is a Piggy webhook when it parses as one of the two documented
 * envelopes: V1 bodies carry `version: "V1"` with `uuid`/`type`/`data`,
 * V2 bodies `version: "V2"` with a `events` array. processWebhook already
 * parsed it, so the record check keeps matcher and handler consistent.
 */
export function matchPiggyWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	if (body === null) return false;
	return PiggyWebhookPayloadSchema.safeParse(body).success;
}
