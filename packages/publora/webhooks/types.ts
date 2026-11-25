import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Publora sends every event as
 * `{ version: "1", event, timestamp, data }` with
 * `X-Publora-Event: <event>` and
 * `X-Publora-Signature: <hex HMAC-SHA256 of the raw body>`, keyed by the
 * secret that `webhooks.create` returned. The signature covers the raw bytes
 * of the whole envelope, so it is checked before the JSON is used.
 * Docs: https://docs.publora.com/endpoints/webhooks
 */
export const PUBLORA_SIGNATURE_HEADER = 'x-publora-signature';
export const PUBLORA_EVENT_HEADER = 'x-publora-event';

const S = z.string().nullable().optional();

const EnvelopeSchema = z
	.object({
		version: z.string().optional(),
		event: z.string(),
		timestamp: z.string(),
		data: z.record(z.string(), z.unknown()),
	})
	.loose();

/** `post.published`: one network copy went live. All seven keys are always sent. */
export const PostPublishedEventSchema = EnvelopeSchema.extend({
	event: z.literal('post.published'),
	data: z
		.object({
			postId: z.string(),
			postGroupId: z.string(),
			platform: z.string(),
			platformId: S,
			/** The network's own id for the live post. */
			postedId: S,
			/** Public URL; null until Publora backfills it. */
			permalink: S,
			publishedAt: S,
		})
		.loose(),
});
export type PostPublishedEvent = z.infer<typeof PostPublishedEventSchema>;

/** `post.failed`: one network copy could not be published. */
export const PostFailedEventSchema = EnvelopeSchema.extend({
	event: z.literal('post.failed'),
	data: z
		.object({
			postId: S,
			postGroupId: z.string(),
			platform: S,
			error: z.object({ code: S, message: S }).loose().nullable().optional(),
			failedAt: S,
		})
		.loose(),
});
export type PostFailedEvent = z.infer<typeof PostFailedEventSchema>;

/** `post.scheduled`: a post group got a publish time. */
export const PostScheduledEventSchema = EnvelopeSchema.extend({
	event: z.literal('post.scheduled'),
	data: z
		.object({
			postGroupId: z.string(),
			scheduledTime: S,
			/** Connection ids, e.g. `linkedin-ABC123`. */
			platforms: z.array(z.string()).nullable().optional(),
		})
		.loose(),
});
export type PostScheduledEvent = z.infer<typeof PostScheduledEventSchema>;

/**
 * `post.demoted`: a scheduled group went back to draft. `reason` and
 * `changeType` may gain new values, so they stay plain strings.
 */
export const PostDemotedEventSchema = EnvelopeSchema.extend({
	event: z.literal('post.demoted'),
	data: z
		.object({
			postGroupId: z.string(),
			reason: S,
			changeType: S,
			mediaFileId: S,
			errorCode: S,
			demotedAt: S,
		})
		.loose(),
});
export type PostDemotedEvent = z.infer<typeof PostDemotedEventSchema>;

export type PubloraWebhookOutputs = {
	published: PostPublishedEvent;
	failed: PostFailedEvent;
	scheduled: PostScheduledEvent;
	demoted: PostDemotedEvent;
};

const HANDLED_EVENTS = new Set([
	'post.published',
	'post.failed',
	'post.scheduled',
	'post.demoted',
]);

/** The event name from the body, falling back to the X-Publora-Event header. */
function eventOf(request: RawWebhookRequest): string | undefined {
	const body = readBodyRecord(request);
	if (body && typeof body.event === 'string') return body.event;
	return getHeader(request.headers, PUBLORA_EVENT_HEADER) ?? undefined;
}

/** Any signed Publora delivery this plugin handles (the plugin's webhook matcher). */
export function isPubloraDelivery(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, PUBLORA_SIGNATURE_HEADER)) return false;
	const event = eventOf(request);
	return event !== undefined && HANDLED_EVENTS.has(event);
}

export function createPubloraMatch(event: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => eventOf(request) === event;
}

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type PubloraWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyPubloraWebhookSignature(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): PubloraWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Publora webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const header = getHeader(request.headers, PUBLORA_SIGNATURE_HEADER);
	if (!header) {
		return { valid: false, error: 'Missing X-Publora-Signature header' };
	}
	// Publora sends the bare hex digest; a `sha256=` prefix is accepted too.
	const presented = header.startsWith('sha256=')
		? header.slice('sha256='.length)
		: header;
	const expected = createHmac('sha256', secret)
		.update(request.rawBody)
		.digest('hex');
	return safeEqual(presented.toLowerCase(), expected)
		? { valid: true }
		: { valid: false, error: 'Invalid Publora webhook signature' };
}
