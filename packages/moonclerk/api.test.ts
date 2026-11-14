import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import type { MoonClerkContext } from './index';
import { moonClerkEndpointSchemas, moonclerk } from './index';

const plugin = moonclerk({ key: 'test-key' });
const endpoints = plugin.endpoints;
if (!endpoints) throw new Error('MoonClerk endpoints are missing');
const ctx = { key: 'resolved-key' } as MoonClerkContext;
const json = (body: object) =>
	new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'content-type': 'application/json' },
	});

describe('MoonClerk public endpoints', () => {
	let fetchMock: jest.SpyInstance;
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});

	const cases = [
		{
			name: 'forms.list',
			call: () => endpoints.forms.list(ctx, { count: 20, offset: 20 }),
			url: '/forms?count=20&offset=20',
			result: { forms: [{ id: 123, title: 'Monthly', payment_volume: 100 }] },
		},
		{
			name: 'forms.get',
			call: () => endpoints.forms.get(ctx, { id: 123 }),
			url: '/forms/123',
			result: { form: { id: 123, title: 'Monthly' } },
		},
		{
			name: 'customers.list',
			call: () =>
				endpoints.customers.list(ctx, {
					count: 10,
					offset: 10,
					form_id: 3,
					checkout_from: '2026-01-01',
					checkout_to: '2026-01-31',
					next_payment_from: '2026-02-01',
					next_payment_to: '2026-02-28',
					status: 'active',
				}),
			url: '/customers?count=10&offset=10&form_id=3&checkout_from=2026-01-01&checkout_to=2026-01-31&next_payment_from=2026-02-01&next_payment_to=2026-02-28&status=active',
			result: {
				customers: [
					{
						id: 4,
						discount: null,
						custom_id: null,
						subscription: { trial_end: null, status: 'active' },
					},
				],
			},
		},
		{
			name: 'customers.get',
			call: () => endpoints.customers.get(ctx, { id: 4 }),
			url: '/customers/4',
			result: {
				customer: {
					id: 4,
					discount: null,
					customer_reference: null,
					custom_fields: { shirt: { id: 2, type: 'string', response: 'XL' } },
				},
			},
		},
		{
			name: 'payments.list',
			call: () =>
				endpoints.payments.list(ctx, {
					count: 25,
					offset: 25,
					form_id: 3,
					customer_id: 4,
					date_from: '2026-01-01',
					date_to: '2026-01-31',
					status: 'successful',
				}),
			url: '/payments?count=25&offset=25&form_id=3&customer_id=4&date_from=2026-01-01&date_to=2026-01-31&status=successful',
			result: {
				payments: [
					{
						id: 5,
						amount: 1000,
						customer_id: null,
						customer_reference: null,
						invoice_reference: null,
						checkout: null,
						coupon: null,
					},
				],
			},
		},
		{
			name: 'payments.get',
			call: () => endpoints.payments.get(ctx, { id: 5 }),
			url: '/payments/5',
			result: {
				payment: { id: 5, status: 'refunded', amount_description: null },
			},
		},
	];
	it.each(cases)(
		'$name sends the documented request and parses the response',
		async ({ call, url, result }) => {
			fetchMock.mockResolvedValueOnce(json(result));
			await expect(call()).resolves.toEqual(result);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const [actualUrl, init] = fetchMock.mock.calls[0];
			expect(actualUrl).toBe(`https://api.moonclerk.com${url}`);
			expect(init.method).toBe('GET');
			expect(init.body).toBeUndefined();
			expect(init.headers.get('authorization')).toBe(
				'Token token=resolved-key',
			);
			expect(init.headers.get('accept')).toBe(
				'application/vnd.moonclerk+json;version=1',
			);
		},
	);
	it('rejects invalid input before making a request', async () => {
		for (const id of ['', '.', '..', 'a/b', 'a\\b', '"', "'", 1.5]) {
			await expect(endpoints.forms.get(ctx, { id } as never)).rejects.toThrow();
		}
		await expect(
			endpoints.payments.list(ctx, { count: 101 }),
		).rejects.toThrow();
		await expect(
			endpoints.customers.list(ctx, { offset: -1 }),
		).rejects.toThrow();
		await expect(
			endpoints.payments.list(ctx, { date_from: '2026-99-99' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('validates every response envelope and accepts empty pages', () => {
		expect(
			moonClerkEndpointSchemas['forms.list'].output.parse({ forms: [] }),
		).toEqual({ forms: [] });
		expect(
			moonClerkEndpointSchemas['customers.list'].output.parse({
				customers: [],
			}),
		).toEqual({ customers: [] });
		expect(
			moonClerkEndpointSchemas['payments.list'].output.parse({ payments: [] }),
		).toEqual({ payments: [] });
		for (const schema of Object.values(moonClerkEndpointSchemas)) {
			expect(schema.output.safeParse({}).success).toBe(false);
		}
	});
	it('rejects a missing key before making a request', async () => {
		await expect(
			endpoints.forms.list({ ...ctx, key: '' }, {}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('preserves provider errors and rate-limit metadata', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('HTTP Token: Access denied.', {
				status: 401,
				headers: { 'content-type': 'text/plain' },
			}),
		);
		await expect(endpoints.forms.list(ctx, {})).rejects.toMatchObject({
			status: 401,
			body: 'HTTP Token: Access denied.',
		});
		const error = new ApiError(
			{ method: 'GET', url: '/forms' },
			{
				url: '/forms',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: 'throttled',
			},
			'rate limited',
			{ retryAfter: 5 },
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(5);
	});
});
