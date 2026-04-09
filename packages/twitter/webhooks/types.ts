import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ── Event Schemas ─────────────────────────────────────────────────────────────

const TwitterV1UserSchema = z.object({
	id_str: z.string(),
	name: z.string(),
	screen_name: z.string(),
	profile_image_url_https: z.string().optional(),
	verified: z.boolean().optional(),
	followers_count: z.number().optional(),
	friends_count: z.number().optional(),
});

const TwitterV1TweetSchema = z.object({
	id_str: z.string(),
	text: z.string(),
	created_at: z.string().optional(),
	user: TwitterV1UserSchema.optional(),
	in_reply_to_status_id_str: z.string().nullable().optional(),
	in_reply_to_user_id_str: z.string().nullable().optional(),
	in_reply_to_screen_name: z.string().nullable().optional(),
	quoted_status_id_str: z.string().nullable().optional(),
	is_quote_status: z.boolean().optional(),
	retweet_count: z.number().optional(),
	favorite_count: z.number().optional(),
	lang: z.string().optional(),
});

export const TweetCreateEventSchema = z.object({
	for_user_id: z.string(),
	tweet_create_events: z.array(TwitterV1TweetSchema),
});

// ── Event Types ───────────────────────────────────────────────────────────────

export type TweetCreateEvent = z.infer<typeof TweetCreateEventSchema>;

export type TwitterWebhookEvent = TweetCreateEvent;

// ── Webhook Outputs Map ───────────────────────────────────────────────────────

export type TwitterWebhookOutputs = {
	tweetCreate: TweetCreateEvent;
};

// ── Matcher Helpers ───────────────────────────────────────────────────────────

// body is untyped at the call site because it can be a raw string (pre-middleware)
// or an already-parsed object, depending on the framework execution path
function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		try {
			// body arrives as raw string when not pre-parsed by middleware
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	if (body && typeof body === 'object') {
		// body is already parsed by upstream middleware
		return body as Record<string, unknown>;
	}
	return {};
}

export function createTwitterMatch(
	eventKey: string,
): (request: RawWebhookRequest) => boolean {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		return eventKey in parsed;
	};
}

// WebhookRequest is generic; payload type is unknown here because signature
// verification must happen before the payload can be safely typed
export function verifyTwitterWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	// headers typing is Record<string, string | string[] | undefined>; normalise to scalar string | undefined
	const signature = request.headers['x-twitter-webhooks-signature'] as
		| string
		| undefined;

	if (!signature) {
		if (!secret) return { valid: true };
		return {
			valid: false,
			error: 'Missing x-twitter-webhooks-signature header',
		};
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const isValid = verifyHmacSignature(rawBody, secret, signature, 'sha256');
	if (!isValid) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
