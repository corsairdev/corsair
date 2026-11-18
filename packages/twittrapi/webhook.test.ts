import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { createHmac } from 'crypto';
import { twittrapi } from './index';
import { matchTwittrApiTenantWebhook } from './webhooks/tenant-matcher';
import {
	recordDelivery,
	test as testHandler,
	tweet as tweetHandler,
} from './webhooks/tweets';
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
		// Test-only: fixtures exercise the pre-parse verifier path, so the
		// payload stays untyped (a static event type would defeat the test).
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

		it('trusts Hub-verified deliveries without a secret', () => {
			const req: WebhookRequest<unknown> = {
				payload: {},
				rawBody: tweetBody,
				headers: {},
				hubVerified: true,
			};
			const result = verifyTwittrApiWebhookSignature(req, '');
			expect(result.valid).toBe(true);
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
				}),
			).toBe(true);
		});

		it('matches tweet events by body', () => {
			const match = createTwittrApiMatch('tweet');
			expect(match({ headers: {}, body: tweetBody })).toBe(true);
		});

		it('matches test events', () => {
			const match = createTwittrApiMatch('test');
			expect(
				match({
					headers: { 'x-twittrapi-event': 'test' },
					body: JSON.stringify({ event: 'test', id: '1' }),
				}),
			).toBe(true);
		});

		it('does not match other events', () => {
			const match = createTwittrApiMatch('tweet');
			expect(
				match({
					headers: { 'x-twittrapi-event': 'test' },
					body: JSON.stringify({ event: 'test', id: '1' }),
				}),
			).toBe(false);
		});
	});

	describe('delivery dedupe', () => {
		function stubDb() {
			// Test-only in-memory store: untyped values because recordDelivery
			// accepts raw provider JSON of varying shapes by design.
			const store = new Map<string, unknown>();
			const db = {
				monitorEvents: {
					findByEntityId: async (id: string) =>
						store.has(id) ? { id, data: store.get(id) } : null,
					upsertByEntityId: async (id: string, data: unknown) => {
						store.set(id, data);
						return { id };
					},
				},
			} as never;
			return { db, store };
		}

		it('records minimal test events under their event id', async () => {
			const { db, store } = stubDb();
			await recordDelivery(db, { event: 'test', id: 'evt-1' });
			await recordDelivery(db, { event: 'test', id: 'evt-1' });
			expect([...store.keys()]).toEqual(['evt-1']);
		});

		it('records full tweet events', async () => {
			const { db, store } = stubDb();
			// Test-only: raw provider JSON stays untyped by design (see above).
			await recordDelivery(db, JSON.parse(tweetBody) as unknown);
			expect(store.has('1849203')).toBe(true);
		});

		it('ignores payloads without a delivery id', async () => {
			const { db, store } = stubDb();
			await recordDelivery(db, null);
			await recordDelivery(db, { event: 'test' });
			expect(store.size).toBe(0);
		});
	});

	describe('duplicate deliveries', () => {
		function signedRequest(rawBody: string, event: string) {
			const t = String(Math.floor(Date.now() / 1000));
			return {
				// Test-only: raw provider JSON stays untyped to exercise the
				// handler's own narrowing, mirroring production transports.
				payload: JSON.parse(rawBody) as unknown,
				rawBody,
				headers: {
					'x-twittrapi-signature': sign(t, rawBody),
					'x-twittrapi-event': event,
					'x-twittrapi-delivery': '1849203',
				},
			};
		}

		it('processes a redelivery again, so a hook that failed gets another run', async () => {
			const persistTweet = jest.fn(async () => ({ id: 'x' }));
			const events = new Map<string, unknown>();
			// Test-only: partial stub of the full Corsair context; the handler
			// only touches ctx.db and ctx.key on this path.
			const ctx = {
				db: {
					monitorEvents: {
						findByEntityId: async (id: string) =>
							events.has(id) ? { id, data: events.get(id) } : null,
						upsertByEntityId: async (id: string, data: unknown) => {
							events.set(id, data);
							return { id };
						},
					},
					tweets: { upsertByEntityId: persistTweet },
				},
				key: SECRET,
			} as never;
			// The event was already stored, as monitors.getEvents would do.
			events.set('1849203', JSON.parse(tweetBody));
			const withTweet = JSON.stringify({
				...JSON.parse(tweetBody),
				tweet: undefined,
			});

			const first = await tweetHandler.handler(
				ctx,
				signedRequest(withTweet, 'tweet') as never,
			);
			const second = await tweetHandler.handler(
				ctx,
				signedRequest(withTweet, 'tweet') as never,
			);

			expect(first.success).toBe(true);
			expect(second.success).toBe(true);
			// Both upsert the same row: nothing is stored twice.
			expect([...events.keys()]).toEqual(['1849203']);
		});

		it('processes test redeliveries too', async () => {
			// Test-only partial stub (see above).
			const ctx = {
				db: {
					monitorEvents: {
						findByEntityId: async () => ({ id: 'test-1' }),
						upsertByEntityId: async () => ({ id: 'test-1' }),
					},
				},
				key: SECRET,
			} as never;
			const body = JSON.stringify({ event: 'test', id: 'test-1' });

			const result = await testHandler.handler(
				ctx,
				signedRequest(body, 'test') as never,
			);

			expect(result.success).toBe(true);
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

	describe('tenant and plugin routing', () => {
		function raw(headers: Record<string, string>, body = tweetBody) {
			const request: RawWebhookRequest = { headers, body };
			return request;
		}

		it('routes by the webhook ID header, whatever account was watched', () => {
			// Two deliveries for different watched accounts on the same webhook
			// must reach the same tenant.
			const other = JSON.stringify({
				...JSON.parse(tweetBody),
				monitoredUserId: '783214',
			});
			expect(
				matchTwittrApiTenantWebhook(raw({ 'x-twittrapi-webhook': '18' })),
			).toEqual({ linkType: 'webhook_id', externalId: '18' });
			expect(
				matchTwittrApiTenantWebhook(
					raw({ 'x-twittrapi-webhook': '18' }, other),
				),
			).toEqual({ linkType: 'webhook_id', externalId: '18' });
		});

		it('returns null without the webhook ID header', () => {
			expect(matchTwittrApiTenantWebhook(raw({}))).toBeNull();
		});

		it('claims signed TwittrAPI deliveries only', () => {
			const matcher = twittrapi().pluginWebhookMatcher!;
			expect(matcher(raw({ 'x-twittrapi-signature': 't=1,v1=abc' }))).toBe(
				true,
			);
			expect(matcher(raw({ 'x-twittrapi-event': 'test' }))).toBe(true);
			// Another provider's {"event":"test"} body without TwittrAPI headers.
			expect(matcher(raw({}, JSON.stringify({ event: 'test', id: '1' })))).toBe(
				false,
			);
		});
	});

	describe('array-valued headers', () => {
		it('verifies a signature handed over as string[]', () => {
			const t = String(Math.floor(Date.now() / 1000));
			const request = requestWith(tweetBody, sign(t, tweetBody));
			request.headers['x-twittrapi-signature'] = [sign(t, tweetBody)];
			expect(verifyTwittrApiWebhookSignature(request, SECRET).valid).toBe(true);
		});

		it('reads the raw header spelling too', () => {
			const t = String(Math.floor(Date.now() / 1000));
			const request = requestWith(tweetBody, '');
			delete request.headers['x-twittrapi-signature'];
			request.headers['X-TwittrAPI-Signature'] = sign(t, tweetBody);
			expect(verifyTwittrApiWebhookSignature(request, SECRET).valid).toBe(true);
		});
	});
});
