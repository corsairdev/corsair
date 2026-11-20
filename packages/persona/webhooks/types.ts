import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Persona posts inquiry and verification events to the endpoints configured
 * in a webhook configuration (created through this plugin's webhooks RPC).
 * Deliveries are signed in the Persona-Signature header: HMAC-SHA256 over
 * the raw body, keyed with the webhook's signing secret, hex-encoded.
 * https://docs.withpersona.com/docs/webhooks
 */

/** Header carrying the hex HMAC-SHA256 signature of the raw body. */
export const PERSONA_SIGNATURE_HEADER = 'persona-signature';

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
 * Verifies the Persona-Signature header against the raw body: HMAC-SHA256
 * hex, keyed with the webhook's signing secret, as the docs prescribe. A
 * delivery is rejected unless a secret is configured on the plugin or
 * stored with keys.set_webhook_signature.
 */
export function verifyPersonaWebhook(
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
				'No Persona signing secret configured; set webhookSecret on the plugin or store it with keys.set_webhook_signature',
		};
	}
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = headerValue(request.headers, PERSONA_SIGNATURE_HEADER);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${PERSONA_SIGNATURE_HEADER} header`,
		};
	}

	const digest = createHmac('sha256', expected)
		.update(request.rawBody)
		.digest('hex');
	if (safeEqual(digest, provided)) return { valid: true };
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payload ────────────────────────────────────────────────────────────────

export const PersonaEventSchema = z
	.object({
		/** The event that fired, e.g. "inquiry.approved". */
		type: z.string().min(1),
		data: z
			.object({
				attributes: z
					// unknown: the event attributes depend on the event type, so
					// they stay an open record.
					.record(z.string(), z.unknown())
					.nullish(),
				id: z
					.string()
					.nullish()
					.describe('Id of the resource the event is about'),
			})
			.loose()
			.nullish()
			.describe('The event payload'),
	})
	.loose();

export const PersonaWebhookPayloadSchema = PersonaEventSchema.describe(
	'One Persona webhook delivery',
);

export type PersonaWebhookPayload = z.infer<typeof PersonaEventSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Persona sends every event type to the one endpoint of a webhook, so
 * matching only needs the documented envelope. A body parsed by
 * processWebhook is an object here (readBodyRecord returns null otherwise).
 */
export function matchPersonaWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return body !== null && typeof body.type === 'string' && 'data' in body;
}
