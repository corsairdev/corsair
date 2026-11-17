import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { asRecord, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { SignwellContext } from '..';
import type { JsonObject, UnknownJson } from '../json';
import { isJsonObject } from '../json';

/**
 * SignWell posts one envelope for every event, so the payload schema is shared
 * and only the `event.type` differs per handler:
 *
 * ```json
 * { "event": { "hash", "time", "type", "related_signer": { "email", "name" } },
 *   "data": { "object": { …a document or a template… } } }
 * ```
 *
 * Docs: https://developers.signwell.com/reference/event-data
 */

export const SIGNWELL_EVENT_TYPES = [
	'document_created',
	'document_sent',
	'document_viewed',
	'document_in_progress',
	'document_recipients_updated',
	'document_signed',
	'document_completed',
	'document_expired',
	'document_declined',
	'document_canceled',
] as const;

export type SignwellEventType = (typeof SIGNWELL_EVENT_TYPES)[number];

/**
 * The object a delivery carries is a document or a template. A record already
 * accepts unlisted keys, so this stays a record rather than a loose object.
 */
const objectSchema = z.record(z.string(), z.unknown()); // unknown: any document

export const SignwellWebhookPayloadSchema = z
	.object({
		event: z
			.object({
				hash: z
					.string()
					.describe(
						'HMAC-SHA256 of `${type}@${time}`, keyed with the webhook id. Verify it before trusting the delivery.',
					),
				time: z.number().describe('Unix timestamp in seconds.'),
				type: z.string(),
				related_signer: z
					.object({
						email: z.string().nullish(),
						name: z.string().nullish(),
					})
					.loose()
					.nullish()
					.describe(
						'Present on document_viewed, document_signed and document_declined.',
					),
			})
			.loose(),
		data: z.object({ object: objectSchema }).loose(),
	})
	.loose();

export type SignwellWebhookPayload = z.infer<
	typeof SignwellWebhookPayloadSchema
>;

// ── Signature verification ────────────────────────────────────────────────

/**
 * SignWell signs the payload with the webhook id as the key, over the string
 * `event.type@event.time`. That covers the event type and its timestamp but not
 * the document, so a replayed envelope stays valid; only the id-scoped key stops
 * a delivery from another account being accepted here.
 *
 * https://developers.signwell.com/reference/event-hash-verification
 */
export function expectedSignature(
	webhookId: string,
	type: string,
	time: number,
): string {
	return createHmac('sha256', webhookId)
		.update(`${type}@${time}`)
		.digest('hex');
}

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Verifies a delivery. `webhookId` is the SignWell webhook's id, which is the
 * HMAC key: it is either the plugin's `webhookSecret` option or the account's
 * `webhook_signature`, and it can also be read from `webhooks.list`.
 */
export function verifySignwellWebhook(
	request: WebhookRequest<unknown>, // unknown: verified, then parsed
	webhookId: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };

	const key = webhookId?.trim();
	if (!key) {
		return {
			valid: false,
			error:
				'No SignWell webhook id is configured (plugin option webhookSecret, keys.set_webhook_signature, or the id from webhooks.list)',
		};
	}

	const record = asRecord(request.payload);
	const event = asRecord(record?.event);
	const hash = event?.hash;
	const time = event?.time;
	const type = event?.type;
	if (
		typeof hash !== 'string' ||
		typeof time !== 'number' ||
		typeof type !== 'string'
	) {
		return {
			valid: false,
			error: 'The delivery has no event hash, time or type.',
		};
	}

	return safeEqual(expectedSignature(key, type, time), hash)
		? { valid: true }
		: { valid: false, error: 'The SignWell event hash does not match.' };
}

// ── Matching ──────────────────────────────────────────────────────────────

/** Reads `event.type` from either a parsed body or a raw JSON string. */
function eventTypeOf(request: RawWebhookRequest): string | undefined {
	const body =
		typeof request.body === 'string' ? parseJson(request.body) : request.body;
	const event = asRecord(asRecord(body)?.event);
	const type = event?.type;
	return typeof type === 'string' ? type : undefined;
}

function parseJson(text: string): JsonObject | null {
	try {
		const parsed: UnknownJson = JSON.parse(text);
		return isJsonObject(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export function matchSignwellEvents(
	eventTypes: readonly string[],
): CorsairWebhookMatcher {
	return (request) => {
		const type = eventTypeOf(request);
		return type !== undefined && eventTypes.includes(type);
	};
}

// ── Handlers ──────────────────────────────────────────────────────────────

/**
 * One handler per event type. The delivery is rejected by throwing, not by
 * returning `success: false`: `processWebhook` builds its result as
 * `{ ...returnToSender, success: true }`, so a returned refusal is reported to
 * the caller as a successful delivery. A thrown error maps to a non-2xx.
 *
 * Document payloads carry signer email addresses and signature values, so only
 * the event type, timestamp and document id are logged.
 */
function handlerFor(
	event: SignwellEventType,
): CorsairWebhook<
	SignwellContext,
	SignwellWebhookPayload,
	SignwellWebhookPayload
> {
	return {
		match: matchSignwellEvents([event]),
		handler: async (ctx, request) => {
			const parsed = SignwellWebhookPayloadSchema.safeParse(request.payload);
			if (!parsed.success) {
				throw new Error(`Invalid SignWell ${event} payload`);
			}

			const verification = verifySignwellWebhook(request, ctx.key);
			if (!verification.valid) {
				throw new Error(verification.error ?? 'SignWell webhook rejected');
			}

			const record = asRecord(parsed.data.data.object);
			// unknown: the payload is one of many document or template shapes and
			// only the id is read here, which is a UUID string when present.
			const entityId = record?.id;
			await logEventFromContext(
				ctx,
				`signwell.webhook.${event}`,
				{
					eventType: event,
					eventTime: parsed.data.event.time,
					documentId: typeof entityId === 'string' ? entityId : undefined,
				},
				'completed',
			);

			return { success: true, data: parsed.data };
		},
	};
}

export const documentCreated = handlerFor('document_created');
export const documentSent = handlerFor('document_sent');
export const documentViewed = handlerFor('document_viewed');
export const documentInProgress = handlerFor('document_in_progress');
export const documentRecipientsUpdated = handlerFor(
	'document_recipients_updated',
);
export const documentSigned = handlerFor('document_signed');
export const documentCompleted = handlerFor('document_completed');
export const documentExpired = handlerFor('document_expired');
export const documentDeclined = handlerFor('document_declined');
export const documentCanceled = handlerFor('document_canceled');
