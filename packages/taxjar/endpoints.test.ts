import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { readNumber } from './client';
import { Customers, Reference, Transactions } from './endpoints';
import {
	categories,
	customer,
	customerDeleted,
	customerIds,
	nexusRegions,
	notFoundResponse,
	order,
	orderDeleted,
	orderIds,
	rates,
	refund,
	refundDeleted,
	refundIds,
	summaryRates,
	taxCalculation,
	unauthorizedResponse,
	unprocessableResponse,
	validatedAddresses,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'taxjar-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type.
// unknown: the constraint has to accept every endpoint's own result type;
// ReturnType<E> then gives each call its concrete one.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.taxjar.com');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

/**
 * Resolves to the rejection reason, narrowed to core's ApiError, which the
 * client passes on.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before it is narrowed.
 */
async function rejection(promise: Promise<unknown>): Promise<ApiError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	expect(caught).toBeInstanceOf(ApiError);
	return caught as ApiError;
}

beforeEach(() => {
	// A call no test queued a response for throws, so nothing reaches the API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('categories.list', () => {
	it('GETs /v2/categories and parses the categories envelope', async () => {
		respond(categories);

		const result = await invoke(Reference.categoriesList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v2/categories',
			method: 'GET',
		});
		expect(result.categories).toHaveLength(2);
		expect(result.categories[0]?.product_tax_code).toBe('10040');
	});

	it('fails loudly when the envelope has no categories array', async () => {
		respond({ items: [] });

		await expect(invoke(Reference.categoriesList, {})).rejects.toThrow();
	});
});

