import { timingSafeEqual, createHmac } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

// ── Verification ──────────────────────────────────────────────────────────
//
// HappyScribe signs every delivery twice with the endpoint's signing secret
// (the full `whsec_...` string, prefix included, as the HMAC key):
//
// - `X-Webhook-Signature: sha256=<hex>` over the raw request body. No
//   replay protection on its own.
// - `X-HappyScribe-Signature: t=<unix_seconds>,v1=<hex>` over
//   `<timestamp>.<raw body>`. Reject a timestamp older than five minutes.
//
// Digests are lowercase hex, not base64. The raw body bytes are the signed
// input, so verification runs before any re-serialization; the adapters
// provide `rawBody`, and re-serialized JSON is only a fallback.

export const HAPPYSCRIBE_SIGNATURE_MAX_AGE_SECONDS = 300;

function headerValue(
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
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

function hexDigest(input: string, secret: string): string {
	return createHmac('sha256', secret).update(input).digest('hex');
}

// unknown: the raw body is the exact bytes HappyScribe signed; a JSON
// re-serialization only approximates them.
function signedBody(request: WebhookRequest<unknown>): string {
	return request.rawBody ?? JSON.stringify(request.payload ?? {});
}

/**
 * Verifies both signature headers. Returns the first failure found, so a
 * caller can answer 401 with the reason. A delivery without either header,
 * or with no secret configured, is invalid: the plugin never accepts
 * unsigned deliveries.
 */
export function verifyHappyScribeWebhook(
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	now: number = Math.floor(Date.now() / 1000),
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const key = secret?.trim();
	if (!key) {
		return {
			valid: false,
			error:
				'No HappyScribe webhook signing secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}

	const body = signedBody(request);
	const plain = headerValue(request.headers, 'x-webhook-signature');
	const expectedPlain = `sha256=${hexDigest(body, key)}`;
	const plainOk =
		plain !== undefined && safeEqual(plain.trim(), expectedPlain);

	const stamped = headerValue(request.headers, 'x-happyscribe-signature');
	let stampedOk = false;
	if (stamped !== undefined) {
		const match = /^t=(\d+),v1=([0-9a-f]+)$/.exec(stamped.trim());
		const [, timestamp, digest] = match ?? [];
		if (timestamp !== undefined && digest !== undefined) {
			const age = now - Number(timestamp);
			const fresh = age >= 0 && age <= HAPPYSCRIBE_SIGNATURE_MAX_AGE_SECONDS;
			stampedOk =
				fresh &&
				safeEqual(digest, hexDigest(`${timestamp}.${body}`, key));
		}
	}

	if (!plainOk && !stampedOk) {
		return {
			valid: false,
			error:
				plain === undefined && stamped === undefined
					? 'Missing X-Webhook-Signature and X-HappyScribe-Signature headers'
					: 'Invalid webhook signature',
		};
	}
	return { valid: true };
}

// ── Payloads ──────────────────────────────────────────────────────────────
//
// Every delivery is `{ id, type, created_at, data: { object: Meeting } }`.
// `type` is one of six meeting events and is also sent in the
// `X-HappyScribe-Event` header. `id` begins with `evt_` and deduplicates
// retries.

export const HAPPYSCRIBE_WEBHOOK_EVENTS = [
	'meeting.recording_started',
	'meeting.recording_completed',
	'meeting.transcript_ready',
	'meeting.summary_ready',
	'meeting.failed',
	'meeting.cancelled',
] as const;

export const HappyScribeWebhookPayloadSchema = z
	.object({
		id: z.string().describe('Event ID beginning with `evt_`; deduplicate retries on it.'),
		type: z.string().describe('Event type, e.g. `meeting.summary_ready`.'),
		created_at: z.string().nullish(),
		data: z
			.object({
				// unknown: the embedded Meeting carries the full field set of
				// meetings.get, which varies by state.
				object: z.record(z.string(), z.unknown())
					.describe('Current representation of the Meeting.'),
			})
			.loose(),
	})
	.loose();

export type HappyScribeWebhookPayload = z.infer<
	typeof HappyScribeWebhookPayloadSchema
>;

export function eventSchema<const T extends readonly [string, ...string[]]>(types: T) {
	return HappyScribeWebhookPayloadSchema.extend({ type: z.enum(types) });
}

export type HappyScribeEventSchema = ReturnType<typeof eventSchema>;

/** Corsair webhook path -> the `type` values it handles. */
export const EVENT_TYPE_MAP: Record<string, readonly string[]> = {
	recordingStarted: ['meeting.recording_started'],
	recordingCompleted: ['meeting.recording_completed'],
	transcriptReady: ['meeting.transcript_ready'],
	summaryReady: ['meeting.summary_ready'],
	failed: ['meeting.failed'],
	cancelled: ['meeting.cancelled'],
};

export function createHappyScribeMatch(
	webhookPath: string,
): CorsairWebhookMatcher {
	const types = EVENT_TYPE_MAP[webhookPath] ?? [];
	return (request) => {
		const header = headerValue(request.headers, 'x-happyscribe-event');
		if (header) return types.includes(header);
		const body = readBodyRecord(request);
		const type = typeof body?.type === 'string' ? body.type : undefined;
		return type !== undefined && types.includes(type);
	};
}

// Deliveries whose `type` this plugin has no dedicated handler for. Check
// `type` before acting; HappyScribe can add event types.
export const matchOtherEvent: CorsairWebhookMatcher = (request) => {
	const header = headerValue(request.headers, 'x-happyscribe-event');
	const body = readBodyRecord(request);
	const type =
		header ?? (typeof body?.type === 'string' ? body.type : undefined);
	return type !== undefined && !Object.values(EVENT_TYPE_MAP).flat().includes(type);
}
