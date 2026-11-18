import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { addGiftsToBatch } from './endpoints/batch';
import { getGiftById } from './endpoints/gifts';
import { getMembershipDetails } from './endpoints/membership';
import { oneRosterOAuth2BaseApi } from './endpoints/oneroster';
import { getPaymentTransaction } from './endpoints/payments';
import { BlackbaudEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { BlackbaudContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const mockLogEvent = jest.mocked(logEventFromContext);

type RecordedCall = {
	url: string;
	method: string | undefined;
	headers: Headers;
	body: string | undefined;
};

let calls: RecordedCall[];

function stubFetch(...responses: Response[]) {
	const queue = [...responses];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		calls.push({
			url: String(input),
			method: init?.method,
			headers: new Headers(init?.headers),
			body: typeof init?.body === 'string' ? init.body : undefined,
		});
		const next = queue.shift();
		if (!next) {
			throw new Error('Unexpected fetch call');
		}
		return next;
	});
}

function json(
	body: object,
	status = 200,
	headers: Record<string, string> = {},
) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

const entityNames = [
	'gifts',
	'batchGifts',
	'memberships',
	'paymentTransactions',
	'oneRosterKeys',
] as const;

type EntityUpsert = jest.Mock<Promise<void>, [string, object]>;

function makeDb(): Record<
	(typeof entityNames)[number],
	{ upsertByEntityId: EntityUpsert }
> {
	return {
		gifts: { upsertByEntityId: jest.fn() },
		batchGifts: { upsertByEntityId: jest.fn() },
		memberships: { upsertByEntityId: jest.fn() },
		paymentTransactions: { upsertByEntityId: jest.fn() },
		oneRosterKeys: { upsertByEntityId: jest.fn() },
	};
}

let db: ReturnType<typeof makeDb>;

function testCtx() {
	return {
		key: 'test-access-token',
		options: { subscriptionKey: 'test-sub-key' },
		db,
	};
}

// Reflect.apply skips the structural BlackbaudContext check: handlers only read
// key, options and db.<entity>.upsertByEntityId, which testCtx supplies.
function invoke<I, O>(
	handler: (ctx: BlackbaudContext, input: I) => Promise<O>,
	input: I,
): Promise<O> {
	return Reflect.apply(handler, undefined, [testCtx(), input]);
}

function expectSkyHeaders(call: RecordedCall | undefined) {
	expect(call?.headers.get('Authorization')).toBe('Bearer test-access-token');
	expect(call?.headers.get('Bb-Api-Subscription-Key')).toBe('test-sub-key');
}

beforeEach(() => {
	calls = [];
	db = makeDb();
	jest.clearAllMocks();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('gifts.getGiftById', () => {
	const gift = {
		id: '1140',
		constituent_id: '190',
		amount: { value: 250 },
		type: 'PledgePayment',
		subtype: 'Membership',
		post_status: 'NotPosted',
		gift_splits: [{ id: '1123', amount: { value: 250 }, fund_id: '25' }],
		payments: [{ payment_method: 'CreditCard' }],
	};

	it('GETs gift/v1/gifts/{gift_id} and returns the gift record', async () => {
		stubFetch(json(gift));

		const result = await invoke(getGiftById, { gift_id: '1140' });

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(
			'https://api.sky.blackbaud.com/gift/v1/gifts/1140',
		);
		expect(calls[0]?.method).toBe('GET');
		expect(calls[0]?.body).toBeUndefined();
		expectSkyHeaders(calls[0]);
		expect(result).toEqual(gift);
		expect(BlackbaudEndpointOutputSchemas.getGiftById.parse(result)).toEqual(
			gift,
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.gifts.get',
			{ gift_id: '1140' },
			'completed',
		);
	});

	it('encodes the gift id into a single path segment', async () => {
		stubFetch(json(gift));

		await invoke(getGiftById, { gift_id: '../x?y=1' });

		expect(calls[0]?.url).toBe(
			'https://api.sky.blackbaud.com/gift/v1/gifts/..%2Fx%3Fy%3D1',
		);
	});
});

describe('batch.addGiftsToBatch', () => {
	const gifts = [
		{
			amount: { value: 100 },
			constituent_id: '280',
			gift_splits: [{ amount: { value: 100 }, fund_id: '41' }],
			type: 'Donation',
			payments: [{ payment_method: 'Cash' }],
		},
	];
	const added = {
		gifts: [
			{
				id: '1140',
				batch_id: '12',
				constituent_id: '280',
				amount: { value: 100 },
				type: 'Donation',
			},
		],
		errors: [
			{
				batch_id: '12',
				lookup_id: '1000093',
				exception_error_message: 'An error',
			},
		],
	};

	it('POSTs the gifts to gift/v1/giftbatches/{batch_id}/gifts', async () => {
		stubFetch(json(added));

		const result = await invoke(addGiftsToBatch, { batch_id: '12', gifts });

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(
			'https://api.sky.blackbaud.com/gift/v1/giftbatches/12/gifts',
		);
		expect(calls[0]?.method).toBe('POST');
		expectSkyHeaders(calls[0]);
		expect(JSON.parse(calls[0]?.body ?? 'null')).toEqual({ gifts });
		expect(result).toEqual(added);
		expect(
			BlackbaudEndpointOutputSchemas.addGiftsToBatch.parse(result),
		).toEqual(added);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.gifts.add_to_batch',
			{ batch_id: '12', count: 1 },
			'completed',
		);
	});
});

describe('membership.getMembershipDetails', () => {
	const details = {
		dues: 11,
		category_name: 'Gold',
		program_name: 'Annual Membership',
		sub_category_name: 'Family',
		last_renewed_date: '2023-12-06',
		last_dropped_date: null,
		next_renewal_date: '2024-12-06',
		joined_date: '2022-12-26',
		total_years: 2,
		times_renewed: 1,
		consec_years: 1,
		constituent_id: '280',
		type: 'Renewal',
	};

	it('GETs membership/v1/memberships/{member_junction_id}/membershipdetails', async () => {
		stubFetch(json(details));

		const result = await invoke(getMembershipDetails, {
			member_junction_id: '6f1a0b52-1c55-4e0f-9b1a-2d7c0c3e4a10',
		});

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(
			'https://api.sky.blackbaud.com/membership/v1/memberships/6f1a0b52-1c55-4e0f-9b1a-2d7c0c3e4a10/membershipdetails',
		);
		expect(calls[0]?.method).toBe('GET');
		expectSkyHeaders(calls[0]);
		expect(result).toEqual(details);
		expect(
			BlackbaudEndpointOutputSchemas.getMembershipDetails.parse(result),
		).toEqual(details);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.membership.get_details',
			{ member_junction_id: '6f1a0b52-1c55-4e0f-9b1a-2d7c0c3e4a10' },
			'completed',
		);
	});
});

