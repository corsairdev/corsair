import { ApiError } from 'corsair/http';
import * as client from './client';
import { PolygonAPIError } from './client';
import {
	Customers,
	Networks,
	Quotes,
	Transactions,
	Webhooks,
} from './endpoints';
import { buildContext, captureError } from './test-helpers';

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

const ctx = buildContext();

/** A 401 as `request()` raises it, which is the shape the refresh path sees. */
function unauthorized(): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/networks' },
		{
			url: 'https://api.polygon.technology/v0.13/networks',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: { error: 'Unauthorized', code: 1002, msg: 'expired' },
		},
		'Polygon 401 Unauthorized: expired',
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
	jest.mocked(client.resolvePolygonToken).mockReset();
	jest.mocked(client.resolvePolygonToken).mockResolvedValue('jwt-value');
});

describe('response parsing', () => {
	it('accepts a field OMS adds and keeps it on the result', async () => {
		mockedRequest.mockResolvedValue({
			id: 'wlt_1',
			object: 'wallet',
			status: 'active',
			someNewField: 'value',
		});

		const result = await (await import('./endpoints')).Wallets.get(ctx, {
			id: 'wlt_1',
		});

		expect(result).toMatchObject({ id: 'wlt_1', someNewField: 'value' });
	});

	it('rejects a list page whose data is not an array', async () => {
		mockedRequest.mockResolvedValue({ data: 'not-an-array', hasMore: false });

		await expect(Networks.list(ctx, {})).rejects.toThrow();
	});

	it('rejects a page that omits the required hasMore flag', async () => {
		mockedRequest.mockResolvedValue({ data: [] });

		await expect(Networks.list(ctx, {})).rejects.toThrow();
	});

	it('accepts an empty page with hasMore false', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			limit: 20,
			hasMore: false,
			data: [],
		});

		const result = await Networks.list(ctx, {});

		expect(result.data).toEqual([]);
		expect(result.hasMore).toBe(false);
	});

	it('rejects a malformed known field rather than coercing it', async () => {
		mockedRequest.mockResolvedValue({
			id: 'txn_1',
			status: 'completed',
			// `transfers` is a list; a bare object must not be accepted as one.
			transfers: { id: 'tr_1' },
		});

		await expect(
			Transactions.get(ctx, { transactionId: 'txn_1' }),
		).rejects.toThrow();
	});

	it('keeps a null pricing block, which a quote under review can carry', async () => {
		mockedRequest.mockResolvedValue({
			id: 'qt_1',
			status: 'open',
			pricing: null,
		});

		const result = await Quotes.get(ctx, { quoteId: 'qt_1' });

		expect(result.pricing).toBeNull();
	});

	it('rejects a customer whose metadata carries a non-string value', async () => {
		mockedRequest.mockResolvedValue({
			id: 'cst_1',
			status: 'active',
			metadata: { tier: 3 },
		});

		await expect(Customers.get(ctx, { customerId: 'cst_1' })).rejects.toThrow();
	});

	it('parses a webhook whose subscriptions include the wildcard', async () => {
		mockedRequest.mockResolvedValue({
			id: 'whk_1',
			status: 'enabled',
			subscriptions: ['*'],
			mode: 'sandbox',
			successCount: 12,
			failureCount: 0,
		});

		const result = await Webhooks.get(ctx, { webhookId: 'whk_1' });

		expect(result.subscriptions).toEqual(['*']);
		expect(result.failureCount).toBe(0);
	});
});

