import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext, readBodyRecord } from 'corsair/core';
import {
	getInkboxWebhookPayloadSchema,
	inkboxWebhookFor,
} from '../endpoints/openapi-schema';
import type { InkboxWebhookPayloads } from '../endpoints/operation-types';
import type { InkboxContext } from '../index';

/**
 * Inkbox signs every delivery for an identity that has a signing key
 * (identities.signingKey.createOrRotate, or the secret returned once by the
 * first webhooks.subscriptions.create for that identity):
 *
 *   X-Inkbox-Request-ID, X-Inkbox-Timestamp (Unix seconds),
 *   X-Inkbox-Signature: sha256=<hex HMAC-SHA256 of `${request id}.${timestamp}.${raw body}`>
 *
 * keyed by the plaintext key with its `whsec_` prefix removed. Inkbox's docs
 * ask receivers to refuse a timestamp more than 300 seconds from now.
 * https://inkbox.ai/docs/api/phone/webhooks.md#verifying-webhook-signatures
 */
export const INKBOX_WEBHOOK_TOLERANCE_SECONDS = 300;

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type InkboxWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyInkboxWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	nowSeconds: number = Math.floor(Date.now() / 1000),
): InkboxWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Inkbox signing key is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const requestId = getHeader(request.headers, 'x-inkbox-request-id');
	const timestamp = getHeader(request.headers, 'x-inkbox-timestamp');
	const signature = getHeader(request.headers, 'x-inkbox-signature');
	if (!requestId || !timestamp || !signature) {
		// Inkbox sends no signature headers for an identity without a signing key.
		return { valid: false, error: 'Missing Inkbox signature headers' };
	}
	if (!/^\d{1,12}$/.test(timestamp)) {
		return { valid: false, error: 'Malformed X-Inkbox-Timestamp' };
	}
	if (
		Math.abs(nowSeconds - Number(timestamp)) > INKBOX_WEBHOOK_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'Stale X-Inkbox-Timestamp' };
	}
	if (!signature.startsWith('sha256=')) {
		return { valid: false, error: 'Malformed X-Inkbox-Signature' };
	}
	const key = secret.startsWith('whsec_')
		? secret.slice('whsec_'.length)
		: secret;
	const expected = createHmac('sha256', key)
		.update(`${requestId}.${timestamp}.${request.rawBody}`)
		.digest('hex');
	return safeEqual(signature.slice('sha256='.length).toLowerCase(), expected)
		? { valid: true }
		: { valid: false, error: 'Invalid Inkbox webhook signature' };
}

/** The event envelope every signed Inkbox webhook shares: `{ id, event_type, timestamp, data }`. */
function eventTypeOf(request: RawWebhookRequest): string | undefined {
	const body = readBodyRecord(request);
	if (
		!body ||
		typeof body.event_type !== 'string' ||
		typeof body.id !== 'string' ||
		typeof body.data !== 'object' ||
		body.data === null
	) {
		return undefined;
	}
	return body.event_type;
}

/** Any Inkbox event this plugin handles (used as the plugin's webhook matcher). */
export function isInkboxDelivery(request: RawWebhookRequest): boolean {
	const eventType = eventTypeOf(request);
	return eventType !== undefined && webhookIdFor(eventType) !== undefined;
}

export type InkboxWebhookId = keyof InkboxWebhookPayloads;

const WEBHOOK_IDS = [
	'a2a.taskEvent',
	'imessage.messageEvent',
	'mail.messageEvent',
	'phone.callEnded',
	'phone.textEvent',
	'slack.event',
	'transcriptions.finished',
	'whatsapp.messageEvent',
] as const satisfies readonly InkboxWebhookId[];

/** Which webhook handles an event type (`text.received` → `phone.textEvent`). */
export function webhookIdFor(eventType: string): InkboxWebhookId | undefined {
	return WEBHOOK_IDS.find((id) =>
		inkboxWebhookFor(id).events.includes(eventType),
	);
}

export type InkboxWebhook<Id extends InkboxWebhookId> = CorsairWebhook<
	InkboxContext,
	InkboxWebhookPayloads[Id],
	InkboxWebhookPayloads[Id]
>;

/**
 * One webhook per Inkbox channel. It matches the event types its payload
 * carries, checks the signature with the identity's signing key, and returns
 * the event parsed against Inkbox's published payload schema. The event `id`
 * stays the same across Inkbox's retries and replays: use it to skip a
 * delivery already handled.
 */
function inkboxWebhook<Id extends InkboxWebhookId>(id: Id): InkboxWebhook<Id> {
	return {
		match: (request) => {
			const eventType = eventTypeOf(request);
			return (
				eventType !== undefined &&
				inkboxWebhookFor(id).events.includes(eventType)
			);
		},
		handler: async (ctx, request) => {
			const verification = verifyInkboxWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = getInkboxWebhookPayloadSchema(id).safeParse(
				request.payload,
			);
			if (!parsed.success) {
				// Paths only: the payload holds message content and phone numbers.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `Inkbox ${id} payload did not match its documented schema (${where})`,
				};
			}
			const event = parsed.data as InkboxWebhookPayloads[Id];
			await logEventFromContext(
				ctx,
				`inkbox.webhook.${id}`,
				// The event type and id only: data holds message bodies, numbers and addresses.
				{
					// `unknown` because the parsed event's fields are typed per webhook; only these two are logged.
					eventType: (event as { event_type?: unknown }).event_type,
					eventId: (event as { id?: unknown }).id,
				},
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const inkboxWebhooksNested = {
	a2a: { taskEvent: inkboxWebhook('a2a.taskEvent') },
	imessage: { messageEvent: inkboxWebhook('imessage.messageEvent') },
	mail: { messageEvent: inkboxWebhook('mail.messageEvent') },
	phone: {
		callEnded: inkboxWebhook('phone.callEnded'),
		textEvent: inkboxWebhook('phone.textEvent'),
	},
	slack: { event: inkboxWebhook('slack.event') },
	transcriptions: { finished: inkboxWebhook('transcriptions.finished') },
	whatsapp: { messageEvent: inkboxWebhook('whatsapp.messageEvent') },
} as const;

function describe(id: InkboxWebhookId): string {
	const webhook = inkboxWebhookFor(id);
	return `${webhook.summary}: ${webhook.events.join(', ')}`;
}

/** Schemas are getters, so a payload schema is built only when something reads it. */
function webhookSchemaEntry(id: InkboxWebhookId) {
	return {
		description: describe(id),
		get payload() {
			return getInkboxWebhookPayloadSchema(id);
		},
		get response() {
			return getInkboxWebhookPayloadSchema(id);
		},
	};
}

export const inkboxWebhookSchemas = {
	'a2a.taskEvent': webhookSchemaEntry('a2a.taskEvent'),
	'imessage.messageEvent': webhookSchemaEntry('imessage.messageEvent'),
	'mail.messageEvent': webhookSchemaEntry('mail.messageEvent'),
	'phone.callEnded': webhookSchemaEntry('phone.callEnded'),
	'phone.textEvent': webhookSchemaEntry('phone.textEvent'),
	'slack.event': webhookSchemaEntry('slack.event'),
	'transcriptions.finished': webhookSchemaEntry('transcriptions.finished'),
	'whatsapp.messageEvent': webhookSchemaEntry('whatsapp.messageEvent'),
};
