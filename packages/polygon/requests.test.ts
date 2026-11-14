import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	CashLocations,
	Customers,
	Networks,
	Quotes,
	Transactions,
	Wallets,
	Webhooks,
} from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makePolygonRequest: jest.fn(),
		resolvePolygonToken: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makePolygonRequest);
const mockedToken = jest.mocked(client.resolvePolygonToken);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[2];
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedToken.mockReset();
	mockedLog.mockReset();
	mockedToken.mockResolvedValue('jwt-value');
});

describe('customers endpoints', () => {
	it('customers.list sends the documented filters and cursor', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });

		await Customers.list(ctx, {
			status: 'active',
			email: 'jane@example.com',
			limit: 10,
			cursor: 'cst_cursor',
		});

		// GET /customers documents a single `cursor` query parameter.
		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/customers',
			query: {
				status: 'active',
				email: 'jane@example.com',
				externalId: undefined,
				createdAfter: undefined,
				createdBefore: undefined,
				limit: 10,
				cursor: 'cst_cursor',
			},
		});
	});

	it('customers.get reads one customer by path', async () => {
		mockedRequest.mockResolvedValue({ id: 'cst_1', status: 'active' });

		const result = await Customers.get(ctx, { customerId: 'cst_1' });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/customers/cst_1' });
		expect(result.status).toBe('active');
	});

	it('customers.create needs an idempotency key and sends the body without it', async () => {
		mockedRequest.mockResolvedValue({ id: 'cst_new', status: 'pending' });

		await Customers.create(ctx, {
			type: 'individual',
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane@example.com',
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/customers');
		// A generated key, since the caller supplied none.
		expect(request?.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
		// The key is a header, never part of the JSON body.
		expect(request?.body).toEqual({
			type: 'individual',
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane@example.com',
		});
	});

	it('customers.create reuses a caller-supplied idempotency key on a retry', async () => {
		mockedRequest.mockResolvedValue({ id: 'cst_new' });

		const input = {
			type: 'individual' as const,
			firstName: 'Jane',
			lastName: 'Smith',
			idempotencyKey: 'order-991-attempt-1',
		};
		await Customers.create(ctx, input);
		await Customers.create(ctx, input);

		expect(sentRequest(-2)?.idempotencyKey).toBe('order-991-attempt-1');
		expect(sentRequest(-1)?.idempotencyKey).toBe('order-991-attempt-1');
	});

	it('customers.update patches only the fields given, without the path id', async () => {
		mockedRequest.mockResolvedValue({ id: 'cst_1' });

		await Customers.update(ctx, { customerId: 'cst_1', phone: '+12125551234' });

		expect(sentRequest()).toEqual({
			method: 'PATCH',
			path: '/customers/cst_1',
			body: { phone: '+12125551234' },
		});
	});

	it('customers.delete (remove) deletes by path', async () => {
		mockedRequest.mockResolvedValue({ id: 'cst_1', status: 'offboarded' });

		const result = await Customers.remove(ctx, { customerId: 'cst_1' });

		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/customers/cst_1',
		});
		expect(result.status).toBe('offboarded');
	});
});