describe('input validation before the request', () => {
	it('rejects a customer create with no name for an individual', async () => {
		await expect(
			Customers.create(ctx, { type: 'individual', email: 'jane@example.com' }),
		).rejects.toThrow(/needs a firstName/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a business customer without a legal name or email', async () => {
		await expect(
			Customers.create(ctx, { type: 'business', companyLegalName: 'Acme' }),
		).rejects.toThrow(/needs an email/);
		await expect(
			Customers.create(ctx, { type: 'business', email: 'ops@acme.example' }),
		).rejects.toThrow(/needs a companyLegalName/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects person-name fields on a business customer', async () => {
		await expect(
			Customers.create(ctx, {
				type: 'business',
				companyLegalName: 'Acme',
				email: 'ops@acme.example',
				firstName: 'Jane',
			}),
		).rejects.toThrow(/does not accept firstName/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			Customers.update(ctx, { customerId: 'cst_1' }),
		).rejects.toThrow(/at least one field/);
		await expect(Webhooks.update(ctx, { webhookId: 'whk_1' })).rejects.toThrow(
			/at least one field/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a quote with an amount on both sides', async () => {
		await expect(
			Quotes.create(ctx, {
				customerId: 'cst_1',
				source: {
					type: 'walletCrypto',
					details: { id: 'wlt_1', asset: 'usdc', network: 'polygon' },
					amount: '100.00',
				},
				destination: {
					type: 'bankUs',
					details: { id: 'ext_1', asset: 'usd', network: 'ach' },
					amount: '90.00',
				},
			}),
		).rejects.toThrow(/exactly one side/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a quote with no amount at all', async () => {
		await expect(
			Quotes.create(ctx, {
				customerId: 'cst_1',
				source: {
					type: 'walletFiat',
					details: { id: 'wlt_fiat_1', asset: 'usd' },
				},
				destination: {
					type: 'bankUs',
					details: { id: 'ext_1', asset: 'usd', network: 'ach' },
				},
			}),
		).rejects.toThrow(/exactly one side/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an external wallet destination naming both an id and an address', async () => {
		await expect(
			Quotes.create(ctx, {
				customerId: 'cst_1',
				source: {
					type: 'walletCrypto',
					details: { id: 'wlt_1', asset: 'usdc', network: 'polygon' },
					amount: '10.00',
				},
				destination: {
					type: 'walletExternal',
					details: {
						id: 'ext_1',
						blockchainAddress: '0xabc',
						asset: 'usdc',
						network: 'polygon',
					},
				},
			}),
		).rejects.toThrow(/exactly one of/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a network outside the documented set', async () => {
		await expect(
			Quotes.create(ctx, {
				customerId: 'cst_1',
				source: {
					type: 'walletCrypto',
					details: {
						id: 'wlt_1',
						asset: 'usdc',
						// OMS accepts names, never numeric chain ids.
						network: '137',
					} as never,
					amount: '10.00',
				},
				destination: { type: 'bankUs', details: { id: 'ext_1', asset: 'usd', network: 'ach' } },
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a page size outside the documented range', async () => {
		await expect(Networks.list(ctx, { limit: 101 })).rejects.toThrow();
		await expect(Networks.list(ctx, { limit: 0 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a webhook timeout above the documented hard cap', async () => {
		await expect(
			Webhooks.create(ctx, {
				url: 'https://partner.example/webhooks',
				subscriptions: ['*'],
				timeoutMs: 10_001,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an idempotency key above the documented length', async () => {
		await expect(
			Customers.create(ctx, {
				type: 'individual',
				firstName: 'Jane',
				lastName: 'Smith',
				idempotencyKey: 'x'.repeat(257),
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('refreshes a rejected token once, then succeeds', async () => {
		mockedRequest.mockRejectedValueOnce(unauthorized()).mockResolvedValueOnce({
			object: 'list',
			limit: 20,
			hasMore: false,
			data: [],
		});

		const result = await Networks.list(ctx, {});

		expect(result.data).toEqual([]);
		// The dead token is dropped, a new one is minted, and the call repeats.
		expect(jest.mocked(client.resolvePolygonToken)).toHaveBeenCalledTimes(2);
		expect(mockedRequest).toHaveBeenCalledTimes(2);
	});

	it('raises the second 401 rather than looping', async () => {
		mockedRequest.mockRejectedValue(unauthorized());

		const error = await captureError(Networks.list(ctx, {}));

		// Core's ApiError reaches the caller unchanged.
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 401 });
		// Exactly one retry: the second 401 propagates.
		expect(mockedRequest).toHaveBeenCalledTimes(2);
	});

	it('reports a rejection as a PolygonAPIError so a handler can match its code', async () => {
		mockedRequest.mockRejectedValue(
			new PolygonAPIError('Polygon 422 InvalidParameter: bad field', {
				status: 422,
				code: 'InvalidParameter',
				errorNumber: 1010,
				method: 'POST',
			}),
		);

		const error = await captureError(
			Quotes.create(ctx, {
				customerId: 'cst_1',
				source: {
					type: 'walletCrypto',
					details: { id: 'wlt_1', asset: 'usdc', network: 'polygon' },
					amount: '10.00',
				},
				destination: { type: 'bankUs', details: { id: 'ext_1', asset: 'usd', network: 'ach' } },
			}),
		);

		expect(error).toBeInstanceOf(PolygonAPIError);
		expect(error).toMatchObject({ status: 422, code: 'InvalidParameter' });
	});
});