describe('rates.get', () => {
	it('GETs /v2/rates/{zip} and keeps rates as the strings sent', async () => {
		respond(rates);

		const result = await invoke(Reference.ratesGet, {
			zip: '90404',
			state: 'CA',
			city: 'SANTA MONICA',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/rates/90404',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			state: 'CA',
			city: 'SANTA MONICA',
		});
		// TaxJar sends the rate as a decimal string, not a number.
		expect(result.rate.combined_rate).toBe('0.0975');
		expect(readNumber(result.rate.combined_rate)).toBe(0.0975);
	});

	it('passes a street address through for rooftop accuracy', async () => {
		respond(rates);

		await invoke(Reference.ratesGet, {
			zip: '05495-2086',
			street: '312 Hurricane Lane',
			state: 'VT',
		});

		expect(lastRequest().path).toBe('/v2/rates/05495-2086');
		expect(lastRequest().query).toEqual({
			street: '312 Hurricane Lane',
			state: 'VT',
		});
	});

	it('rejects a missing zip before sending', async () => {
		await expect(invoke(Reference.ratesGet, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('nexus, summary rates and address validation', () => {
	it('lists nexus regions', async () => {
		respond(nexusRegions);

		const result = await invoke(Reference.nexusRegionsList, {});

		expect(lastRequest().path).toBe('/v2/nexus/regions');
		expect(result.regions[0]?.region_code).toBe('CA');
	});

	it('lists summary rates with numeric rates', async () => {
		respond(summaryRates);

		const result = await invoke(Reference.summaryRatesList, {});

		expect(lastRequest().path).toBe('/v2/summary_rates');
		expect(result.summary_rates[0]?.average_rate?.rate).toBe(0.0827);
	});

	it('validates an address and returns every match', async () => {
		respond(validatedAddresses);

		const result = await invoke(Reference.addressesValidate, {
			country: 'US',
			state: 'AZ',
			zip: '85297',
			city: 'Gilbert',
			street: '3301 South Greenfield Rd',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/addresses/validate',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			country: 'US',
			state: 'AZ',
			zip: '85297',
			city: 'Gilbert',
			street: '3301 South Greenfield Rd',
		});
		// The street and ZIP come back normalized.
		expect(result.addresses[0]?.street).toBe('3301 S Greenfield Rd');
	});

	it('rejects an address with no country', async () => {
		await expect(
			invoke(Reference.addressesValidate, { zip: '85297' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('taxes.calculate', () => {
	it('POSTs /v2/taxes and parses numeric amounts', async () => {
		respond(taxCalculation);

		const result = await invoke(Reference.taxesCalculate, {
			from_city: 'Miami',
			from_state: 'FL',
			from_zip: '33018',
			from_country: 'US',
			to_city: 'Portland',
			to_state: 'OR',
			to_zip: '97035',
			to_country: 'US',
			amount: 15,
			shipping: 1.5,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/taxes',
			method: 'POST',
		});
		expect(result.tax.amount_to_collect).toBe(1.35);
		expect(result.tax.has_nexus).toBe(true);
		expect(result.tax.breakdown?.line_items).toHaveLength(1);
	});

	it('sends line items and nexus addresses when given', async () => {
		respond(taxCalculation);

		await invoke(Reference.taxesCalculate, {
			to_country: 'US',
			to_zip: '90002',
			nexus_addresses: [
				{ id: 'Main Location', country: 'US', zip: '92093', state: 'CA' },
			],
			line_items: [
				{
					id: '1',
					quantity: 1,
					product_tax_code: '20010',
					unit_price: 15,
					discount: 0,
				},
			],
		});

		expect(lastRequest().body).toMatchObject({
			nexus_addresses: [
				{ id: 'Main Location', country: 'US', zip: '92093', state: 'CA' },
			],
			line_items: [
				{
					id: '1',
					quantity: 1,
					product_tax_code: '20010',
					unit_price: 15,
					discount: 0,
				},
			],
		});
	});

	it('rejects an unknown exemption type', async () => {
		await expect(
			invoke(Reference.taxesCalculate, {
				to_country: 'US',
				exemption_type: 'charity',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('order transactions', () => {
	it('lists order IDs by date range', async () => {
		respond(orderIds);

		const result = await invoke(Transactions.ordersList, {
			from_transaction_date: '2015/05/01',
			to_transaction_date: '2015/05/31',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/transactions/orders',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			from_transaction_date: '2015/05/01',
			to_transaction_date: '2015/05/31',
		});
		expect(result.orders).toEqual(['123', '456']);
	});

	it('creates an order and keeps the string amounts', async () => {
		respond(order);

		const result = await invoke(Transactions.ordersCreate, {
			transaction_id: '123',
			transaction_date: '2015/05/14',
			to_country: 'US',
			to_zip: '90002',
			to_state: 'CA',
			to_city: 'Los Angeles',
			amount: 16.5,
			shipping: 1.5,
			sales_tax: 0.95,
			line_items: [
				{
					quantity: 1,
					product_identifier: '12-34243-9',
					description: 'Fuzzy Widget',
					unit_price: 15,
					sales_tax: 0.95,
				},
			],
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/transactions/orders',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			transaction_id: '123',
			amount: 16.5,
			shipping: 1.5,
		});
		// The response carries those amounts back as strings.
		expect(result.order.amount).toBe('16.5');
		expect(readNumber(result.order.amount)).toBe(16.5);
	});

	it('rejects an order with no shipping, which TaxJar requires', async () => {
		await expect(
			invoke(Transactions.ordersCreate, {
				transaction_id: '123',
				transaction_date: '2015/05/14',
				to_country: 'US',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a zero shipping charge', async () => {
		respond(order);

		await invoke(Transactions.ordersCreate, {
			transaction_id: '123',
			transaction_date: '2015/05/14',
			to_country: 'US',
			shipping: 0,
		});

		expect(lastRequest().body).toMatchObject({ shipping: 0 });
	});

	it('gets, updates and deletes an order', async () => {
		respond(order);
		await invoke(Transactions.ordersGet, { transactionId: '123' });
		expect(lastRequest()).toMatchObject({
			path: '/v2/transactions/orders/123',
			method: 'GET',
		});

		respond(order);
		await invoke(Transactions.ordersUpdate, {
			transactionId: '123',
			amount: 17,
			shipping: 2,
		});
		expect(lastRequest()).toMatchObject({
			path: '/v2/transactions/orders/123',
			method: 'PUT',
		});
		// The path id must not reappear in the body.
		expect(lastRequest().body).toEqual({ amount: 17, shipping: 2 });

		respond(orderDeleted);
		const deleted = await invoke(Transactions.ordersRemove, {
			transactionId: '123',
		});
		expect(lastRequest()).toMatchObject({
			path: '/v2/transactions/orders/123',
			method: 'DELETE',
		});
		expect(deleted).toEqual({ success: true });
	});
});

describe('refund transactions', () => {
	it('lists refund IDs under the refunds key, not orders', async () => {
		respond(refundIds);

		const result = await invoke(Transactions.refundsList, {});

		expect(lastRequest()).toMatchObject({
			path: '/v2/transactions/refunds',
			method: 'GET',
		});
		expect(result.refunds).toEqual(['r1', 'r2']);
	});

	it('creates a refund linked to its order', async () => {
		respond(refund);

		const result = await invoke(Transactions.refundsCreate, {
			transaction_id: 'r1',
			transaction_reference_id: '123',
			transaction_date: '2015/05/15',
			to_country: 'US',
			amount: 16.5,
			shipping: 1.5,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/transactions/refunds',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			transaction_reference_id: '123',
		});
		expect(result.refund.transaction_reference_id).toBe('123');
	});

	it('gets, updates and deletes a refund', async () => {
		respond(refund);
		await invoke(Transactions.refundsGet, { transactionId: 'r1' });
		expect(lastRequest().path).toBe('/v2/transactions/refunds/r1');

		respond(refund);
		await invoke(Transactions.refundsUpdate, {
			transactionId: 'r1',
			shipping: 2,
		});
		expect(lastRequest()).toMatchObject({ method: 'PUT' });
		expect(lastRequest().body).toEqual({ shipping: 2 });

		respond(refundDeleted);
		await invoke(Transactions.refundsRemove, { transactionId: 'r1' });
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});
});

describe('customers', () => {
	it('lists customer IDs', async () => {
		respond(customerIds);

		const result = await invoke(Customers.customersList, {});

		expect(lastRequest().path).toBe('/v2/customers');
		expect(result.customers).toEqual(['123', '124', '125']);
	});

	it('creates an exempt customer with its regions', async () => {
		respond(customer);

		const result = await invoke(Customers.customersCreate, {
			customer_id: '123',
			exemption_type: 'wholesale',
			exempt_regions: [
				{ country: 'US', state: 'FL' },
				{ country: 'US', state: 'PA' },
			],
			name: 'Dunder Mifflin Paper Company',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/customers',
			method: 'POST',
		});
		expect(result.customer.exemption_type).toBe('wholesale');
		expect(result.customer.exempt_regions).toHaveLength(2);
	});

	it('rejects a customer with no exemption type', async () => {
		await expect(
			invoke(Customers.customersCreate, { customer_id: '123' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets, updates and deletes a customer', async () => {
		respond(customer);
		await invoke(Customers.customersGet, { customerId: '123' });
		expect(lastRequest().path).toBe('/v2/customers/123');

		respond(customer);
		await invoke(Customers.customersUpdate, {
			customerId: '123',
			exemption_type: 'government',
		});
		expect(lastRequest().body).toEqual({ exemption_type: 'government' });

		respond(customerDeleted);
		const deleted = await invoke(Customers.customersRemove, {
			customerId: '123',
		});
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
		expect(deleted).toEqual({ success: true });
	});
});

describe('error handling', () => {
	it('parses the failure envelope for a refused key', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(invoke(Reference.categoriesList, {}));

		expect(error.status).toBe(401);
		expect(error.body).toMatchObject({ error: 'Unauthorized' });
		expect(error.message).toContain('TaxJar 401 Unauthorized');
		expect(error.message).toContain('Not authorized for route');
	});

	it('parses a 404 route error', async () => {
		respond(notFoundResponse, 404);

		const error = await rejection(invoke(Reference.categoriesList, {}));

		expect(error.status).toBe(404);
		expect(error.body).toMatchObject({ error: 'Not Found' });
	});

	it('parses a 422 with the field named in detail', async () => {
		respond(unprocessableResponse, 422);

		const error = await rejection(
			invoke(Transactions.ordersCreate, {
				transaction_id: '123',
				transaction_date: '2015/05/14',
				to_country: 'US',
				to_zip: 'x',
				shipping: 0,
			}),
		);

		expect(error.status).toBe(422);
		expect(error.message).toContain('to_zip is not a valid postal code');
	});

	it('drops the transaction body (addresses, amounts) from the error', async () => {
		respond(unprocessableResponse, 422);

		const error = await rejection(
			invoke(Transactions.ordersCreate, {
				transaction_id: '123',
				transaction_date: '2026-11-15',
				to_country: 'US',
				to_zip: '90002',
				to_street: '1 Secret Lane',
				shipping: 0,
			}),
		);

		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('Secret Lane');
	});

	it('refuses a delete the provider did not confirm', async () => {
		respond({ order: {} });

		await expect(
			invoke(Transactions.ordersRemove, { transactionId: '123' }),
		).rejects.toThrow();
	});

	it('sends the provider on an update, in the body', async () => {
		respond({ order: { transaction_id: '123' } });

		await invoke(Transactions.ordersUpdate, {
			transactionId: '123',
			provider: 'pos',
			amount: 10,
		});

		expect(lastRequest().body).toEqual({ provider: 'pos', amount: 10 });
	});

	it('encodes ids and sends the provider on get', async () => {
		respond({ order: { transaction_id: 'a/b' } });

		await invoke(Transactions.ordersGet, {
			transactionId: 'a/b',
			provider: 'pos',
		});

		expect(lastRequest().path).toBe('/v2/transactions/orders/a%2Fb');
		expect(lastRequest().query).toEqual({ provider: 'pos' });
	});

	it('rejects a dot-segment id', async () => {
		await expect(
			invoke(Transactions.ordersRemove, { transactionId: '..' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('never leaks the key through the error', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(invoke(Reference.categoriesList, {}));

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});
});

describe('readNumber', () => {
	it('reads a number, a numeric string, and rejects the rest', () => {
		expect(readNumber(1.5)).toBe(1.5);
		expect(readNumber('1.5')).toBe(1.5);
		expect(readNumber('abc')).toBeUndefined();
		expect(readNumber(null)).toBeUndefined();
		expect(readNumber(undefined)).toBeUndefined();
	});
});

describe('logging', () => {
	it('logs the operation without the input', async () => {
		respond(rates);

		await invoke(Reference.ratesGet, { zip: '90404' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'taxjar.rates.get',
			{},
			'completed',
		);
	});
});
