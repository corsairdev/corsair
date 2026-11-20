import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Paystack posts charge.success, transfer.success and other events to the
 * endpoint configured under Developers > API configuration. Two signature
 * schemes exist, both documented:
 *
 * - Legacy: x-paystack-signature, HMAC-SHA512 hex of the raw body keyed
 *   with the account's SECRET key.
 * - Current: Paystack-Signature, "t=<unix-seconds>,v1=<whk_keyid>:<hex>",
 *   HMAC-SHA512 over `t + '.' + raw body` keyed with the whsec_ signing
 *   secret; the timestamp must be within 300 seconds of server time.
 *
 * https://paystack.com/docs/payments/webhooks/
 */

const LEGACY_SIGNATURE_HEADER = 'x-paystack-signature';
const CURRENT_SIGNATURE_HEADER = 'paystack-signature';
/** How far the current scheme's timestamp may drift from server time. */
const TIMESTAMP_TOLERANCE_SECONDS = 300;

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

/** Parses "t=<seconds>,v1=<keyid>:<hex>" into its parts. */
export function parseCurrentSignature(
	value: string,
): { timestamp: string; signature: string } | undefined {
	const parts = value.split(',').map((piece) => piece.trim());
	let timestamp: string | undefined;
	let signature: string | undefined;
	for (const part of parts) {
		if (part.startsWith('t=')) timestamp = part.slice(2);
		if (part.startsWith('v1=') && part.includes(':')) {
			signature = part.slice(3).split(':')[1];
		}
	}
	if (!timestamp || !signature) return undefined;
	return { timestamp, signature };
}

/**
 * Verifies a delivery under either documented scheme. Legacy deliveries
 * are keyed with the account secret key; current ones with the whsec_
 * signing secret. Pass the secret that matches the scheme your
 * integration receives.
 */
export function verifyPaystackWebhook(
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
				'No Paystack secret configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const current = headerValue(request.headers, CURRENT_SIGNATURE_HEADER);
	if (current !== undefined) {
		const parsed = parseCurrentSignature(current);
		if (!parsed) {
			return {
				valid: false,
				error: 'Malformed Paystack-Signature header; expected t=...,v1=...',
			};
		}
		const seconds = Number(parsed.timestamp);
		if (!Number.isFinite(seconds)) {
			return { valid: false, error: 'Malformed Paystack-Signature timestamp' };
		}
		const drift = Math.abs(seconds - Math.floor(Date.now() / 1000));
		if (drift > TIMESTAMP_TOLERANCE_SECONDS) {
			return {
				valid: false,
				error: 'Signature timestamp outside the 300s tolerance',
			};
		}
		const digest = createHmac('sha512', expected)
			.update(`${parsed.timestamp}.${request.rawBody}`)
			.digest('hex');
		if (safeEqual(digest, parsed.signature)) return { valid: true };
		return { valid: false, error: 'Invalid webhook signature' };
	}

	const legacy = headerValue(request.headers, LEGACY_SIGNATURE_HEADER);
	if (legacy !== undefined) {
		const digest = createHmac('sha512', expected)
			.update(request.rawBody)
			.digest('hex');
		if (safeEqual(digest, legacy)) return { valid: true };
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return {
		valid: false,
		error: `Missing ${LEGACY_SIGNATURE_HEADER} or ${CURRENT_SIGNATURE_HEADER} header`,
	};
}

// ── Payload ────────────────────────────────────────────────────────────────

export const PaystackEventSchema = z
	.object({
		/** The event that fired, e.g. "charge.success". */
		event: z.string().min(1),
		// unknown: the data object's keys depend on the event type, so it
		// stays an open record.
		data: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export const PaystackWebhookPayloadSchema = PaystackEventSchema.describe(
	'One Paystack webhook delivery',
);

export type PaystackWebhookPayload = z.infer<typeof PaystackEventSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Paystack sends every event type to the one endpoint configured in the
 * dashboard, so matching only needs the documented envelope. A body parsed
 * by processWebhook is an object here (readBodyRecord returns null
 * otherwise).
 */
export function matchPaystackWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return body !== null && typeof body.event === 'string';
}
