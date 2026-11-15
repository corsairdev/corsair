import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Billing, Customers, Offers, Subscriptions } from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeProabonoRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeProabonoRequest);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

const customer = {
	Id: 133700,
	ReferenceCustomer: 'cust-42',
	Name: 'Jane Smith',
	Email: 'jane@example.com',
	IsBillable: true,
};

const subscription = {
	Id: 44082,
	ReferenceOffer: 'premium',
	ReferenceCustomer: 'cust-42',
	Status: 'Active',
	StateSubscription: 'ActiveRunning',
};

/** A list answer as ProAbono sends it: the documented paginated envelope. */
function page<T>(items: T[], extra: Record<string, number> = {}) {
	return {
		Page: 1,
		SizePage: 10,
		Count: items.length,
		TotalItems: items.length,
		DateGenerated: '2025-05-10T18:33:16.28Z',
		Items: items,
		...extra,
	};
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('customers endpoints', () => {
	it('customers.create posts the customer body', async () => {
		mockedRequest.mockResolvedValue(customer);

		const result = await Customers.create(ctx, {
			ReferenceCustomer: 'cust-42',
			Name: 'Jane Smith',
			Email: 'jane@example.com',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Customer',
			body: {
				ReferenceCustomer: 'cust-42',
				Name: 'Jane Smith',
				Email: 'jane@example.com',
				Metadata: undefined,
			},
		});
		expect(result.Id).toBe(133700);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'proabono.customers.create',
			{ customerId: 133700 },
			'completed',
		);
	});

	it('customers.get reads by reference in the query string', async () => {
		mockedRequest.mockResolvedValue(customer);

		await Customers.get(ctx, { ReferenceCustomer: 'cust-42' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Customer',
			query: { ReferenceCustomer: 'cust-42' },
		});
	});

	it('customers.list reads the rows and counters from the paginated envelope', async () => {
		mockedRequest.mockResolvedValue(
			page([customer], { Page: 2, SizePage: 1, TotalItems: 3 }),
		);

		const result = await Customers.list(ctx, { Page: 2, SizePage: 1 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Customers',
			query: { ReferenceSegment: undefined, Page: 2, SizePage: 1 },
		});
		expect(result.customers).toEqual([customer]);
		expect(result).toMatchObject({
			Page: 2,
			SizePage: 1,
			Count: 1,
			TotalItems: 3,
		});
	});

	it('customers.list rejects a malformed body instead of reporting an empty list', async () => {
		// A body that is not an array is a provider problem, not "no customers":
		// resolving `[]` would tell the caller the account is empty.
		mockedRequest.mockResolvedValue({ error: 'unexpected shape' });

		await expect(Customers.list(ctx, {})).rejects.toThrow();
	});

	it('customers.update posts the fields given', async () => {
		mockedRequest.mockResolvedValue(customer);

		await Customers.update(ctx, {
			ReferenceCustomer: 'cust-42',
			Email: 'new@example.com',
		});

		expect(sentRequest()?.body).toMatchObject({
			ReferenceCustomer: 'cust-42',
			Email: 'new@example.com',
		});
	});

	it('customers.anonymize posts to the anonymization path', async () => {
		mockedRequest.mockResolvedValue({ Id: 133700 });

		await Customers.anonymize(ctx, { ReferenceCustomer: 'cust-42' });

		// The reference is a query parameter on this route, not a body field.
		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Customer/Anonymization',
			query: { ReferenceCustomer: 'cust-42' },
		});
	});

	it('keeps the customer reference out of the anonymize event', async () => {
		mockedRequest.mockResolvedValue({ Id: 133700 });

		await Customers.anonymize(ctx, { ReferenceCustomer: 'jane@example.com' });

		// The reference can hold personal data, and an anonymization that logged it
		// would keep a copy of what it just erased.
		const [, , payload] = mockedLog.mock.calls[0] ?? [];
		expect(JSON.stringify(payload)).not.toContain('jane@example.com');
		expect(payload).toEqual({});
	});

	it('customers.invalidate posts to the invalidation path', async () => {
		mockedRequest.mockResolvedValue({ Id: 133700 });

		await Customers.invalidate(ctx, { ReferenceCustomer: 'cust-42' });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Customer/Invalidation',
			query: { ReferenceCustomer: 'cust-42' },
		});
	});

	it('customers.suspend posts to the suspension path', async () => {
		mockedRequest.mockResolvedValue({ Id: 133700 });

		await Customers.suspend(ctx, { ReferenceCustomer: 'cust-42' });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Customer/Suspension',
			query: { ReferenceCustomer: 'cust-42' },
		});
	});
});

