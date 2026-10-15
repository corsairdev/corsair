import type { WebhookRequest } from 'corsair/core';
import { createHmac } from 'crypto';
import {
	createTwittrApiMatch,
	TwittrApiTestEventSchema,
	TwittrApiTweetEventSchema,
	verifyTwittrApiWebhookSignature,
} from './webhooks/types';

const SECRET = 'whsec_test_secret';

function sign(t: string, rawBody: string): string {
	const v1 = createHmac('sha256', SECRET)
		.update(`${t}.${rawBody}`)
		.digest('hex');
	return `t=${t},v1=${v1}`;
}

const tweetBody = JSON.stringify({
	event: 'tweet',
	id: '1849203',
	monitoredUserId: '2244994945',
	tweetId: '2019881223666233717',
	tweetCreatedAt: '2026-02-06T21:09:45Z',
	detectedAt: '2026-02-06T21:09:46.212Z',
});

function requestWith(
	rawBody: string,
	signature: string,
	extraHeaders: Record<string, string> = {},
): WebhookRequest<unknown> {
	return {
		payload: JSON.parse(rawBody) as unknown,
		rawBody,
		headers: {
			'x-twittrapi-signature': signature,
			'x-twittrapi-event': 'tweet',
			'x-twittrapi-delivery': '1849203',
			...extraHeaders,
		},
	};
}

describe('TwittrAPI webhooks', () => {
	describe('signature verification', () => {
		it('accepts a valid t.v1 HMAC signature', () => {
			const t = String(Math.floor(Date.now() / 1000));
			const req = requestWith(tweetBody, sign(t, tweetBody));
			const result = verifyTwittrApiWebhookSignature(req, SECRET);
			expect(result.valid).toBe(true);
		});

		it('rejects a tampered body', () => {
			const t = String(Math.floor(Date.now() / 1000));
			const tampered = tweetBody.replace('1849203', '9999999');
			const req = requestWith(tampered, sign(t, tweetBody));
			const result = verifyTwittrApiWebhookSignature(req, SECRET);
			expect(result.valid).toBe(false);
			expect(result.error).toMatch('Invalid webhook signature');
		});

		it('rejects a wrong secret', () => {
			const t = String(Math.floor(Date.now() / 1000));
			const req = requestWith(tweetBody, sign(t, tweetBody));
			const result = verifyTwittrApiWebhookSignature(req, 'whsec_wrong');
			expect(result.valid).toBe(false);
		});

		it('rejects an expired timestamp', () => {
			const old = String(Math.floor(Date.now() / 1000) - 3600);
			const req = requestWith(tweetBody, sign(old, tweetBody));
			const result = verifyTwittrApiWebhookSignature(req, SECRET);
			expect(result.valid).toBe(false);
			expect(result.error).toMatch('outside tolerance');
		});

		it('rejects a missing signature header', () => {
			const req: WebhookRequest<unknown> = {
				payload: {},
				rawBody: tweetBody,
				headers: {},
			};
			const result = verifyTwittrApiWebhookSignature(req, SECRET);
			expect(result.valid).toBe(false);
			expect(result.error).toMatch('Missing x-twittrapi-signature');
		});

		it('rejects a missing secret', () => {
			const t = String(Math.floor(Date.now() / 1000));
			const req = requestWith(tweetBody, sign(t, tweetBody));
			const result = verifyTwittrApiWebhookSignature(req, '');
			expect(result.valid).toBe(false);
			expect(result.error).toMatch('Missing webhook secret');
		});

		it('rejects a malformed signature header', () => {
			const req = requestWith(tweetBody, 'not-a-signature');
			const result = verifyTwittrApiWebhookSignature(req, SECRET);
			expect(result.valid).toBe(false);
			expect(result.error).toMatch('Malformed');
		});

		it('rejects a missing raw body', () => {
			const t = String(Math.floor(Date.now() / 1000));
			const req: WebhookRequest<unknown> = {
				payload: {},
				// Narrow test-only cast to exercise the missing-body guard.
				rawBody: undefined as unknown as string,
				headers: { 'x-twittrapi-signature': sign(t, tweetBody) },
			};
			const result = verifyTwittrApiWebhookSignature(req, SECRET);
			expect(result.valid).toBe(false);
			expect(result.error).toMatch('raw body');
		});
	});

	describe('event matching', () => {
		it('matches tweet events by header', () => {
			const match = createTwittrApiMatch('tweet');
			expect(
				match({
					headers: { 'x-twittrapi-event': 'tweet' },
					body: '{}',
				} as never),
			).toBe(true);
		});

		it('matches tweet events by body', () => {
			const match = createTwittrApiMatch('tweet');
			expect(match({ headers: {}, body: tweetBody } as never)).toBe(true);
		});

		it('matches test events', () => {
			const match = createTwittrApiMatch('test');
			expect(
				match({
					headers: { 'x-twittrapi-event': 'test' },
					body: JSON.stringify({ event: 'test', id: '1' }),
				} as never),
			).toBe(true);
		});

		it('does not match other events', () => {
			const match = createTwittrApiMatch('tweet');
			expect(
				match({
					headers: { 'x-twittrapi-event': 'test' },
					body: JSON.stringify({ event: 'test', id: '1' }),
				} as never),
			).toBe(false);
		});
	});

	describe('event schemas', () => {
		it('parses tweet events with the delivery id for dedupe', () => {
			const parsed = TwittrApiTweetEventSchema.parse(JSON.parse(tweetBody));
			expect(parsed.id).toBe('1849203');
			expect(parsed.monitoredUserId).toBe('2244994945');
			expect(parsed.tweetId).toBe('2019881223666233717');
		});

		it('parses test events', () => {
			const parsed = TwittrApiTestEventSchema.parse({
				event: 'test',
				id: 'test-1',
			});
			expect(parsed.event).toBe('test');
		});
	});
});
