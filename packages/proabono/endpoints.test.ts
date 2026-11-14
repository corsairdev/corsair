import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { ProabonoAPIError } from './client';
import { Billing, Customers, Subscriptions } from './endpoints';
import { buildContext, captureError } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeProabonoRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeProabonoRequest);
const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

describe('response parsing', () => {
	it('accepts a field ProAbono adds and keeps it on the result', async () => {
		mockedRequest.mockResolvedValue({
			Id: 133700,
			ReferenceCustomer: 'cust-42',
			brand_new_field: 'x',
		});

		const result = await Customers.get(ctx, { ReferenceCustomer: 'cust-42' });

		expect(result).toMatchObject({ brand_new_field: 'x' });
	});

	it('rejects a customer whose Id is a string', async () => {
		mockedRequest.mockResolvedValue({ Id: '133700' });

		await expect(
			Customers.get(ctx, { ReferenceCustomer: 'cust-42' }),
		).rejects.toThrow();
	});

	it('keeps the amounts as the integer cents ProAbono sends', async () => {
		mockedRequest.mockResolvedValue({
			Id: 44082,
			PricingSubtotal: 9900,
			PricingTotal: 11880,
			AmountRecurrence: 9900,
		});

		const result = await Subscriptions.get(ctx, { IdSubscription: 44082 });

		expect(result.PricingSubtotal).toBe(9900);
		expect(result.PricingTotal).toBe(11880);
	});

	it('accepts a subscription whose trial fields are unset', async () => {
		mockedRequest.mockResolvedValue({
			Id: 44082,
			IsTrial: false,
			CountDaysTrial: null,
		});

		const result = await Subscriptions.get(ctx, { IdSubscription: 44082 });

		expect(result.IsTrial).toBe(false);
		expect(result.CountDaysTrial).toBeNull();
	});

	it('keeps the feature list a subscription carries, in its own shape', async () => {
		mockedRequest.mockResolvedValue({
			Id: 44082,
			Features: [
				{ Id: 48, TypeFeature: 'Limitation', QuantityIncluded: 2 },
				{ Id: 49, TypeFeature: 'OnOff', IsEnabled: true },
			],
		});

		const result = await Subscriptions.get(ctx, { IdSubscription: 44082 });

		expect(result.Features).toHaveLength(2);
	});

	it('accepts a customer with no links', async () => {
		mockedRequest.mockResolvedValue({ Id: 133700, Links: null });

		const result = await Customers.get(ctx, { ReferenceCustomer: 'cust-42' });

		expect(result.Links).toBeNull();
	});

	it('parses an invoice with its totals and links', async () => {
		mockedRequest.mockResolvedValue({
			Id: 499734,
			Number: 'INV-42',
			AmountTotal: 11880,
			State: 'Paid',
			Links: [{ rel: 'self', href: '/v1/Invoice/499734' }],
		});

		const result = await Billing.getInvoice(ctx, { IdInvoice: 499734 });

		expect(result.Number).toBe('INV-42');
		expect(result.Links?.[0]?.rel).toBe('self');
	});

	it('rejects an invoice whose links are not an array', async () => {
		mockedRequest.mockResolvedValue({ Id: 1, Links: 'nope' });

		await expect(Billing.getInvoice(ctx, { IdInvoice: 1 })).rejects.toThrow();
	});
});

describe('input validation before the request', () => {
	it('rejects a customer with an empty reference', async () => {
		await expect(
			Customers.create(ctx, { ReferenceCustomer: '' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a customer update that changes nothing', async () => {
		await expect(
			Customers.update(ctx, { ReferenceCustomer: 'cust-42' }),
		).rejects.toThrow(/at least one field/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a subscription with no customer reference', async () => {
		await expect(
			Subscriptions.create(ctx, {
				ReferenceOffer: 'premium',
			} as never),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a negative subscription id', async () => {
		await expect(
			Subscriptions.get(ctx, { IdSubscription: -1 }),
		).rejects.toThrow();
		await expect(
			Subscriptions.get(ctx, { IdSubscription: 1.5 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a usage increment that is not an integer', async () => {
		await expect(
			Billing.incrementUsage(ctx, {
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				Increment: 1.5,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a negative increment, which records a reversal', async () => {
		mockedRequest.mockResolvedValue({ Id: 1 });

		await expect(
			Billing.incrementUsage(ctx, {
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				Increment: -3,
			}),
		).resolves.toBeDefined();
	});

	it('rejects an empty multi-usage update', async () => {
		await expect(Billing.updateUsages(ctx, { usages: [] })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a page number below 1 and a page size below 1', async () => {
		await expect(Customers.list(ctx, { Page: 0 })).rejects.toThrow();
		await expect(Customers.list(ctx, { SizePage: 0 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('surfaces a validation rejection as an error a handler can match', async () => {
		mockedRequest.mockRejectedValue(
			new ProabonoAPIError('ProAbono 422: Error.Required ReferenceCustomer', {
				status: 422,
				method: 'POST',
				validationErrors: [
					{ Code: 'Error.Required', Message: 'ReferenceCustomer' },
				],
			}),
		);

		const error = await captureError(
			Customers.create(ctx, { ReferenceCustomer: 'cust-42' }),
		);

		expect(error).toBeInstanceOf(ProabonoAPIError);
		expect(error).toMatchObject({ status: 422 });
	});
});
