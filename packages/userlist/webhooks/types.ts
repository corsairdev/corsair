import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/**
 * Webhook payloads and signature verification.
 * Reference: https://userlist.com/docs/developers/webhooks/
 */

const UserSchema = z
	.object({
		id: z.string().nullish(),
		identifier: z.string().nullish(),
		email: z.string().nullish(),
		properties: z.record(z.string(), z.unknown()).nullish(),
		signed_up_at: z.string().nullish(),
		last_seen_at: z.string().nullish(),
		unsubscribed_at: z.string().nullish(),
		opted_in_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const CompanySchema = z
	.object({
		id: z.string().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		properties: z.record(z.string(), z.unknown()).nullish(),
		signed_up_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const RelationshipSchema = z
	.object({
		id: z.string().nullish(),
		properties: z.record(z.string(), z.unknown()).nullish(),
		user: UserSchema.nullish(),
		company: CompanySchema.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const MessageSchema = z
	.object({
		id: z.string().nullish(),
		identifier: z.string().nullish(),
		subject: z.string().nullish(),
		status: z.string().nullish(),
		user: UserSchema.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

/** The envelope every notification shares. */
const EnvelopeSchema = z.object({
	id: z.string(),
	name: z.string(),
	scope: z.string().nullish(),
	occurred_at: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
});

export const UserCreatedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('user_created'),
	user: UserSchema,
});

export const UserUpdatedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('user_updated'),
	user: UserSchema,
});

/** Carries the topic whose subscription changed. */
export const UserSubscribedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('user_subscribed'),
	user: UserSchema,
	topic: z.string().nullish(),
});

export const UserUnsubscribedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('user_unsubscribed'),
	user: UserSchema,
	topic: z.string().nullish(),
});

export const CompanyCreatedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('company_created'),
	company: CompanySchema,
});

export const CompanyUpdatedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('company_updated'),
	company: CompanySchema,
});

export const RelationshipCreatedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('relationship_created'),
	relationship: RelationshipSchema,
});

export const RelationshipUpdatedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('relationship_updated'),
	relationship: RelationshipSchema,
});

/** A hosted form was submitted; the answers are in `properties`. */
export const FormSubmittedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('form_submitted'),
	form: z
		.object({
			id: z.string().nullish(),
			identifier: z.string().nullish(),
			name: z.string().nullish(),
		})
		.loose()
		.nullish(),
	user: UserSchema.nullish(),
	properties: z.record(z.string(), z.unknown()).nullish(),
});

export const MessageEnqueuedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('message_enqueued'),
	message: MessageSchema.nullish(),
});

export const MessageOpenedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('message_opened'),
	message: MessageSchema.nullish(),
});

export const MessageClickedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('message_clicked'),
	message: MessageSchema.nullish(),
	url: z.string().nullish(),
});

export const MessageBouncedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('message_bounced'),
	message: MessageSchema.nullish(),
});

export const MessageReportedPayloadSchema = EnvelopeSchema.extend({
	name: z.literal('message_reported'),
	message: MessageSchema.nullish(),
});

export type UserCreatedPayload = z.infer<typeof UserCreatedPayloadSchema>;
export type UserUpdatedPayload = z.infer<typeof UserUpdatedPayloadSchema>;
export type UserSubscribedPayload = z.infer<typeof UserSubscribedPayloadSchema>;
export type UserUnsubscribedPayload = z.infer<
	typeof UserUnsubscribedPayloadSchema
>;
export type CompanyCreatedPayload = z.infer<typeof CompanyCreatedPayloadSchema>;
export type CompanyUpdatedPayload = z.infer<typeof CompanyUpdatedPayloadSchema>;
export type RelationshipCreatedPayload = z.infer<
	typeof RelationshipCreatedPayloadSchema
>;
export type RelationshipUpdatedPayload = z.infer<
	typeof RelationshipUpdatedPayloadSchema
