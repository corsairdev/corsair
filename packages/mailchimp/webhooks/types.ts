import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const MailchimpWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	fired_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});

export type MailchimpWebhookPayload = z.infer<
	typeof MailchimpWebhookPayloadSchema
>;

/**
 * Mailchimp's four webhook trigger types (list-scoped). `upemail` (email
 * change) and `cleaned` (bounce) are also delivered by the API and are
 * recognized so they can be routed without error.
 */
export const MailchimpWebhookTypes = [
	'subscribe',
	'unsubscribe',
	'profile',
	'campaign',
	'upemail',
	'cleaned',
] as const;

export type MailchimpWebhookType = (typeof MailchimpWebhookTypes)[number];

const memberData = z
	.object({
		id: z.string().optional(),
		list_id: z.string().optional(),
		email: z.string().optional(),
		merges: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export const SubscribeEventSchema = MailchimpWebhookPayloadSchema.extend({
	type: z.literal('subscribe'),
	data: memberData,
});
export const UnsubscribeEventSchema = MailchimpWebhookPayloadSchema.extend({
	type: z.literal('unsubscribe'),
	data: memberData,
});
export const ProfileEventSchema = MailchimpWebhookPayloadSchema.extend({
	type: z.literal('profile'),
	data: memberData,
});
export const CampaignEventSchema = MailchimpWebhookPayloadSchema.extend({
	type: z.literal('campaign'),
	data: z
		.object({
			id: z.string().optional(),
			list_id: z.string().optional(),
			subject: z.string().optional(),
			status: z.string().optional(),
		})
		.loose(),
});

export const MailchimpTriggerEventSchema = z.discriminatedUnion('type', [
	SubscribeEventSchema,
	UnsubscribeEventSchema,
	ProfileEventSchema,
	CampaignEventSchema,
]);

export type SubscribeEvent = z.infer<typeof SubscribeEventSchema>;
export type UnsubscribeEvent = z.infer<typeof UnsubscribeEventSchema>;
export type ProfileEvent = z.infer<typeof ProfileEventSchema>;
export type CampaignEvent = z.infer<typeof CampaignEventSchema>;

export type MailchimpWebhookOutputs = {
	subscribe: SubscribeEvent;
	unsubscribe: UnsubscribeEvent;
	profile: ProfileEvent;
	campaign: CampaignEvent;
};

/**
 * Assigns `value` into `target` following Mailchimp's bracketed form-encoding
 * (`data[merges][FNAME]=Bob` → `{ data: { merges: { FNAME: 'Bob' } } }`).
 *
 * Bracket parsing is done with literal string slicing (no regex) and rejects
 * any segment named `__proto__`, `constructor`, or `prototype` to prevent
 * prototype pollution from malicious webhook bodies.
 */
const UNSAFE_BRACKET_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function assignBracketPath(
	target: Record<string, unknown>,
	rawKey: string,
	value: string,
): void {
	const firstBracket = rawKey.indexOf('[');
	if (firstBracket === -1) {
		if (UNSAFE_BRACKET_KEYS.has(rawKey)) return;
		target[rawKey] = value;
		return;
	}

	const segments = [rawKey.slice(0, firstBracket)];
	const bracketed = rawKey.slice(firstBracket);
	for (let i = 0; i < bracketed.length; ) {
		if (bracketed[i] !== '[') break;
		const end = bracketed.indexOf(']', i);
		if (end === -1) break;
		segments.push(bracketed.slice(i + 1, end));
		i = end + 1;
	}

	if (segments.some((s) => UNSAFE_BRACKET_KEYS.has(s))) return;

	let cursor: Record<string, unknown> = target;
	for (const key of segments.slice(0, -1)) {
		const existing = cursor[key];
		if (existing === null || typeof existing !== 'object') {
			cursor[key] = {};
		}
		cursor = cursor[key] as Record<string, unknown>;
	}

	const lastKey = segments[segments.length - 1];
	if (lastKey !== undefined) {
		cursor[lastKey] = value;
	}
}

/**
 * Parses a Mailchimp webhook body. Mailchimp delivers webhooks as
 * `application/x-www-form-urlencoded` with bracketed nested keys (not JSON),
 * so a form-encoded string is decoded into a nested object. Already-parsed
 * objects and JSON strings are also accepted for robustness.
 */
export function parseMailchimpWebhookBody(
	body: unknown,
): Record<string, unknown> | null {
	if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
		return body as Record<string, unknown>;
	}
	if (typeof body !== 'string') {
		return null;
	}

	const trimmed = body.trim();
	if (!trimmed) return null;

	// JSON body (defensive — some proxies re-encode as JSON).
	if (trimmed.startsWith('{')) {
		try {
			const parsed = JSON.parse(trimmed);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}

	// Form-encoded body.
	const params = new URLSearchParams(trimmed);
	const result: Record<string, unknown> = {};
	let sawKey = false;
	for (const [key, value] of params) {
		sawKey = true;
		assignBracketPath(result, key, value);
	}
	return sawKey ? result : null;
}

export function createMailchimpMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseMailchimpWebhookBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

/**
 * Mailchimp does not sign webhook requests. The recommended way to secure a
 * Mailchimp webhook is to embed a secret in the webhook URL and validate it on
 * receipt. This checks the configured secret against a query parameter
 * (default `secret`) using a constant-time comparison so timing side-channels
 * cannot leak the configured secret byte-by-byte.
 */
export function verifyMailchimpWebhookSecret(
	request: Pick<WebhookRequest<unknown>, 'query'>,
	secret: string | undefined,
	paramName = 'secret',
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}
	const raw = request.query?.[paramName];
	const provided = Array.isArray(raw) ? raw[0] : raw;
	if (!provided) {
		return { valid: false, error: `Missing "${paramName}" query parameter` };
	}
	if (provided.length !== secret.length) {
		return { valid: false, error: 'Invalid webhook secret' };
	}
	if (!timingSafeEqual(Buffer.from(provided), Buffer.from(secret))) {
		return { valid: false, error: 'Invalid webhook secret' };
	}
	return { valid: true };
}
