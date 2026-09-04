import { createHmac } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	COINBASE_API_BASE,
	COINBASE_API_VERSION,
	CoinbaseAPIError,
	CoinbaseRateLimitError,
	makeCoinbaseRequest,
} from './client';
import { getAccount, listAccounts } from './endpoints/accounts';
import {
	getBuy,
	getExchangeRates,
	getSell,
	getSpot,
	getTime,
	listCurrencies,
} from './endpoints/data';
import { listPaymentMethods } from './endpoints/payment-methods';
import { getTransaction, listTransactions } from './endpoints/transactions';
import {
	CoinbaseEndpointInputSchemas,
	CoinbaseEndpointOutputSchemas,
} from './endpoints/types';
import { getUser } from './endpoints/user';
import { errorHandlers } from './error-handlers';
import { coinbase } from './index';
import { matchCoinbaseTenantWebhook } from './webhooks/tenant-matcher';
import {
	coinbaseSignatureHeader,
	verifyCoinbaseWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		...actual,
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const ctx = {
	key: 'test-access-token',
	$getAccountId: async () => 'test-account',
} as never;

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string>),
		},
	});
}

function lastRequest(): {
	url: string;
	auth: string | null;
	version: string | null;
	method: string;
} {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string | URL | Request,
		RequestInit | undefined,
	];
	const url =
		typeof input === 'string'
			? input
			: input instanceof URL
				? input.toString()
				: input.url;
	const headers = new Headers(init?.headers);
	return {
		url,
		auth: headers.get('Authorization'),
		version: headers.get('CB-VERSION'),
		method: init?.method ?? 'GET',
	};
}

describe('Coinbase plugin', () => {
	it('creates plugin instance with 12 endpoints and api_key plus oauth_2', () => {
		const plugin = coinbase({ key: 'test-access-token' });
		expect(plugin.id).toBe('coinbase');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.authConfig?.oauth_2?.account).toEqual(['user_id']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(12);
		expect(Object.keys(plugin.webhookSchemas ?? {})).toEqual([
			'notifications.ping',
			'notifications.newPayment',
		]);
	});

	it('throws AuthMissingError when oauth_2 has no access token', async () => {
		const plugin = coinbase({ authType: 'oauth_2' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'oauth_2',
					keys: { get_access_token: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('allows public market-data calls without an API key', async () => {
		const plugin = coinbase();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).resolves.toBe('');
	});

	it('sends Bearer auth and CB-VERSION on authenticated calls', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				data: {
					id: '9bd290f2-beed-52e5-84b7-2c36d961a161',
					name: 'First Last',
					resource: 'user',
				},
			}),
		);
		await getUser(ctx, {});
		const { url, auth, version } = lastRequest();
		expect(url).toBe(`${COINBASE_API_BASE}/v2/user`);
		expect(auth).toBe('Bearer test-access-token');
		expect(version).toBe(COINBASE_API_VERSION);
	});
});

describe('Coinbase prices and data endpoints', () => {
	it('maps GET /v2/prices/:pair/spot', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ data: { amount: '1015.00', currency: 'USD' } }),
		);
		const result = await getSpot(
			ctx,
			CoinbaseEndpointInputSchemas.pricesGetSpot.parse({
				currency_pair: 'BTC-USD',
				date: '2024-01-31',
			}),
		);
		expect(lastRequest().url).toBe(
			`${COINBASE_API_BASE}/v2/prices/BTC-USD/spot?date=2024-01-31`,
		);
		expect(
			CoinbaseEndpointOutputSchemas.pricesGetSpot.parse(result).amount,
		).toBe('1015.00');
	});

	it('maps GET /v2/prices/:pair/buy', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ data: { amount: '1020.25', currency: 'USD' } }),
		);
		const result = await getBuy(ctx, { currency_pair: 'BTC-USD' });
		expect(lastRequest().url).toBe(
			`${COINBASE_API_BASE}/v2/prices/BTC-USD/buy`,
		);
		expect(result.amount).toBe('1020.25');
	});

	it('maps GET /v2/prices/:pair/sell', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ data: { amount: '1010.25', currency: 'USD' } }),
		);
		const result = await getSell(ctx, { currency_pair: 'ETH-USD' });
		expect(lastRequest().url).toContain('/v2/prices/ETH-USD/sell');
		expect(result.currency).toBe('USD');
	});

	it('maps GET /v2/exchange-rates', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				data: { currency: 'BTC', rates: { USD: '1015.00' } },
			}),
		);
		const result = await getExchangeRates(ctx, { currency: 'BTC' });
		expect(lastRequest().url).toContain('/v2/exchange-rates?currency=BTC');
		expect(result.rates.USD).toBe('1015.00');
	});

	it('maps GET /v2/currencies', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				data: [{ id: 'BTC', name: 'Bitcoin', min_size: '0.00000001' }],
			}),
		);
		const result = await listCurrencies(ctx, {});
		expect(lastRequest().url).toBe(`${COINBASE_API_BASE}/v2/currencies`);
		expect(result.data[0]?.id).toBe('BTC');
	});

	it('maps GET /v2/time', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				data: { iso: '2015-06-23T18:02:51Z', epoch: 1435082571 },
			}),
		);
		const result = await getTime(ctx, {});
		expect(lastRequest().url).toBe(`${COINBASE_API_BASE}/v2/time`);
		expect(result.epoch).toBe(1435082571);
	});
});

