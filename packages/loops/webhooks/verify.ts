import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { asRecord, getHeader, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LoopsContext } from '..';
import type { LoopsWebhookEventName } from './payloads';
import { LOOPS_WEBHOOK_EVENTS } from './payloads';

const KNOWN = new Set<string>(LOOPS_WEBHOOK_EVENTS);

/** The delivery body as a record, whether it arrives parsed or as raw JSON text. */
// unknown: a body from an unknown sender, narrowed by asRecord.
function bodyRecord(
	request: RawWebhookRequest,
): Record<string, unknown> | null {
	const body: unknown = request.body;
	if (typeof body !== 'string') return asRecord(body) ?? null;
	try {
		return asRecord(JSON.parse(body)) ?? null;
	} catch {
		return null;
	}
}

/**
 * A Loops delivery: Standard Webhooks headers plus Loops' own envelope
 * (`eventName` from the spec's list and `webhookSchemaVersion`), so another
 * provider's Standard Webhooks body on the shared route is not claimed.
 */
export function matchLoopsWebhook(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, 'webhook-signature')) return false;
	const body = bodyRecord(request);
	return (
		typeof body?.eventName === 'string' &&
		KNOWN.has(body.eventName) &&
		typeof body.webhookSchemaVersion === 'string'
	);
}

export function matchLoopsEvent(
	eventName: LoopsWebhookEventName,
): CorsairWebhookMatcher {
	return (request) => bodyRecord(request)?.eventName === eventName;
}

/** Loops' own verification example refuses deliveries more than five minutes off. */
const TOLERANCE_SECONDS = 5 * 60;

/**
 * Checks the webhook-signature header the way Loops documents it
 * (https://loops.so/docs/webhooks#verify-requests): HMAC-SHA256 over
 * `<webhook-id>.<webhook-timestamp>.<raw body>`, keyed with the signing secret
 * (its `whsec_` prefix stripped, the rest Base64-decoded), standard Base64.
 * After a secret is rolled Loops sends several space-separated `v1,<sig>`
 * entries for 24 hours; any one matching is enough.
 */
export function verifyLoopsWebhook(
	// unknown: the payload is parsed by the handler's schema after this check.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	now: number = Date.now(),
): { valid: true } | { valid: false; error: string } {
	if (request.hubVerified) return { valid: true };
	if (!secret?.trim()) {
		return {
			valid: false,
			error:
				'No Loops signing secret is configured: set webhookSecret or store it as the webhook signature',
		};
	}
	const rawBody = request.rawBody;
	if (!rawBody) {
		return { valid: false, error: 'Missing raw body for signature check' };
	}
	const id = getHeader(request.headers, 'webhook-id');
	const timestamp = getHeader(request.headers, 'webhook-timestamp');
	const signatures = getHeader(request.headers, 'webhook-signature');
	if (!id || !timestamp || !signatures) {
		return { valid: false, error: 'Missing webhook signature headers' };
	}
	if (!/^\d{1,12}$/.test(timestamp)) {
		return { valid: false, error: 'Invalid webhook-timestamp' };
	}
	if (Math.abs(now / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) {
		return { valid: false, error: 'Webhook timestamp is too old or too new' };
	}
	const trimmed = secret.trim();
	const key = Buffer.from(
		trimmed.startsWith('whsec_') ? trimmed.slice('whsec_'.length) : trimmed,
		'base64',
	);
	if (key.length === 0) {
		return { valid: false, error: 'Malformed webhook secret' };
	}
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${rawBody}`)
		.digest();
	const matched = signatures
		.split(/\s+/)
		.filter(Boolean)
		.some((part) => {
			const comma = part.indexOf(',');
			if (comma === -1 || part.slice(0, comma) !== 'v1') return false;
			const received = Buffer.from(part.slice(comma + 1), 'base64');
			return (
				received.length === expected.length &&
				timingSafeEqual(received, expected)
			);
		});
	return matched
		? { valid: true }
		: { valid: false, error: 'Invalid signature' };
}

/**
 * The ids worth logging for a delivery: never the contact's email, name or
 * custom properties.
 */
// unknown: payload fields are read defensively; the schema already parsed them.
function eventIds(payload: Record<string, unknown>): Record<string, string> {
	const ids: Record<string, string> = {};
	const identity = payload.contactIdentity;
	if (identity && typeof identity === 'object' && 'id' in identity) {
		const id = (identity as { id?: unknown }).id;
		if (typeof id === 'string') ids.contactId = id;
	}
	for (const key of ['campaignId', 'transactionalId', 'loopId']) {
		const value = payload[key];
		if (typeof value === 'string') ids[key] = value;
	}
	const email = payload.email;
	if (email && typeof email === 'object' && 'id' in email) {
		const id = (email as { id?: unknown }).id;
		if (typeof id === 'string') ids.emailId = id;
	}
	return ids;
}

export function loopsWebhook<S extends z.ZodType>(
	eventName: LoopsWebhookEventName,
	// A builder, so the payload schema is made on the first delivery, not at import.
	schema: () => S,
): CorsairWebhook<LoopsContext, z.input<S>, z.output<S>> {
	return {
		match: matchLoopsEvent(eventName),
		handler: async (ctx, request) => {
			const verified = verifyLoopsWebhook(request, ctx.key);
			if (!verified.valid) {
				return { success: false, statusCode: 401, error: verified.error };
			}
			const parsed = schema().safeParse(request.payload);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid Loops ${eventName} payload`,
				};
			}
			await logEventFromContext(
				ctx,
				`loops.webhook.${eventName}`,
				eventIds(parsed.data as Record<string, unknown>),
				'completed',
			);
			return { success: true, data: parsed.data };
		},
	};
}
