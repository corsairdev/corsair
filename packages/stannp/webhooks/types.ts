import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';
import { CampaignSchema, MailpieceSchema } from '../endpoints/types';

/**
 * Stannp sends webhooks for mailpiece and campaign status changes and for
 * recorded recipient events. Deliveries are created and managed in the
 * Stannp platform (account settings), not through the API, so this plugin
 * only receives them.
 * https://www.stannp.com/us/direct-mail-api/webhooks
 */

/** Header carrying the HMAC-SHA256 signature of the raw body, when set. */
export const STANNP_SIGNATURE_HEADER = 'x-stannp-signature';

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
 * Verifies the X-Stannp-Signature header against the raw body, HMAC-SHA256
 * with the webhook's secret. The docs name the algorithm but not the
 * encoding, so both hex (PHP's hash_hmac default) and base64 are accepted,
 * case-insensitively. A webhook without a secret sends no header at all,
 * so with no secret configured there is nothing to check and the delivery
 * is accepted.
 */
export function verifyStannpWebhook(
	// The payload stays unknown until the event schema parses it; this only
	// reads headers and the raw body.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const expected = secret?.trim();
	if (!expected) return { valid: true };
	if (request.rawBody === undefined) {
		return {
			valid: false,
			error: 'Webhook body was not captured for verification',
		};
	}

	const provided = headerValue(request.headers, STANNP_SIGNATURE_HEADER);
	if (provided === undefined) {
		return {
			valid: false,
			error: `Missing ${STANNP_SIGNATURE_HEADER} header; set a secret on the webhook in Stannp, or remove it from this plugin`,
		};
	}

	const hex = createHmac('sha256', expected)
		.update(request.rawBody)
		.digest('hex');
	const base64 = createHmac('sha256', expected)
		.update(request.rawBody)
		.digest('base64');
	if (
		safeEqual(hex.toLowerCase(), provided.toLowerCase()) ||
		safeEqual(base64, provided)
	) {
		return { valid: true };
	}
	return { valid: false, error: 'Invalid webhook signature' };
}

// ── Payloads ──────────────────────────────────────────────────────────────
//
// Every delivery carries webhook_id, event, created and retries, plus one
// array of objects whose key depends on the event (mailpieces, campaigns or
// events). webhook_id and retries are documented as numbers; strings are
// accepted too, since a failed parse would drop a real event.

const WebhookBaseSchema = z
	.object({
		webhook_id: z.union([z.number(), z.string()]).nullish(),
		event: z.string(),
		created: z.string(),
		retries: z.union([z.number(), z.string()]).nullish(),
	})
	.loose();

export const StannpMailpieceStatusSchema = WebhookBaseSchema.extend({
	event: z.literal('mailpiece_status'),
	mailpieces: z.array(MailpieceSchema),
});

export const StannpCampaignStatusSchema = WebhookBaseSchema.extend({
	event: z.literal('campaign_status'),
	campaigns: z.array(CampaignSchema),
});

// The recipient event object has no documented model, so its fields stay
// open rather than guessed.
export const StannpRecipientEventsSchema = WebhookBaseSchema.extend({
	event: z.literal('recipient_events'),
	// unknown: the docs document the array only as "event objects".
	events: z.array(z.record(z.string(), z.unknown())),
});

// Sent once when a webhook is created; the platform expects HTTP 200 or it
// does not save the webhook.
export const StannpTestUrlSchema = WebhookBaseSchema.extend({
	event: z.literal('test_url'),
});

export const StannpWebhookEventSchemas = {
	testUrl: StannpTestUrlSchema,
	mailpieceStatus: StannpMailpieceStatusSchema,
	campaignStatus: StannpCampaignStatusSchema,
	recipientEvents: StannpRecipientEventsSchema,
} as const;

export type StannpWebhookEvent = keyof typeof StannpWebhookEventSchemas;

export type StannpWebhookOutputs = {
	[K in StannpWebhookEvent]: z.infer<(typeof StannpWebhookEventSchemas)[K]>;
};

export type StannpWebhookPayload = z.infer<typeof WebhookBaseSchema>;

// ── Matching ──────────────────────────────────────────────────────────────

// processWebhook parses string bodies before any matcher runs, so the body
// is an object here (readBodyRecord returns null otherwise).

/** The shape every Stannp delivery shares: an event name and a webhook id. */
export function matchStannpWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return (
		body !== null &&
		typeof body.event === 'string' &&
		body.event.length > 0 &&
		body.webhook_id !== undefined
	);
}

function eventTypeOf(request: RawWebhookRequest): string | undefined {
	if (!matchStannpWebhook(request)) return undefined;
	const event = readBodyRecord(request)?.event;
	return typeof event === 'string' ? event : undefined;
}

export function createStannpMatch(
	eventTypes: readonly string[],
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const event = eventTypeOf(request);
		return event !== undefined && eventTypes.includes(event);
	};
}