describe('Coinbase account endpoints', () => {
	const account = {
		id: '2bbf394c-193b-5b2a-9155-3b4732659ede',
		name: 'My Wallet',
		primary: true,
		type: 'wallet',
		balance: { amount: '39.59000000', currency: 'BTC' },
	};

	it('maps GET /v2/accounts with pagination', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				pagination: { limit: 25, next_uri: null },
				data: [account],
			}),
		);
		const result = await listAccounts(ctx, {
			limit: 25,
			starting_after: 'cursor-1',
		});
		expect(lastRequest().url).toContain('/v2/accounts?');
		expect(lastRequest().url).toContain('limit=25');
		expect(lastRequest().url).toContain('starting_after=cursor-1');
		expect(result.data).toHaveLength(1);
		expect(result.pagination?.limit).toBe(25);
	});

	it('maps GET /v2/accounts/:account_id', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ data: account }));
		const result = await getAccount(ctx, { account_id: account.id });
		expect(lastRequest().url).toBe(
			`${COINBASE_API_BASE}/v2/accounts/${account.id}`,
		);
		expect(result.id).toBe(account.id);
	});

	it('maps GET /v2/accounts/:id/transactions', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				pagination: { limit: 10 },
				data: [{ id: 'tx-1', type: 'send', status: 'completed' }],
			}),
		);
		const result = await listTransactions(ctx, {
			account_id: account.id,
			limit: 10,
		});
		expect(lastRequest().url).toContain(
			`/v2/accounts/${account.id}/transactions?limit=10`,
		);
		expect(result.data[0]?.id).toBe('tx-1');
	});

	it('maps GET /v2/accounts/:id/transactions/:tx', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				data: { id: 'tx-1', type: 'send', status: 'completed' },
			}),
		);
		const result = await getTransaction(ctx, {
			account_id: account.id,
			transaction_id: 'tx-1',
		});
		expect(lastRequest().url).toBe(
			`${COINBASE_API_BASE}/v2/accounts/${account.id}/transactions/tx-1`,
		);
		expect(result.status).toBe('completed');
	});

	it('maps GET /v2/payment-methods', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				data: [
					{
						id: 'pm-1',
						type: 'ach_bank_account',
						name: 'Checking',
						currency: 'USD',
					},
				],
			}),
		);
		const result = await listPaymentMethods(ctx, {});
		expect(lastRequest().url).toBe(`${COINBASE_API_BASE}/v2/payment-methods`);
		expect(result.data[0]?.type).toBe('ach_bank_account');
	});
});

describe('Coinbase client errors', () => {
	it('maps 429 to CoinbaseRateLimitError', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ errors: [{ id: 'rate_limit_exceeded', message: 'slow down' }] },
				{ status: 429, headers: { 'Retry-After': '2' } },
			),
		);
		await expect(
			makeCoinbaseRequest('/v2/time', '', {
				schema: { parse: (data) => data },
			}),
		).rejects.toBeInstanceOf(CoinbaseRateLimitError);
	});

	it('maps Coinbase error envelope messages', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ errors: [{ id: 'not_found', message: 'Not found' }] },
				{ status: 404 },
			),
		);
		await expect(
			makeCoinbaseRequest('/v2/accounts/missing', 'token', {
				schema: { parse: (data) => data },
			}),
		).rejects.toMatchObject({
			name: 'CoinbaseAPIError',
			message: 'Not found',
			status: 404,
			code: 'not_found',
		});
	});

	it('matches rate limit and auth error handlers', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new CoinbaseRateLimitError('slow down', 2000),
			),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(
				new CoinbaseAPIError('unauthorized', 'auth', 401),
			),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(
				new CoinbaseAPIError('missing', 'not_found', 404),
			),
		).toBe(true);
	});
});

describe('Coinbase webhooks', () => {
	it('verifies CB-SIGNATURE HMAC-SHA256', () => {
		const secret = 'webhook-secret';
		const rawBody = JSON.stringify({ type: 'ping', id: 'n-1' });
		const signature = createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');
		const result = verifyCoinbaseWebhookSignature(
			{
				payload: { type: 'ping' },
				headers: { 'cb-signature': signature },
				rawBody,
			},
			secret,
		);
		expect(result.valid).toBe(true);
	});

	it('rejects invalid signatures', () => {
		const result = verifyCoinbaseWebhookSignature(
			{
				payload: { type: 'ping' },
				headers: { 'cb-signature': 'deadbeef' },
				rawBody: '{"type":"ping"}',
			},
			'webhook-secret',
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid signature');
	});

	it('accepts hubVerified deliveries without a secret', () => {
		expect(
			verifyCoinbaseWebhookSignature(
				{
					payload: { type: 'ping' },
					headers: {},
					hubVerified: true,
				},
				undefined,
			).valid,
		).toBe(true);
	});

	it('matches tenant user_id from notification payload', () => {
		expect(
			matchCoinbaseTenantWebhook({
				headers: {},
				body: {
					type: 'wallet:addresses:new-payment',
					user: { id: 'user-123' },
				},
			}),
		).toEqual({ linkType: 'user_id', externalId: 'user-123' });
	});

	it('detects Coinbase signature headers', () => {
		expect(coinbaseSignatureHeader({ 'cb-signature': 'abc' })).toBe('abc');
		expect(coinbaseSignatureHeader({ 'x-cc-webhook-signature': 'def' })).toBe(
			'def',
		);
	});
});
