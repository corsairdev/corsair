import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Payhere posts payment and subscription events to the endpoint configured
 * in the merchants admin. Deliveries are signed in the X-Signature header:
 * HMAC-SHA1 hex digest of the raw body, keyed with the account's shared
 * secret. The body carries an `event` key (payment.success,
 * payment.failed, subscription.cancelled, ...) plus the payment or
 * subscription payload.
 * https://developers.payhere.co/docs/webhooks
 */

/** Header carrying the hex HMAC-SHA1 signature of the raw body. */
export const PAYHERE_SIGNATURE_HEADER = 'x-signature';

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
 * Verifies the X-Signature header against the raw body: HMAC-SHA1 hex,
 * keyed with the account's shared secret, exactly as the docs prescribe. A
 * delivery is rejected unless a secret is configured on the plugin or
 * stored with keys.set_webhook_signature.
 */
export function verifyPayhereWebhook(
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
				'No Payhere shared secret configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = headerValue(request.headers, PAYHERE_SIGNATURE_HEADER);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${PAYHERE_SIGNATURE_HEADER} header`,
		};
	}

	const digest = createHmac('sha1', expected)
		.update(request.rawBody)
		.digest('hex');
	if (safeEqual(digest, provided)) return { valid: true };
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payload ────────────────────────────────────────────────────────────────

export const PayhereEventSchema = z
	.object({
		/** The event that fired, e.g. "payment.success". */
		event: z
			.enum([
				'payment.success',
				'payment.failed',
				'subscription.cancelled',
				'subscription.created',
				'subscription.updated',
			])
			.or(z.string().min(1)),
		// unknown: the payload's remaining keys depend on the event type
		// (payment, subscription, customer), so they stay open.
	})
	.loose();

export const PayhereWebhookPayloadSchema = PayhereEventSchema.describe(
	'One Payhere webhook delivery',
);

export type PayhereWebhookPayload = z.infer<typeof PayhereEventSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Payhere sends every event type to the one endpoint configured in the
 * admin. The event key alone is not enough to claim a delivery: Razorpay
 * also posts `{ event: "payment.captured" }`. A body parsed by processWebhook
 * is an object here (readBodyRecord returns null otherwise).
 */
export function matchPayhereEvent(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return body !== null && typeof body.event === 'string';
}

/**
 * Plugin-level matcher for unhinted dispatch: a direct delivery must also
 * carry Payhere's x-signature header. Hub-routed deliveries reach the event
 * webhook through matchPayhereEvent, where the header can be absent.
 */
export function matchPayhereWebhook(request: RawWebhookRequest): boolean {
	return (
		headerValue(request.headers, PAYHERE_SIGNATURE_HEADER) !== undefined &&
		matchPayhereEvent(request)
	);
}
