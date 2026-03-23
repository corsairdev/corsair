import { z } from 'zod';
import { verifyHmacSignature } from '../../../async-core/webhook-utils';
import type { RawWebhookRequest, WebhookRequest } from '../../../core';

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

// ── Signature Verification ────────────────────────────────────────────────────

export function verifyTwitterWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
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