describe('offers and features endpoints', () => {
	it('offers.list sends the documented filters', async () => {
		mockedRequest.mockResolvedValue(
			page([{ Id: 1274, ReferenceOffer: 'premium' }]),
		);

		const result = await Offers.list(ctx, {
			ReferenceCustomer: 'cust-42',
			IgnoreFeatures: true,
			Language: 'en',
			Page: 2,
			SizePage: 20,
		});

		expect(sentRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/Offers',
		});
		expect(sentRequest()?.query).toMatchObject({
			ReferenceCustomer: 'cust-42',
			IgnoreFeatures: true,
			Language: 'en',
			Page: 2,
			SizePage: 20,
		});
		expect(result.offers).toHaveLength(1);
	});

	it('offers.get reads one offer, with the upgrade link when asked', async () => {
		mockedRequest.mockResolvedValue({ Id: 1274, ReferenceOffer: 'premium' });

		await Offers.get(ctx, {
			ReferenceOffer: 'premium',
			ReferenceCustomer: 'cust-42',
			Upgrade: true,
		});

		expect(sentRequest()?.query).toMatchObject({
			ReferenceOffer: 'premium',
			ReferenceCustomer: 'cust-42',
			Upgrade: true,
		});
	});

	it('features.list reads the envelope and pages', async () => {
		mockedRequest.mockResolvedValue(
			page([{ Id: 48, ReferenceFeature: 'feat-users' }]),
		);

		const result = await Offers.features(ctx, { Page: 2 });

		expect(sentRequest()?.path).toBe('/v1/Features');
		expect(sentRequest()?.query).toMatchObject({ Page: 2 });
		expect(result.features).toHaveLength(1);
	});

	it('features.get reads one feature', async () => {
		mockedRequest.mockResolvedValue({ Id: 48, ReferenceFeature: 'feat-users' });

		await Offers.feature(ctx, { ReferenceFeature: 'feat-users' });

		expect(sentRequest()?.path).toBe('/v1/Feature');
		expect(sentRequest()?.query).toMatchObject({
			ReferenceFeature: 'feat-users',
		});
	});
});

