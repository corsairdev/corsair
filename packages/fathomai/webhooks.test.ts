import { createHmac } from 'node:crypto';
import { processWebhook } from 'corsair';
import { createCorsair, logEventFromContext } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { storableMeeting } from './endpoints/types';
import { fathomai } from './index';
import { MEETING } from './test-fixtures';
import { contentReady } from './webhooks/meetings';
import {
	claimFathomAiDelivery,
	FATHOM_AI_REMEMBERED_DELIVERIES,
	isFathomAiDelivery,
	releaseFathomAiDelivery,
	verifyFathomAiWebhook,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

// The Standard Webhooks reference key, stored bare so it is not mistaken for a live `whsec_` secret.
const KEY = 'MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw';
const SECRET = `whsec_${KEY}`;

// Signatures produced by the `standardwebhooks` npm library, the reference implementation Fathom's SDK uses.
const SPEC_VECTOR = {
	id: 'msg_p5jXN8AQM9LWM0D4loKWxJek',
	timestamp: 1614265330,
	body: '{"test": 2432232314}',
	signature: 'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=',
};
const DELIVERY = {
	id: 'msg_2x2zwLOcWaRTzsLK8KtbQt1FTk9',
	timestamp: 1740848700,
	body: JSON.stringify(MEETING),
	signature: 'v1,UWQ/f8lT9Gl9VxL5fD1r5d10yvQ3xpMdtQKarP8wMPM=',
};

// Shaped like the signed deliveries Fathom sent on 2026-11-23 (headers, id format, signatures,
// timestamp lag), re-signed with the test key and carrying the MEETING fixture as its body.
// Fathom's `webhook-timestamp` was a frozen value, 1795374848 (11-22 19:14:08 UTC), that
// arrived 58969 seconds (16.4 hours) late; its Content-Type is form-encoded though the body
// is JSON; and it listed two v1 signatures, of which only the first matched the secret.
const FROZEN_TIMESTAMP = 1795374848;
const ARRIVED_AT = FROZEN_TIMESTAMP + 58969;
const OTHER_KEY = Buffer.from('rotated-out-secret').toString('base64');

function sign(id: string, timestamp: number, body: string, key: string) {
	const digest = createHmac('sha256', Buffer.from(key, 'base64'))
		.update(`${id}.${timestamp}.${body}`)
		.digest('base64');
	return `v1,${digest}`;
}

function fathomShapedDelivery(id: string, body = JSON.stringify(MEETING)) {
	return {
		id,
		timestamp: FROZEN_TIMESTAMP,
		body,
		signature: `${sign(id, FROZEN_TIMESTAMP, body, KEY)} ${sign(id, FROZEN_TIMESTAMP, body, OTHER_KEY)}`,
	};
}

function fathomHeaders(delivery: typeof DELIVERY) {
	return {
		accept: '*/*',
		'accept-encoding': 'gzip',
		'content-type': 'application/x-www-form-urlencoded',
		'user-agent': 'Typhoeus - https://github.com/typhoeus/typhoeus',
		'webhook-id': delivery.id,
		'webhook-timestamp': String(delivery.timestamp),
		'webhook-signature': delivery.signature,
	};
}

function request(
	delivery: typeof DELIVERY,
	overrides: { signature?: string; rawBody?: string | undefined } = {},
) {
	return {
		payload: JSON.parse(delivery.body),
		rawBody: 'rawBody' in overrides ? overrides.rawBody : delivery.body,
		headers: {
			'webhook-id': delivery.id,
			'webhook-timestamp': String(delivery.timestamp),
			'webhook-signature': overrides.signature ?? delivery.signature,
		},
	};
}

describe('verifyFathomAiWebhook', () => {
	it('accepts the Standard Webhooks reference vector', () => {
		expect(verifyFathomAiWebhook(request(SPEC_VECTOR), SECRET)).toEqual({
			valid: true,
		});
	});

	it('accepts a rotated-key header when any listed signature matches', () => {
		const signature = `v1,bm90LXRoZS1yaWdodC1zaWduYXR1cmU= ${DELIVERY.signature}`;

		expect(
			verifyFathomAiWebhook(request(DELIVERY, { signature }), SECRET),
		).toEqual({ valid: true });
	});

	it('rejects a tampered body', () => {
		const tampered = DELIVERY.body.replace('123456789', '123456780');

		expect(
			verifyFathomAiWebhook(request(DELIVERY, { rawBody: tampered }), SECRET),
		).toEqual({ valid: false, error: 'Invalid webhook signature' });
	});

	it('rejects a signature made with another secret', () => {
		expect(
			verifyFathomAiWebhook(
				request(DELIVERY),
				'whsec_c29tZS1vdGhlci1zZWNyZXQ=',
			),
		).toEqual({ valid: false, error: 'Invalid webhook signature' });
	});

	it('accepts a delivery Fathom stamped 16 hours before it arrived', () => {
		jest.spyOn(Date, 'now').mockReturnValue(ARRIVED_AT * 1000);
		try {
			const delivery = fathomShapedDelivery(
				'0b9e6a3c-5d7f-4e21-9a4b-6c8d2f1e7a35',
			);

			expect(
				verifyFathomAiWebhook(
					{ ...request(delivery), headers: fathomHeaders(delivery) },
					SECRET,
				),
			).toEqual({ valid: true });
			expect(
				verifyFathomAiWebhook(
					{
						...request(delivery, {
							rawBody: delivery.body.replace('123456789', '123456780'),
						}),
						headers: fathomHeaders(delivery),
					},
					SECRET,
				),
			).toEqual({ valid: false, error: 'Invalid webhook signature' });
		} finally {
			jest.restoreAllMocks();
		}
	});

	it('rejects a malformed timestamp', () => {
		const signature = sign(DELIVERY.id, Number.NaN, DELIVERY.body, KEY);

		expect(
			verifyFathomAiWebhook(
				{
					...request(DELIVERY, { signature }),
					headers: {
						'webhook-id': DELIVERY.id,
						'webhook-timestamp': 'NaN',
						'webhook-signature': signature,
					},
				},
				SECRET,
			),
		).toEqual({ valid: false, error: 'Malformed webhook-timestamp' });
	});

	it('rejects a delivery with no raw body or no signature headers', () => {
		expect(
			verifyFathomAiWebhook(request(DELIVERY, { rawBody: undefined }), SECRET),
		).toEqual({ valid: false, error: 'Missing raw body' });
		expect(
			verifyFathomAiWebhook({ ...request(DELIVERY), headers: {} }, SECRET),
		).toEqual({ valid: false, error: 'Missing webhook signature headers' });
	});

	it('fails closed without a secret unless the hub already verified the delivery', () => {
		expect(verifyFathomAiWebhook(request(DELIVERY), undefined)).toMatchObject({
			valid: false,
		});
		expect(
			verifyFathomAiWebhook(
				{ ...request(DELIVERY), hubVerified: true },
				undefined,
			),
		).toEqual({ valid: true });
	});
});

describe('isFathomAiDelivery', () => {
	it('matches a signed meeting payload', () => {
		const { headers } = request(DELIVERY);
		expect(isFathomAiDelivery({ headers, body: MEETING })).toBe(true);
	});

	it('ignores Standard Webhooks deliveries from other providers', () => {
		const { headers } = request(DELIVERY);
		expect(
			isFathomAiDelivery({
				headers,
				body: { type: 'payment.succeeded', data: {} },
			}),
		).toBe(false);
	});

	it('ignores a meeting payload without signature headers', () => {
		expect(isFathomAiDelivery({ headers: {}, body: MEETING })).toBe(false);
	});
});

describe('claimFathomAiDelivery', () => {
	it('claims an id once per scope and forgets the oldest past the cap', () => {
		expect(claimFathomAiDelivery('cap-test', 'first')).toBe(true);
		expect(claimFathomAiDelivery('cap-test', 'first')).toBe(false);
		expect(claimFathomAiDelivery('other-account', 'first')).toBe(true);

		for (let n = 0; n < FATHOM_AI_REMEMBERED_DELIVERIES; n += 1) {
			claimFathomAiDelivery('cap-test', `filler-${n}`);
		}

		expect(claimFathomAiDelivery('cap-test', 'first')).toBe(true);
	});

	it('lets a released id be claimed again', () => {
		expect(claimFathomAiDelivery('release-test', 'id')).toBe(true);
		releaseFathomAiDelivery('release-test', 'id');
		expect(claimFathomAiDelivery('release-test', 'id')).toBe(true);
	});
});

describe('meetings.contentReady handler', () => {
	type Ctx = Parameters<typeof contentReady.handler>[0];
	type Req = Parameters<typeof contentReady.handler>[1];

	// `unknown`: the fake database records whatever the handler stores.
	const upserts: Array<[string, unknown]> = [];

	function ctxWithSecret(
		key: string,
		options: { accountId?: string; failUpserts?: number } = {},
	) {
		let failures = options.failUpserts ?? 0;
		// Safe (`as unknown as Ctx`): the handler reads only `key`, `$getAccountId` and `db.meetings`; the runtime builds the rest from a live database.
		return {
			key,
			$getAccountId: async () => options.accountId ?? 'account-1',
			db: {
				meetings: {
					// `unknown`: same fake database record.
					upsertByEntityId: async (id: string, data: unknown) => {
						if (failures > 0) {
							failures -= 1;
							throw new Error('database unavailable');
						}
						upserts.push([id, data]);
						return { id: 'entity-1' };
					},
				},
			},
		} as unknown as Ctx;
	}

	// `as unknown as Req`: a bare delivery object; the handler reads only headers, rawBody and payload.
	function fathomRequest(id: string) {
		const delivery = fathomShapedDelivery(id);
		return {
			...request(delivery),
			headers: fathomHeaders(delivery),
		} as unknown as Req;
	}

	beforeEach(() => {
		jest.clearAllMocks();
		upserts.length = 0;
	});

	it('stores the meeting and returns its corsair entity id', async () => {
		const ctx = ctxWithSecret(SECRET);

		const result = await contentReady.handler(
			ctx,
			// `as unknown as Req`: a bare delivery object; the handler reads only headers, rawBody and payload.
			request(DELIVERY) as unknown as Req,
		);

		expect(result).toEqual({
			success: true,
			corsairEntityId: 'entity-1',
			data: MEETING,
		});
		expect(upserts).toEqual([['123456789', storableMeeting(MEETING)]]);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'fathomai.webhook.meetings.contentReady',
			{ recording_id: 123456789 },
			'completed',
		);
	});

	it('answers 401 and stores nothing for a forged delivery', async () => {
		const result = await contentReady.handler(
			ctxWithSecret('whsec_c29tZS1vdGhlci1zZWNyZXQ='),
			fathomRequest('7c1d4e9a-2b3f-4a5c-8d6e-0f1a2b3c4d5e'),
		);

		expect(result).toEqual({
			success: false,
			statusCode: 401,
			error: 'Invalid webhook signature',
		});
		expect(upserts).toEqual([]);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('handles a repeated webhook-id once and answers the repeat with 200', async () => {
		const ctx = ctxWithSecret(SECRET);
		const id = '5e2f8b1c-9a7d-4c3e-b6f0-1d2e3f4a5b6c';

		const first = await contentReady.handler(ctx, fathomRequest(id));
		const repeat = await contentReady.handler(ctx, fathomRequest(id));

		expect(first).toMatchObject({ success: true });
		expect(repeat).toEqual({
			success: false,
			statusCode: 200,
			error: 'Duplicate delivery',
		});
		expect(upserts).toHaveLength(1);
		expect(logEventFromContext).toHaveBeenCalledTimes(1);
	});

	it('handles one delivery id separately for each account', async () => {
		const id = '9d4c2a1b-6e5f-4f70-8a9b-c0d1e2f3a4b5';

		const first = await contentReady.handler(
			ctxWithSecret(SECRET, { accountId: 'account-a' }),
			fathomRequest(id),
		);
		const second = await contentReady.handler(
			ctxWithSecret(SECRET, { accountId: 'account-b' }),
			fathomRequest(id),
		);

		expect(first).toMatchObject({ success: true });
		expect(second).toMatchObject({ success: true });
		expect(upserts).toHaveLength(2);
	});

	it("handles Fathom's retry after storing failed", async () => {
		const ctx = ctxWithSecret(SECRET, { failUpserts: 1 });
		const id = '2a3b4c5d-6e7f-4801-9a2b-3c4d5e6f7a8b';

		await expect(contentReady.handler(ctx, fathomRequest(id))).rejects.toThrow(
			'database unavailable',
		);
		const retry = await contentReady.handler(ctx, fathomRequest(id));

		expect(retry).toMatchObject({ success: true });
		expect(upserts).toHaveLength(1);
	});
});

describe('a delivery through processWebhook', () => {
	async function createClient(options: Parameters<typeof fathomai>[0]) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'fathomai', 'default');
		const corsair = createCorsair({
			plugins: [fathomai(options)],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.fathomai.keys.issue_new_dek();
		return { corsair, testDb };
	}

	beforeEach(() => {
		jest.spyOn(Date, 'now').mockReturnValue(ARRIVED_AT * 1000);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('verifies with the stored webhook secret and stores the meeting', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.fathomai.keys.set_webhook_signature(SECRET);
			const delivery = fathomShapedDelivery(
				'c3d4e5f6-a7b8-4c9d-8e0f-1a2b3c4d5e6f',
			);

			const result = await processWebhook(
				corsair,
				fathomHeaders(delivery),
				delivery.body,
			);

			expect(result.plugin).toBe('fathomai');
			expect(result.action).toBe('meetings.contentReady');
			expect(result.response).toMatchObject({ success: true });
			const stored =
				await corsair.fathomai.db.meetings.findByEntityId('123456789');
			expect(stored?.data).toEqual(storableMeeting(MEETING));
			expect(stored?.data).not.toHaveProperty('transcript');
		} finally {
			testDb.cleanup();
		}
	});

	it('verifies with a webhookSecret option given without the whsec_ prefix', async () => {
		const { corsair, testDb } = await createClient({ webhookSecret: KEY });
		try {
			const delivery = fathomShapedDelivery(
				'd4e5f6a7-b8c9-4d0e-9f1a-2b3c4d5e6f70',
			);

			const result = await processWebhook(
				corsair,
				fathomHeaders(delivery),
				delivery.body,
			);

			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('answers a redelivery with 200 without storing or logging it again', async () => {
		const { corsair, testDb } = await createClient({ webhookSecret: SECRET });
		try {
			const delivery = fathomShapedDelivery(
				'e5f6a7b8-c9d0-4e1f-8a2b-3c4d5e6f7a81',
			);

			const first = await processWebhook(
				corsair,
				fathomHeaders(delivery),
				delivery.body,
			);
			const repeat = await processWebhook(
				corsair,
				fathomHeaders(delivery),
				delivery.body,
			);

			expect(first.response).toMatchObject({ success: true });
			expect(repeat.response).toEqual({
				success: false,
				statusCode: 200,
				error: 'Duplicate delivery',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it("handles Fathom's retry when the webhookHooks.after hook failed", async () => {
		let afterCalls = 0;
		const { corsair, testDb } = await createClient({
			webhookSecret: SECRET,
			webhookHooks: {
				meetings: {
					contentReady: {
						after: async () => {
							afterCalls += 1;
							if (afterCalls === 1) throw new Error('hook failed');
						},
					},
				},
			},
		});
		try {
			const delivery = fathomShapedDelivery(
				'a7b8c9d0-e1f2-4a3b-8c4d-5e6f7a8b9c03',
			);

			const first = await processWebhook(
				corsair,
				fathomHeaders(delivery),
				delivery.body,
			);
			const retry = await processWebhook(
				corsair,
				fathomHeaders(delivery),
				delivery.body,
			);

			expect(first.response).toMatchObject({
				success: false,
				statusCode: 500,
				error: 'hook failed',
			});
			expect(retry.response).toMatchObject({ success: true });
			expect(afterCalls).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('answers 401 and stores nothing when the signature does not match', async () => {
		const { corsair, testDb } = await createClient({
			webhookSecret: 'whsec_c29tZS1vdGhlci1zZWNyZXQ=',
		});
		try {
			const delivery = fathomShapedDelivery(
				'f6a7b8c9-d0e1-4f2a-9b3c-4d5e6f7a8b92',
			);

			const result = await processWebhook(
				corsair,
				fathomHeaders(delivery),
				delivery.body,
			);

			expect(result.plugin).toBe('fathomai');
			expect(result.response).toMatchObject({
				success: false,
				statusCode: 401,
			});
			await expect(
				corsair.fathomai.db.meetings.findByEntityId('123456789'),
			).resolves.toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('leaves a non-Fathom delivery unclaimed', async () => {
		const { corsair, testDb } = await createClient({ webhookSecret: SECRET });
		try {
			const result = await processWebhook(corsair, request(DELIVERY).headers, {
				type: 'payment.succeeded',
				data: {},
			});

			expect(result.plugin).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});
});