>;
export type FormSubmittedPayload = z.infer<typeof FormSubmittedPayloadSchema>;
export type MessageEnqueuedPayload = z.infer<
	typeof MessageEnqueuedPayloadSchema
>;
export type MessageOpenedPayload = z.infer<typeof MessageOpenedPayloadSchema>;
export type MessageClickedPayload = z.infer<typeof MessageClickedPayloadSchema>;
export type MessageBouncedPayload = z.infer<typeof MessageBouncedPayloadSchema>;
export type MessageReportedPayload = z.infer<
	typeof MessageReportedPayloadSchema
>;

/** Every topic Userlist can deliver, as documented. */
export const USERLIST_WEBHOOK_EVENTS = [
	'user_created',
	'user_updated',
	'user_subscribed',
	'user_unsubscribed',
	'company_created',
	'company_updated',
	'relationship_created',
	'relationship_updated',
	'form_submitted',
	'message_enqueued',
	'message_opened',
	'message_clicked',
	'message_bounced',
	'message_reported',
] as const;

export type UserlistWebhookEvent = (typeof USERLIST_WEBHOOK_EVENTS)[number];

/**
 * Matches on the `name` field, which is the event type. The body arrives as a
 * string or already parsed, and a body that will not parse simply does not
 * match — the signature check is what rejects a bad request.
 */
export function createUserlistMatch(eventName: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		try {
			// unknown: the body is JSON, parsed here just to read one field.
			const body =
				typeof request.body === 'string'
					? (JSON.parse(request.body) as unknown)
					: request.body;
			return (
				typeof body === 'object' &&
				body !== null &&
				(body as { name?: unknown }).name === eventName
			);
		} catch {
			return false;
		}
	};
}

function firstHeader(
	headers: Record<string, unknown>,
	name: string,
): string | undefined {
	const value = headers[name];
	return Array.isArray(value) ? value[0] : (value as string | undefined);
}

/** Userlist's docs recommend rejecting a timestamp older than five minutes. */
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

/**
 * Verifies `X-Userlist-Signature: t=<timestamp>,v1=<hex hmac>`.
 *
 * The signed payload is `${timestamp}.${rawBody}` and the key is the webhook
 * secret shown on the webhook configuration screen — not the Push API key.
 * Comparison is constant-time, and a stale timestamp is refused so a captured
 * request cannot be replayed.
 */
export function verifyUserlistWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const header = firstHeader(request.headers, 'x-userlist-signature');
	if (!header) {
		return { valid: false, error: 'Missing X-Userlist-Signature header' };
	}

	let timestamp: string | undefined;
	let signature: string | undefined;
	for (const part of header.split(',')) {
		const [key, value] = part.split('=');
		if (key?.trim() === 't') timestamp = value?.trim();
		else if (key?.trim() === 'v1') signature = value?.trim();
	}

	if (!timestamp) {
		return { valid: false, error: 'Missing t in X-Userlist-Signature' };
	}
	if (!signature) {
		return { valid: false, error: 'Missing v1 in X-Userlist-Signature' };
	}

	const seconds = Number.parseInt(timestamp, 10);
	if (!Number.isFinite(seconds)) {
		return { valid: false, error: 'Invalid timestamp in X-Userlist-Signature' };
	}

	const now = Math.floor(Date.now() / 1000);
	if (Math.abs(now - seconds) > SIGNATURE_TOLERANCE_SECONDS) {
		return { valid: false, error: 'Webhook timestamp outside tolerance' };
	}

	const expected = createHmac('sha256', webhookSecret)
		.update(`${timestamp}.${rawBody}`)
		.digest('hex');

	// Equal length is required for timingSafeEqual, and a different length is
	// already a mismatch.
	const given = Buffer.from(signature, 'utf8');
	const computed = Buffer.from(expected, 'utf8');
	if (given.length !== computed.length || !timingSafeEqual(given, computed)) {
		return { valid: false, error: 'Incorrect signature' };
	}

	return { valid: true };
}