describe('subscriptions endpoints', () => {
	it('subscriptions.create puts the switches in the query, not the body', async () => {
		mockedRequest.mockResolvedValue(subscription);

		const result = await Subscriptions.create(ctx, {
			ReferenceOffer: 'premium',
			ReferenceCustomer: 'cust-42',
			TryStart: false,
			EnsureBillable: true,
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/v1/Subscription');
		// The three switches are documented query parameters.
		expect(request?.query).toEqual({
			EnsureBillable: true,
			TryStart: false,
			BillNow: undefined,
		});
		expect(request?.body).toEqual({
			ReferenceOffer: 'premium',
			ReferenceCustomer: 'cust-42',
			ReferenceCustomerBuyer: undefined,
			Metadata: undefined,
		});
		expect(result.StateSubscription).toBe('ActiveRunning');
	});

	it('subscriptions.get reads one subscription by path', async () => {
		mockedRequest.mockResolvedValue(subscription);

		await Subscriptions.get(ctx, { IdSubscription: 44082 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Subscription/44082',
		});
	});

	it('subscriptions.list sends only documented filters and reads the envelope', async () => {
		mockedRequest.mockResolvedValue(page([subscription]));

		const result = await Subscriptions.list(ctx, {
			ReferenceCustomer: 'cust-42',
			ReferenceCustomerBuyer: 'buyer-1',
			IgnoreFeatures: true,
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Subscriptions',
			query: {
				ReferenceCustomer: 'cust-42',
				ReferenceCustomerBuyer: 'buyer-1',
				ReferenceSegment: undefined,
				IgnoreFeatures: true,
				Page: undefined,
				SizePage: undefined,
			},
		});
		expect(result.subscriptions).toHaveLength(1);
	});

	it('subscriptions.start posts to the Start sub-path', async () => {
		mockedRequest.mockResolvedValue(subscription);

		await Subscriptions.start(ctx, { IdSubscription: 44082 });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Subscription/44082/Start',
		});
	});

	it('subscriptions.suspend posts to the Suspension sub-path', async () => {
		mockedRequest.mockResolvedValue(subscription);

		await Subscriptions.suspend(ctx, { IdSubscription: 44082 });

		expect(sentRequest()?.path).toBe('/v1/Subscription/44082/Suspension');
	});

	it('subscriptions.terminate posts to the Termination sub-path', async () => {
		mockedRequest.mockResolvedValue(subscription);

		await Subscriptions.terminate(ctx, { IdSubscription: 44082 });

		expect(sentRequest()?.path).toBe('/v1/Subscription/44082/Termination');
	});

	it('subscriptions.upgrade posts the target offer', async () => {
		mockedRequest.mockResolvedValue(subscription);

		await Subscriptions.upgrade(ctx, {
			IdSubscription: 44082,
			ReferenceOffer: 'ultimate',
		});

		// The target offer is a query parameter on this route.
		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Subscription/44082/Upgrade',
			query: { ReferenceOffer: 'ultimate' },
		});
	});

	it('a lifecycle change that answers an empty 200 still succeeds', async () => {
		// The docs promise only "HTTP 200" on start, suspend, terminate and
		// upgrade; the change has happened, so the call must not throw.
		mockedRequest.mockResolvedValue(undefined);

		await expect(
			Subscriptions.terminate(ctx, { IdSubscription: 44082 }),
		).resolves.toEqual({});
		await expect(
			Subscriptions.upgrade(ctx, {
				IdSubscription: 44082,
				ReferenceOffer: 'ultimate',
			}),
		).resolves.toEqual({});
	});

	it('subscriptions.updateTerm posts the new end date', async () => {
		mockedRequest.mockResolvedValue(subscription);

		await Subscriptions.updateTerm(ctx, {
			IdSubscription: 44082,
			DateTerm: '2026-12-31T00:00:00Z',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Subscription/44082/DateTerm',
			body: { DateTerm: '2026-12-31T00:00:00Z' },
		});
	});
});

