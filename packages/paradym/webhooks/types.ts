import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

/**
 * Paradym delivers webhook events to the endpoint registered in a
 * subscription (created through this plugin's webhooks.createSubscription).
 * Deliveries are signed in the X-Paradym-HMAC-SHA-256 header: HMAC-SHA256
 * over the raw body with the subscription's secret, hex-encoded.
 * https://docs.paradym.id/api-and-dashboard/using-webhooks
 */

/** Header carrying the hex HMAC-SHA256 signature of the raw body. */
export const PARADYM_SIGNATURE_HEADER = 'x-paradym-hmac-sha-256';

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
 * Verifies the signature header against the raw body: HMAC-SHA256 hex, keyed
 * with the subscription's signature secret, exactly as the docs prescribe. A
 * delivery is rejected unless a secret is configured on the plugin or stored
 * with keys.set_webhook_signature.
 */
export function verifyParadymWebhook(
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
				'No Paradym webhook secret configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = headerValue(request.headers, PARADYM_SIGNATURE_HEADER);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${PARADYM_SIGNATURE_HEADER} header`,
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
// Every delivery carries the same envelope; `payload` holds the ids relevant
// to the event ({openId4VcIssuanceId} for issuance, {openId4VcVerificationId}
// for verification, {didcommConnectionId, message} for messaging, ...), so it
// stays an open record: its keys depend on the event type.

export const ParadymEventSchema = z
	.object({
		webhookId: z
			.string()
			.min(1)
			.describe('The subscription the delivery came from'),
		webhookPublishedAt: z
			.string()
			.min(1)
			.describe('When Paradym published the event'),
		walletId: z.string().min(1).describe('Wallet the event belongs to'),
		eventType: z
			.string()
			.min(1)
			.describe('The event that fired, e.g. openid4vc.issuance.completed'),
		// unknown: the payload object's keys depend on the event type, so it
		// stays an open record.
		payload: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export const ParadymWebhookPayloadSchema = ParadymEventSchema.describe(
	'One Paradym webhook event as delivered',
);

export type ParadymWebhookPayload = z.infer<typeof ParadymWebhookPayloadSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Paradym sends every event type of a wallet's subscriptions to one endpoint,
 * so matching only needs the documented envelope. A body parsed by
 * processWebhook is an object here (readBodyRecord returns null otherwise).
 */
export function matchParadymWebhook(request: RawWebhookRequest): boolean {
	const body = request.body;
	if (body === null || typeof body !== 'object' || Array.isArray(body)) {
		return false;
	}
	// unknown: the delivery body is untyped until the schema parses it; the
	// matcher only checks for the documented envelope keys.
	const record = body as Record<string, unknown>;
	return (
		typeof record.eventType === 'string' && typeof record.walletId === 'string'
	);
}
