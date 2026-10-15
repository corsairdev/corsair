import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';
import { TwittrApiTweet } from '../schema/database';

// ── Event schemas (TwittrAPI account monitoring) ─────────────────────────────

export const TwittrApiTweetEventSchema = z.object({
	event: z.literal('tweet'),
	id: z.string(),
	monitoredUserId: z.string(),
	tweetId: z.string(),
	tweetCreatedAt: z.string(),
	detectedAt: z.string(),
	tweet: TwittrApiTweet.optional(),
});

export type TwittrApiTweetEvent = z.infer<typeof TwittrApiTweetEventSchema>;

export const TwittrApiTestEventSchema = z.object({
	event: z.literal('test'),
	id: z.string(),
	monitoredUserId: z.string().optional(),
	tweetId: z.string().optional(),
	tweetCreatedAt: z.string().optional(),
	detectedAt: z.string().optional(),
	tweet: TwittrApiTweet.optional(),
});

export type TwittrApiTestEvent = z.infer<typeof TwittrApiTestEventSchema>;

export type TwittrApiWebhookOutputs = {
	tweet: TwittrApiTweetEvent;
	test: TwittrApiTestEvent;
};

// ── Matcher helpers ──────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const direct = headers[name];
	if (typeof direct === 'string') return direct;
	if (Array.isArray(direct)) return direct[0];
	const lower = headers[name.toLowerCase()];
	if (typeof lower === 'string') return lower;
	if (Array.isArray(lower)) return lower[0];
	return undefined;
}

export function createTwittrApiMatch(
	eventType: 'tweet' | 'test',
): (request: RawWebhookRequest) => boolean {
	return (request: RawWebhookRequest) => {
		const headerEvent = headerValue(request.headers, 'x-twittrapi-event');
		if (headerEvent === eventType) return true;
		const parsed = parseBody(request.body);
		return parsed !== null && parsed.event === eventType;
	};
}

// ── Signature verification ───────────────────────────────────────────────────
// Header: X-TwittrAPI-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">
// with the webhook's secret. Reject timestamps >5min away to block replays.

export function parseTwittrApiSignatureHeader(header: string): {
	t?: string;
	v1?: string;
} {
	const parts: Record<string, string> = {};
	for (const part of header.split(',')) {
		const idx = part.indexOf('=');
		if (idx < 0) continue;
		const key = part.slice(0, idx).trim();
		const value = part.slice(idx + 1).trim();
		if (key) parts[key] = value;
	}
	return { t: parts.t, v1: parts.v1 };
}

export function verifyTwittrApiWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
	options: { toleranceSeconds?: number; nowSeconds?: number } = {},
): { valid: boolean; error?: string } {
	const { toleranceSeconds = 300, nowSeconds } = options;

	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const signatureHeader =
		(request.headers['x-twittrapi-signature'] as string | undefined) ??
		(request.headers['X-TwittrAPI-Signature'] as string | undefined);

	if (!signatureHeader) {
		return { valid: false, error: 'Missing x-twittrapi-signature header' };
	}

	const { t, v1 } = parseTwittrApiSignatureHeader(signatureHeader);
	if (!t || !v1) {
		return { valid: false, error: 'Malformed x-twittrapi-signature header' };
	}

	if (!/^\d+$/.test(t)) {
		return { valid: false, error: 'Invalid signature timestamp' };
	}

	const now = nowSeconds ?? Math.floor(Date.now() / 1000);
	if (Math.abs(now - Number(t)) > toleranceSeconds) {
		return { valid: false, error: 'Signature timestamp outside tolerance' };
	}

	const rawBody = request.rawBody;

	if (rawBody === undefined) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const expected = createHmac('sha256', secret)
		.update(`${t}.`)
		.update(rawBody)
		.digest('hex');

	try {
		const valid =
			expected.length === v1.length &&
			timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
		if (!valid) {
			return { valid: false, error: 'Invalid webhook signature' };
		}
	} catch {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