describe('payments.getPaymentTransaction', () => {
	const transaction = {
		id: '92844827-5b74-40db-907f-480b13242eb5',
		amount: 1000,
		net_amount: 925,
		currency: 'USD',
		state: 'Processed',
		transaction_date: '2018-01-31T11:07:12Z',
		transaction_type: 'CardNotPresent',
		credit_card: {
			card_type: 'Visa',
			last_four: '1111',
			exp_month: 2,
			exp_year: 2030,
		},
	};

	it('GETs payments/v1/transactions/{transaction_id}', async () => {
		stubFetch(json(transaction));

		const result = await invoke(getPaymentTransaction, {
			transaction_id: '92844827-5b74-40db-907f-480b13242eb5',
		});

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(
			'https://api.sky.blackbaud.com/payments/v1/transactions/92844827-5b74-40db-907f-480b13242eb5',
		);
		expect(calls[0]?.method).toBe('GET');
		expectSkyHeaders(calls[0]);
		expect(result).toEqual(transaction);
		expect(
			BlackbaudEndpointOutputSchemas.getPaymentTransaction.parse(result),
		).toEqual(transaction);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.payments.get_transaction',
			{ transaction_id: '92844827-5b74-40db-907f-480b13242eb5' },
			'completed',
		);
	});
});

describe('oneRoster.oneRosterOAuth2BaseApi', () => {
	it('GETs the openid-configuration discovery document', async () => {
		const discovery = {
			issuer: 'https://oauth2.sky.blackbaud.com/',
			authorization_endpoint: 'https://app.blackbaud.com/oauth/authorize',
			token_endpoint: 'https://oauth2.sky.blackbaud.com/token',
			jwks_uri: 'https://oauth2.sky.blackbaud.com/publickeys',
			response_types_supported: ['code'],
		};
		stubFetch(json(discovery));

		const result = await invoke(oneRosterOAuth2BaseApi, {
			operation: 'openid-configuration',
		});

		expect(calls[0]?.url).toBe(
			'https://oauth2.sky.blackbaud.com/.well-known/openid-configuration',
		);
		expect(calls[0]?.method).toBe('GET');
		expect(result).toEqual(discovery);
		expect(
			BlackbaudEndpointOutputSchemas.oneRosterOAuth2BaseApi.parse(result),
		).toEqual(discovery);
	});

	it('GETs the JWKS public keys', async () => {
		const jwks = {
			keys: [
				{
					kty: 'RSA',
					alg: 'RS256',
					use: 'sig',
					kid: 'k1',
					e: 'AQAB',
					n: 'abc',
				},
			],
		};
		stubFetch(json(jwks));

		const result = await invoke(oneRosterOAuth2BaseApi, {
			operation: 'publickeys',
		});

		expect(calls[0]?.url).toBe('https://oauth2.sky.blackbaud.com/publickeys');
		expect(calls[0]?.method).toBe('GET');
		expect(result).toEqual(jwks);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.oneroster.oauth2',
			{ operation: 'publickeys' },
			'completed',
		);
	});

	it('rejects an operation outside the enum without calling the API', async () => {
		stubFetch();
		await expect(
			Reflect.apply(oneRosterOAuth2BaseApi, undefined, [
				testCtx(),
				{ operation: 'token' },
			]),
		).rejects.toThrow('Unsupported OneRoster operation: token');
		expect(calls).toHaveLength(0);
	});
});

