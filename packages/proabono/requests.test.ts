import { logEventFromContext } from 'corsair/core';
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

	it('customers.list wraps the bare array the route answers with', async () => {
		mockedRequest.mockResolvedValue([customer]);

		const result = await Customers.list(ctx, { Page: 1, SizePage: 20 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/Customers',
			query: { ReferenceSegment: undefined, Page: 1, SizePage: 20 },
		});
		expect(result.customers).toHaveLength(1);
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

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Customer/Anonymization',
			body: { ReferenceCustomer: 'cust-42' },
		});
	});

	it('customers.invalidate posts to the invalidation path', async () => {
		mockedRequest.mockResolvedValue({ Id: 133700 });

		await Customers.invalidate(ctx, { ReferenceCustomer: 'cust-42' });

		expect(sentRequest()?.path).toBe('/v1/Customer/Invalidation');
	});

	it('customers.suspend posts to the suspension path', async () => {
		mockedRequest.mockResolvedValue({ Id: 133700 });

		await Customers.suspend(ctx, { ReferenceCustomer: 'cust-42' });

		expect(sentRequest()?.path).toBe('/v1/Customer/Suspension');
	});
});

describe('offers and features endpoints', () => {
	it('offers.list sends the documented filters', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1274, ReferenceOffer: 'premium' }]);

		const result = await Offers.list(ctx, {
			ReferenceCustomer: 'cust-42',
			IgnoreFeatures: true,
			Language: 'en',
		});

		expect(sentRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/Offers',
		});
		expect(sentRequest()?.query).toMatchObject({
			ReferenceCustomer: 'cust-42',
			IgnoreFeatures: true,
			Language: 'en',
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

	it('features.list wraps the bare array', async () => {
		mockedRequest.mockResolvedValue([
			{ Id: 48, ReferenceFeature: 'feat-users' },
		]);

		const result = await Offers.features(ctx, {});

		expect(sentRequest()?.path).toBe('/v1/Features');
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

	it('subscriptions.list wraps the bare array', async () => {
		mockedRequest.mockResolvedValue([subscription]);

		const result = await Subscriptions.list(ctx, {
			ReferenceCustomer: 'cust-42',
		});

		expect(sentRequest()?.path).toBe('/v1/Subscriptions');
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

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Subscription/44082/Upgrade',
			body: { ReferenceOffer: 'ultimate' },
		});
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
	it('usages.list sends the documented filters', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1, Quantity: 2 }]);

		const result = await Billing.listUsages(ctx, {
			ReferenceCustomer: 'cust-42',
			ReferenceFeature: 'feat-users',
		});

		expect(sentRequest()?.path).toBe('/v1/Usages');
		expect(result.usages).toHaveLength(1);
	});

	it('usages.get reads one usage', async () => {
		mockedRequest.mockResolvedValue({ Id: 1, Quantity: 2 });

		await Billing.getUsage(ctx, { IdUsage: 1 });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/v1/Usage/1' });
	});

	it('usages.increment posts the increment, which may be negative', async () => {
		mockedRequest.mockResolvedValue({ Id: 1, Quantity: 1 });

		await Billing.incrementUsage(ctx, {
			ReferenceCustomer: 'cust-42',
			ReferenceFeature: 'feat-users',
			Increment: -1,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/Usage',
			body: {
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				Increment: -1,
				Date: undefined,
			},
		});
	});

	it('usages.update posts a bare array of rows', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1 }]);

		const result = await Billing.updateUsages(ctx, {
			usages: [
				{
					ReferenceCustomer: 'cust-42',
					ReferenceFeature: 'feat-users',
					Increment: 1,
				},
			],
		});

		const request = sentRequest();
		expect(request?.path).toBe('/v1/Usages');
		expect(Array.isArray(request?.body)).toBe(true);
		expect(result.usages).toHaveLength(1);
	});

	it('balanceLines.create posts the amount in cents', async () => {
		mockedRequest.mockResolvedValue({ Id: 9, Amount: 59900 });

		await Billing.createBalanceLine(ctx, {
			ReferenceCustomer: 'cust-42',
			Title: 'One-off setup',
			Amount: 59900,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/v1/BalanceLine',
			body: {
				ReferenceCustomer: 'cust-42',
				Title: 'One-off setup',
				Amount: 59900,
			},
		});
	});

	it('balanceLines.list wraps the bare array', async () => {
		mockedRequest.mockResolvedValue([{ Id: 9 }]);

		const result = await Billing.listBalanceLines(ctx, { IsBilled: false });

		expect(sentRequest()?.path).toBe('/v1/BalanceLines');
		expect(result.balanceLines).toHaveLength(1);
	});

	it('invoices.list wraps the bare array', async () => {
		mockedRequest.mockResolvedValue([{ Id: 499734 }]);

		const result = await Billing.listInvoices(ctx, {
			ReferenceCustomer: 'cust-42',
			State: 'Paid',
		});

		expect(sentRequest()?.path).toBe('/v1/Invoices');
		expect(result.invoices).toHaveLength(1);
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
