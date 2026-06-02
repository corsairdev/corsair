import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';
import { RawApiTweet, TwitterApiIOUser } from '../schema/database';

// ── Event Schemas ─────────────────────────────────────────────────────────────

export const TweetCreatedEventSchema = z.object({
	type: z.literal('tweet.created'),
	data: z.object({
		tweet: RawApiTweet,
		user: TwitterApiIOUser.optional(),
	}),
	timestamp: z.string().optional(),
	userId: z.string().optional(),
});

export const TweetFilterMatchEventSchema = z.object({
	type: z.literal('tweet.filter_match'),
	data: z.object({
		tweet: RawApiTweet,
		user: TwitterApiIOUser.optional(),
		matchedRules: z
			.array(
				z.object({
					id: z.string().optional(),
					tag: z.string().optional(),
					value: z.string().optional(),
				}),
			)
			.optional(),
	}),
	timestamp: z.string().optional(),
});

// ── Event Types ───────────────────────────────────────────────────────────────

export type TweetCreatedEvent = z.infer<typeof TweetCreatedEventSchema>;
export type TweetFilterMatchEvent = z.infer<typeof TweetFilterMatchEventSchema>;

export type TwitterApiIOWebhookEvent =
	| TweetCreatedEvent
	| TweetFilterMatchEvent;

// ── Webhook Outputs Map ───────────────────────────────────────────────────────

export type TwitterApiIOWebhookOutputs = {
	tweetCreated: TweetCreatedEvent;
	tweetFilterMatch: TweetFilterMatchEvent;
};

// ── Matcher Helpers ───────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	if (body && typeof body === 'object') {
		return body as Record<string, unknown>;
	}
	return {};
}

export function createTwitterApiIOMatch(
	eventType: string,
): (request: RawWebhookRequest) => boolean {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		return parsed?.type === eventType;
	};
}

// ── Signature Verification ────────────────────────────────────────────────────

export function verifyTwitterApiIOWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	const signature = request.headers['x-twitterapiio-signature'] as
		| string
		| undefined;

	if (!signature) {
		// If no secret is configured, treat as valid
		if (!secret) return { valid: true };
		return { valid: false, error: 'Missing x-twitterapiio-signature header' };
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