describe('wallets endpoints', () => {
	it('wallets.list repeats includeHidden as one query value per entry', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });

		await Wallets.list(ctx, {
			customerId: 'cst_1',
			includeHidden: ['claimed'],
			limit: 5,
		});

		expect(sentRequest()?.query).toMatchObject({
			customerId: 'cst_1',
			includeHidden: ['claimed'],
			limit: 5,
		});
	});

	it('wallets.get reads a wallet by path and parses the customer reference', async () => {
		// v0.13 WalletResourceCrypto: `customer` is an object, not an id string.
		mockedRequest.mockResolvedValue({
			id: 'wlt_1',
			type: 'walletCrypto',
			customer: { id: 'cst_1' },
			status: 'active',
			asset: 'usdc',
			network: 'polygon',
			address: '0xabc',
			routing: { claimStatus: 'unclaimed' },
			provider: 'custodian',
			balances: [
				{
					asset: 'usdc',
					network: 'polygon',
					balance: '5.000000',
					estimatedValueUsd: '5.00',
				},
			],
			createdAt: '2026-01-01T00:00:00Z',
			updatedAt: '2026-01-01T00:00:00Z',
		});

		const result = await Wallets.get(ctx, { id: 'wlt_1' });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/wallets/wlt_1' });
		expect(result.customer?.id).toBe('cst_1');
		expect(result.balances?.[0]?.estimatedValueUsd).toBe('5.00');
	});

	it('wallets.create posts the documented customerId, type and details body', async () => {
		mockedRequest.mockResolvedValue({ id: 'wlt_new', type: 'walletCrypto' });

		await Wallets.create(ctx, {
			customerId: 'cst_1',
			type: 'custodial',
			details: { network: 'polygon', asset: 'usdc' },
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/wallets');
		expect(request?.body).toEqual({
			customerId: 'cst_1',
			type: 'custodial',
			details: { network: 'polygon', asset: 'usdc' },
			label: undefined,
			metadata: undefined,
		});
		expect(request?.idempotencyKey).toBeDefined();
	});

	it('wallets.create parses the 202 pending wallet operation', async () => {
		mockedRequest.mockResolvedValue({
			operationId: 'wop_1',
			object: 'wallet.operation',
			customerId: 'cst_1',
			status: 'pending',
			pairs: [{ network: 'polygon', status: 'pending' }],
			createdAt: '2026-01-01T00:00:00Z',
		});

		const result = await Wallets.create(ctx, {
			customerId: 'cst_1',
			type: 'noncustodial',
			details: { networkFamily: 'evm' },
		});

		expect(result.operationId).toBe('wop_1');
	});

	it('wallets.create rejects details that do not match the wallet type', async () => {
		await expect(
			Wallets.create(ctx, {
				customerId: 'cst_1',
				type: 'custodial',
				details: { networkFamily: 'evm' },
			}),
		).rejects.toThrow('details.network');
		await expect(
			Wallets.create(ctx, {
				customerId: 'cst_1',
				type: 'fiat',
				details: { asset: 'eur' },
			}),
		).rejects.toThrow('asset: usd');
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('wallets.balance reads the balance sub-resource', async () => {
		mockedRequest.mockResolvedValue({
			data: {
				id: 'wlt_1',
				asset: 'usdc',
				chain: 'polygon',
				balance: '5.000000',
			},
		});

		const result = await Wallets.balance(ctx, { id: 'wlt_1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/wallets/wlt_1/balance',
		});
		expect(result.data.balance).toBe('5.000000');
	});
});

describe('networks endpoints', () => {
	it('networks.list pages with the shared cursor parameters', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });

		await Networks.list(ctx, { limit: 20, endingBefore: 'back-cursor' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/networks',
			query: {
				limit: 20,
				startingAfter: undefined,
				endingBefore: 'back-cursor',
			},
		});
	});
});