describe('billing endpoints', () => {
	const usage = {
		IdFeature: 48,
		IdCustomer: 133700,
		IdSubscription: 10738,
		ReferenceFeature: 'feat-users',
		ReferenceCustomer: 'cust-42',
		TypeFeature: 'Limitation',
		QuantityIncluded: 3,
		QuantityCurrent: 4,
	};

	it('usages.list sends the documented filters and reads the envelope', async () => {
		mockedRequest.mockResolvedValue(page([usage]));

		const result = await Billing.listUsages(ctx, {
			ReferenceCustomer: 'cust-42',
			IdSubscription: 10738,
			Page: 2,
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Usages',
			query: {
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: undefined,
				IdSubscription: 10738,
				Page: 2,
				SizePage: undefined,
			},
		});
		expect(result.usages[0]?.QuantityCurrent).toBe(4);
	});

	it('usages.get reads a customer and feature usage from the query string', async () => {
		mockedRequest.mockResolvedValue(usage);

		const result = await Billing.getUsage(ctx, {
			ReferenceCustomer: 'cust-42',
			ReferenceFeature: 'feat-users',
		});

		// A usage has no id: GET /v1/Usage takes the two references.
		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Usage',
			query: {
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				IdSubscription: undefined,
			},
		});
		expect(result.QuantityIncluded).toBe(3);
	});

	it('usages.increment posts the increment and DateStamp, with EnsureBillable in the query', async () => {
		mockedRequest.mockResolvedValue(usage);

		await Billing.incrementUsage(ctx, {
			ReferenceCustomer: 'cust-42',
			ReferenceFeature: 'feat-users',
			Increment: -1,
			DateStamp: '2025-03-29T19:33:50.65Z',
			EnsureBillable: false,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Usage',
			query: { EnsureBillable: false },
			body: {
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				Increment: -1,
				DateStamp: '2025-03-29T19:33:50.65Z',
			},
		});
	});

	it('usages.increment refuses a call without the required DateStamp', async () => {
		await expect(
			Billing.incrementUsage(ctx, {
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				Increment: 1,
			} as Parameters<typeof Billing.incrementUsage>[1]),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('usages.update posts every row with the documented keys', async () => {
		mockedRequest.mockResolvedValue([usage, usage]);

		const rows = [
			{
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				QuantityCurrent: 17,
				DateStamp: '2025-03-29T19:35:51.65Z',
			},
			{
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-module-b',
				IsEnabled: true,
				DateStamp: '2025-03-29T18:33:50.67Z',
			},
		];
		const result = await Billing.updateUsages(ctx, { usages: rows });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Usages',
			body: rows,
		});
		expect(result.usages).toHaveLength(2);
	});

	it('usages.update refuses a row that sets two kinds of change', async () => {
		await expect(
			Billing.updateUsages(ctx, {
				usages: [
					{
						ReferenceCustomer: 'cust-42',
						ReferenceFeature: 'feat-users',
						Increment: 1,
						QuantityCurrent: 3,
						DateStamp: '2025-03-29T19:35:51.65Z',
					},
				],
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('balanceLines.create posts the documented Label, with EnsureBillable in the query', async () => {
		mockedRequest.mockResolvedValue({
			ReferenceCustomer: 'cust-42',
			LabelLocalized: 'One-off setup',
			AmountSubtotal: 59900,
		});

		const result = await Billing.createBalanceLine(ctx, {
			ReferenceCustomer: 'cust-42',
			Label: 'One-off setup',
			Amount: 59900,
			Quantity: 1,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/BalanceLine',
			query: { EnsureBillable: undefined },
			body: {
				ReferenceCustomer: 'cust-42',
				Label: 'One-off setup',
				Amount: 59900,
				Quantity: 1,
			},
		});
		expect(result.AmountSubtotal).toBe(59900);
	});

	it('balanceLines.list reads the envelope and its totals', async () => {
		mockedRequest.mockResolvedValue({
			...page([{ LabelLocalized: 'Flat fee', AmountTotal: 47880 }]),
			Computations: { AmountSubtotal: 39900, AmountTotal: 47880 },
		});

		const result = await Billing.listBalanceLines(ctx, {
			ReferenceCustomer: 'cust-42',
			IdSubscription: 417428,
		});

		expect(sentRequest()?.path).toBe('/v1/BalanceLines');
		expect(sentRequest()?.query).toMatchObject({
			ReferenceCustomer: 'cust-42',
			IdSubscription: 417428,
		});
		expect(result.balanceLines).toHaveLength(1);
		expect(result.Computations?.AmountTotal).toBe(47880);
	});

	it('invoices.list sends the documented filters and reads the envelope', async () => {
		mockedRequest.mockResolvedValue(
			page([{ Id: 499734, FullNumber: 'S-3.00000004', Status: 'Due' }]),
		);

		const result = await Billing.listInvoices(ctx, {
			ReferenceCustomer: 'cust-42',
			IdSubscription: 10738,
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Invoices',
			query: {
				ReferenceCustomer: 'cust-42',
				IdSubscription: 10738,
				Page: undefined,
				SizePage: undefined,
			},
		});
		expect(result.invoices[0]?.FullNumber).toBe('S-3.00000004');
	});

	it('invoices.get reads one invoice by path', async () => {
		mockedRequest.mockResolvedValue({ Id: 499734, AmountTotal: 9900 });

		await Billing.getInvoice(ctx, { IdInvoice: 499734 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Invoice/499734',
		});
	});
});

describe('the stored account number', () => {
	it('reaches the request when no plugin option sets it', async () => {
		mockedRequest.mockResolvedValue(page([]));

		await Offers.list(buildContext({ account: null, storedAccount: '42' }), {});

		expect(mockedRequest.mock.calls[0]?.[0]).toEqual({
			account: '42',
			agentKey: 'agent-key',
			apiKey: 'api-key',
		});
	});

	it('asks for the connection when neither is set', async () => {
		await expect(
			Offers.list(buildContext({ account: null }), {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('a 204 means no result, not a failure', () => {
	it('turns an empty single read into an empty object the schema accepts', async () => {
		// ProAbono documents a 204 with an empty body when there is no result, so
		// the client surfaces undefined and the endpoint must not fail the parse.
		mockedRequest.mockResolvedValue(undefined);

		const result = await Offers.get(ctx, { ReferenceOffer: 'nope' });

		expect(result).toEqual({});
	});

	it('turns an empty list into an empty array', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Customers.list(ctx, {});

		expect(result.customers).toEqual([]);
	});
});
