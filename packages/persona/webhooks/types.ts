import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Persona posts events to the URL of a webhook (created through this
 * plugin's webhooks RPC). Each delivery carries a Persona-Signature header
 * of one or more space-separated `t=<unix time>,v1=<hex>` sets, one per
 * active secret while a secret rotates. v1 is HMAC-SHA256 over
 * `<t>.<raw body>`, keyed with the webhook's secret; a delivery is authentic
 * when any v1 matches.
 * https://docs.withpersona.com/webhooks-best-practices
 */

/** Header carrying the signature sets. */
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

/** Splits the header into its `{ t, v1 }` sets; malformed sets are skipped. */
export function parseSignatureHeader(
	header: string,
): Array<{ t: string; v1: string }> {
	const sets: Array<{ t: string; v1: string }> = [];
	for (const set of header.trim().split(/\s+/)) {
		let t: string | undefined;
		let v1: string | undefined;
		for (const pair of set.split(',')) {
			const index = pair.indexOf('=');
			if (index < 0) continue;
			const key = pair.slice(0, index);
			const value = pair.slice(index + 1);
			if (key === 't') t = value;
			if (key === 'v1') v1 = value;
		}
		if (t && v1) sets.push({ t, v1 });
	}
	return sets;
}

/**
 * Verifies the Persona-Signature header against the raw body, as the docs
 * prescribe. A delivery is rejected unless a secret is configured on the
 * plugin or stored with keys.set_webhook_signature.
 */
export function verifyPersonaWebhook(
	// unknown: the payload stays unknown until the event schema parses it;
	// this only reads headers and the raw body.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const key = secret?.trim();
	if (!key) {
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

	const header = headerValue(request.headers, PERSONA_SIGNATURE_HEADER);
	if (header === undefined) {
		return {
			valid: false,
			error: `Missing ${PERSONA_SIGNATURE_HEADER} header`,
		};
	}
	const sets = parseSignatureHeader(header);
	if (sets.length === 0) {
		return { valid: false, error: 'Malformed Persona-Signature header' };
	}

	for (const { t, v1 } of sets) {
		const digest = createHmac('sha256', key)
			.update(`${t}.${request.rawBody}`)
			.digest('hex');
		if (safeEqual(digest, v1)) return { valid: true };
	}
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payload ────────────────────────────────────────────────────────────────

/**
 * One delivery: `{ data: { type: "event", id: "evt_...", attributes: {
 * name: "inquiry.approved", payload: { data: <the inquiry, account, ...> },
 * created-at } } }`.
 */
export const PersonaEventSchema = z
	.object({
		data: z
			.object({
				type: z.string().nullish().describe('Always "event"'),
				id: z.string().min(1).describe('Event id (evt_...)'),
				attributes: z
					.object({
						name: z
							.string()
							.min(1)
							.describe('The event that fired, e.g. inquiry.approved'),
						payload: z
							.object({
								// unknown: the resource depends on the event (an
								// inquiry, account, verification, ...).
								data: z.unknown().describe('The resource the event is about'),
								included: z.array(z.unknown()).nullish(),
							})
							.loose()
							.nullish()
							.describe('The resource as of the event'),
						'created-at': z
							.string()
							.nullish()
							.describe('When the event happened'),
					})
					.loose()
					.describe('Event attributes'),
			})
			.loose()
			.describe('The event'),
	})
	.loose();

export const PersonaWebhookPayloadSchema = PersonaEventSchema.describe(
	'One Persona webhook delivery',
);

export type PersonaWebhookPayload = z.infer<typeof PersonaEventSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Persona sends every event of a webhook to its one URL. A delivery has the
 * Persona-Signature header and a `{ data: { type: "event", attributes: {
 * name } } }` body; requiring both keeps other providers' `{ type, data }`
 * deliveries (Stripe's, for one) away from this plugin.
 */
export function matchPersonaWebhook(request: RawWebhookRequest): boolean {
	if (headerValue(request.headers, PERSONA_SIGNATURE_HEADER) === undefined) {
		return false;
	}
	const body = readBodyRecord(request);
	const data = body?.data;
	if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
	const record = data as Record<string, unknown>;
	const attributes = record.attributes as Record<string, unknown> | undefined;
	return record.type === 'event' && typeof attributes?.name === 'string';
}
