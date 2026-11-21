import { processWebhook } from 'corsair';
import { createCorsair, logEventFromContext } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { fathomai } from './index';
import { MEETING } from './test-fixtures';
import { contentReady } from './webhooks/meetings';
import { isFathomAiDelivery, verifyFathomAiWebhook } from './webhooks/types';

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
		expect(
			verifyFathomAiWebhook(
				request(SPEC_VECTOR),
				SECRET,
				SPEC_VECTOR.timestamp,
			),
		).toEqual({ valid: true });
	});

	it('accepts a rotated-key header when any listed signature matches', () => {
		const signature = `v1,bm90LXRoZS1yaWdodC1zaWduYXR1cmU= ${DELIVERY.signature}`;

		expect(
			verifyFathomAiWebhook(
				request(DELIVERY, { signature }),
				SECRET,
				DELIVERY.timestamp + 60,
			),
		).toEqual({ valid: true });
	});

	it('rejects a tampered body', () => {
		const tampered = DELIVERY.body.replace('123456789', '123456780');

		expect(
			verifyFathomAiWebhook(
				request(DELIVERY, { rawBody: tampered }),
				SECRET,
				DELIVERY.timestamp,
			),
		).toEqual({ valid: false, error: 'Invalid webhook signature' });
	});

	it('rejects a signature made with another secret', () => {
		expect(
			verifyFathomAiWebhook(
				request(DELIVERY),
				'whsec_c29tZS1vdGhlci1zZWNyZXQ=',
				DELIVERY.timestamp,
			),
		).toEqual({ valid: false, error: 'Invalid webhook signature' });
	});

	it('rejects a replay older than five minutes', () => {
		expect(
			verifyFathomAiWebhook(
				request(DELIVERY),
				SECRET,
				DELIVERY.timestamp + 301,
			),
		).toEqual({ valid: false, error: 'Webhook timestamp outside tolerance' });
	});

	it('rejects a delivery with no raw body or no signature headers', () => {
		expect(
			verifyFathomAiWebhook(
				request(DELIVERY, { rawBody: undefined }),
				SECRET,
				DELIVERY.timestamp,
			),
		).toEqual({ valid: false, error: 'Missing raw body' });
		expect(
			verifyFathomAiWebhook(
				{ ...request(DELIVERY), headers: {} },
				SECRET,
				DELIVERY.timestamp,
			),
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

describe('meetings.contentReady handler', () => {
	type Ctx = Parameters<typeof contentReady.handler>[0];
	type Req = Parameters<typeof contentReady.handler>[1];

	const upserts: Array<[string, unknown]> = [];

	function ctxWithSecret(key: string) {
		// Safe: the handler reads only `key` and `db.meetings`; the runtime builds the rest from a live database.
		return {
			key,
			db: {
				meetings: {
					upsertByEntityId: async (id: string, data: unknown) => {
						upserts.push([id, data]);
						return { id: 'entity-1' };
					},
				},
			},
		} as unknown as Ctx;
	}

	beforeEach(() => {
		jest.clearAllMocks();
		upserts.length = 0;
		jest.spyOn(Date, 'now').mockReturnValue(DELIVERY.timestamp * 1000);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('stores the meeting and returns its corsair entity id', async () => {
		const ctx = ctxWithSecret(SECRET);

		const result = await contentReady.handler(
			ctx,
			request(DELIVERY) as unknown as Req,
		);

		expect(result).toEqual({
			success: true,
			corsairEntityId: 'entity-1',
			data: MEETING,
		});
		expect(upserts).toEqual([['123456789', MEETING]]);
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
			request(DELIVERY) as unknown as Req,
		);

		expect(result).toEqual({
			success: false,
			statusCode: 401,
			error: 'Invalid webhook signature',
		});
		expect(upserts).toEqual([]);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});

describe('a delivery through processWebhook', () => {
	const headers = request(DELIVERY).headers;

	async function createClient(options: { webhookSecret?: string }) {
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
		jest.spyOn(Date, 'now').mockReturnValue(DELIVERY.timestamp * 1000);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('verifies with the stored webhook secret and stores the meeting', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.fathomai.keys.set_webhook_signature(SECRET);

			const result = await processWebhook(corsair, headers, DELIVERY.body);

			expect(result.plugin).toBe('fathomai');
			expect(result.action).toBe('meetings.contentReady');
			expect(result.response).toMatchObject({ success: true });
			const stored =
				await corsair.fathomai.db.meetings.findByEntityId('123456789');
			expect(stored?.data).toEqual(MEETING);
		} finally {
			testDb.cleanup();
		}
	});

	it('verifies with a webhookSecret option given without the whsec_ prefix', async () => {
		const { corsair, testDb } = await createClient({ webhookSecret: KEY });
		try {
			const result = await processWebhook(corsair, headers, DELIVERY.body);

			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('answers 401 and stores nothing when the signature does not match', async () => {
		const { corsair, testDb } = await createClient({
			webhookSecret: 'whsec_c29tZS1vdGhlci1zZWNyZXQ=',
		});
		try {
			const result = await processWebhook(corsair, headers, DELIVERY.body);

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
			const result = await processWebhook(corsair, headers, {
				type: 'payment.succeeded',
				data: {},
			});

			expect(result.plugin).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});
});