describe('error responses', () => {
	it('surfaces 401 as an ApiError the AUTH_ERROR handler matches', async () => {
		stubFetch(json({ statusCode: 401, message: 'Access denied' }, 401));

		const error = await invoke(getGiftById, { gift_id: '1140' }).then(
			() => undefined,
			(caught: Error) => caught,
		);

		if (!(error instanceof ApiError)) {
			throw new Error('expected an ApiError');
		}
		expect(error.status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(calls).toHaveLength(1);
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('waits out a 429 Retry-After and retries the same request', async () => {
		stubFetch(
			json({ message: 'Rate limit is exceeded' }, 429, { 'Retry-After': '1' }),
			json({ id: '1140' }),
		);
		const started = Date.now();

		const result = await invoke(getGiftById, { gift_id: '1140' });

		expect(Date.now() - started).toBeGreaterThanOrEqual(900);
		expect(calls).toHaveLength(2);
		expect(calls[1]?.url).toBe(calls[0]?.url);
		expect(result).toEqual({ id: '1140' });
	});
});

describe('entity persistence', () => {
	it('stores a fetched gift under its id', async () => {
		const gift = { id: '1140', constituent_id: '190', type: 'Donation' };
		stubFetch(json(gift));

		await invoke(getGiftById, { gift_id: '1140' });

		expect(db.gifts.upsertByEntityId).toHaveBeenCalledWith('1140', gift);
	});

	it('stores each batch gift with the batch id', async () => {
		stubFetch(
			json({
				gifts: [
					{ id: '1', constituent_id: '280' },
					{ id: '2', batch_id: '12', constituent_id: '281' },
				],
			}),
		);

		await invoke(addGiftsToBatch, {
			batch_id: '12',
			gifts: [
				{
					amount: { value: 1 },
					constituent_id: '280',
					gift_splits: [{ amount: { value: 1 }, fund_id: '41' }],
					type: 'Donation',
					payments: [{ payment_method: 'Cash' }],
				},
			],
		});

		expect(db.batchGifts.upsertByEntityId.mock.calls).toEqual([
			['1', { id: '1', batch_id: '12', constituent_id: '280' }],
			['2', { id: '2', batch_id: '12', constituent_id: '281' }],
		]);
	});

	it('stores membership details under the member junction id', async () => {
		stubFetch(json({ category_name: 'Gold', constituent_id: '280' }));

		await invoke(getMembershipDetails, { member_junction_id: 'mj-1' });

		expect(db.memberships.upsertByEntityId).toHaveBeenCalledWith('mj-1', {
			id: 'mj-1',
			category_name: 'Gold',
			constituent_id: '280',
		});
	});

	it('stores a payment transaction under its id', async () => {
		const transaction = { id: 'tx-1', amount: 1000, state: 'Processed' };
		stubFetch(json(transaction));

		await invoke(getPaymentTransaction, { transaction_id: 'tx-1' });

		expect(db.paymentTransactions.upsertByEntityId).toHaveBeenCalledWith(
			'tx-1',
			transaction,
		);
	});

	it('stores each OneRoster public key under its kid and skips discovery docs', async () => {
		stubFetch(
			json({
				keys: [
					{ kty: 'RSA', kid: 'k1' },
					{ kty: 'RSA', kid: 'k2' },
				],
			}),
			json({ issuer: 'https://oauth2.sky.blackbaud.com/' }),
		);

		await invoke(oneRosterOAuth2BaseApi, { operation: 'publickeys' });
		await invoke(oneRosterOAuth2BaseApi, {
			operation: 'openid-configuration',
		});

		expect(db.oneRosterKeys.upsertByEntityId.mock.calls).toEqual([
			['k1', { kty: 'RSA', kid: 'k1', id: 'k1' }],
			['k2', { kty: 'RSA', kid: 'k2', id: 'k2' }],
		]);
	});

	it('still returns the API result when persistence fails', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		db.gifts.upsertByEntityId.mockRejectedValue(new Error('db down'));
		stubFetch(json({ id: '1140' }));

		await expect(invoke(getGiftById, { gift_id: '1140' })).resolves.toEqual({
			id: '1140',
		});
		expect(warn).toHaveBeenCalled();
	});
});