describe('quotes endpoints', () => {
	it('quotes.create posts both sides and the amount exactly once', async () => {
		mockedRequest.mockResolvedValue({ id: 'qt_1', status: 'open' });

		await Quotes.create(ctx, {
			customerId: 'cst_1',
			source: {
				type: 'walletCrypto',
				details: { id: 'wlt_1', asset: 'usdc', network: 'polygon' },
				amount: '100.00',
			},
			destination: {
				type: 'bankUs',
				details: { id: 'ext_1', asset: 'usd' },
			},
			sponsorGas: true,
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/quotes');
		expect(request?.idempotencyKey).toBeDefined();
		expect(request?.body).toEqual({
			customerId: 'cst_1',
			source: {
				type: 'walletCrypto',
				details: { id: 'wlt_1', asset: 'usdc', network: 'polygon' },
				amount: '100.00',
			},
			destination: {
				type: 'bankUs',
				details: { id: 'ext_1', asset: 'usd' },
			},
			sponsorGas: true,
			metadata: undefined,
		});
	});

	it('quotes.get reads a quote by path', async () => {
		mockedRequest.mockResolvedValue({ id: 'qt_1', status: 'open' });

		await Quotes.get(ctx, { quoteId: 'qt_1' });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/quotes/qt_1' });
	});
});

describe('transactions endpoints', () => {
	it('transactions.list repeats status as one query value per entry', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });

		await Transactions.list(ctx, {
			status: ['processing', 'completed'],
			customerId: 'cst_1',
			search: 'txn_1',
		});

		expect(sentRequest()?.query).toMatchObject({
			status: ['processing', 'completed'],
			customerId: 'cst_1',
			search: 'txn_1',
		});
	});

	it('transactions.get reads one transaction', async () => {
		mockedRequest.mockResolvedValue({
			id: 'txn_1',
			status: 'completed',
			subStatus: 'completed.settled',
		});

		const result = await Transactions.get(ctx, { transactionId: 'txn_1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/transactions/txn_1',
		});
		expect(result.subStatus).toBe('completed.settled');
	});

	it('transactions.create accepts the quote behind an idempotency key', async () => {
		mockedRequest.mockResolvedValue({ id: 'txn_new', status: 'processing' });

		await Transactions.create(ctx, {
			quoteId: 'qt_1',
			metadata: { orderId: 'order_12345' },
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/transactions');
		expect(request?.idempotencyKey).toBeDefined();
		expect(request?.body).toEqual({
			quoteId: 'qt_1',
			deviceFingerprint: undefined,
			webSessionId: undefined,
			metadata: { orderId: 'order_12345' },
		});
	});
});

describe('webhooks endpoints', () => {
	it('webhooks.list reads the stats envelope', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });

		await Webhooks.list(ctx, { status: 'enabled', limit: 10 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/webhooks',
			query: { status: 'enabled', limit: 10, cursor: undefined },
		});
	});

	it('webhooks.get reads one endpoint', async () => {
		mockedRequest.mockResolvedValue({ id: 'whk_1', status: 'enabled' });

		await Webhooks.get(ctx, { webhookId: 'whk_1' });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/webhooks/whk_1' });
	});

	it('webhooks.create registers the endpoint and returns the signing key once', async () => {
		mockedRequest.mockResolvedValue({
			webhook: { id: 'whk_new', status: 'enabled' },
			signingKey: 'whsec_abc',
		});

		const result = await Webhooks.create(ctx, {
			url: 'https://partner.example/webhooks',
			subscriptions: ['transaction.settled'],
			timeoutMs: 5000,
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/webhooks');
		expect(request?.idempotencyKey).toBeDefined();
		expect(request?.body).toEqual({
			url: 'https://partner.example/webhooks',
			subscriptions: ['transaction.settled'],
			timeoutMs: 5000,
			notifyThresholdSecs: undefined,
		});
		expect(result.signingKey).toBe('whsec_abc');
		// The secret is never logged.
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'polygon.webhooks.create',
			{ webhookId: 'whk_new' },
			'completed',
		);
	});

	it('webhooks.update patches only the fields given', async () => {
		mockedRequest.mockResolvedValue({ id: 'whk_1', status: 'enabled' });

		await Webhooks.update(ctx, { webhookId: 'whk_1', timeoutMs: 8000 });

		expect(sentRequest()).toEqual({
			method: 'PATCH',
			path: '/webhooks/whk_1',
			body: {
				url: undefined,
				subscriptions: undefined,
				timeoutMs: 8000,
				notifyThresholdSecs: undefined,
			},
		});
	});

	it('webhooks.delete (remove) deletes by path', async () => {
		mockedRequest.mockResolvedValue({ id: 'whk_1', status: 'disabled' });

		await Webhooks.remove(ctx, { webhookId: 'whk_1' });

		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/webhooks/whk_1',
		});
	});
});

describe('cashLocations endpoints', () => {
	it('cashLocations.list sends the provider and coordinates OMS requires', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });

		await CashLocations.list(ctx, {
			provider: 'retail',
			latitude: 47.6,
			longitude: -122.3,
			radius: 10,
			flow: 'cash_in',
			limit: 50,
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/cash-locations',
			query: {
				provider: 'retail',
				latitude: 47.6,
				longitude: -122.3,
				radius: 10,
				flow: 'cash_in',
				customerId: undefined,
				limit: 50,
				startingAfter: undefined,
				endingBefore: undefined,
			},
		});
	});

	it('cashLocations.list refuses a call without the required search center', async () => {
		// GET /cash-locations marks provider, latitude and longitude required.
		await expect(CashLocations.list(ctx, { limit: 50 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('credentials and host', () => {
	it('uses the sandbox host and the option credentials', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });

		await Networks.list(ctx, {});

		expect(mockedToken).toHaveBeenCalledWith('sandbox', {
			apiKey: 'sk_sdbx_test',
			apiSecret: 'secret',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'sandbox',
			'jwt-value',
			expect.objectContaining({ path: '/networks' }),
		);
	});

	it('falls back to the stored account credentials', async () => {
		mockedRequest.mockResolvedValue({ data: [], hasMore: false });
		const storedCtx = { ...ctx, options: {} } as typeof ctx;

		await Networks.list(storedCtx, {});

		expect(mockedToken).toHaveBeenCalledWith('live', {
			apiKey: 'sk_sdbx_test',
			apiSecret: 'secret',
		});
	});
});
