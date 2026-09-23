import { ApiError, request } from 'corsair/http';
import { BooqableAPIError, makeBooqableRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('makeBooqableRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('serializes nested filter query params', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await makeBooqableRequest('/orders', 'key', 'acme', {
			query: {
				filter: { status: 'reserved', starts_at: { gte: '2018-01-01' } },
			},
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: {
					filter: { status: 'reserved', starts_at: { gte: '2018-01-01' } },
				},
			}),
		);
	});

	it('sends bearer auth to the company-scoped base URL', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await makeBooqableRequest('/customers', 'test-api-key', 'demo-company', {
			method: 'GET',
			query: { 'page[number]': 1, 'page[size]': 25 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://demo-company.booqable.com/api/4',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/customers',
				query: { 'page[number]': 1, 'page[size]': 25 },
			}),
		);
	});

	it('preserves ApiError metadata when wrapping failures', async () => {
		const apiError = new ApiError(
			{ url: '/customers', method: 'GET' },
			{
				url: '/customers',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'rate limited',
			{ retryAfter: 1500 },
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeBooqableRequest('/customers', 'test-api-key', 'demo-company'),
		).rejects.toMatchObject({
			name: 'BooqableAPIError',
			status: 429,
			retryAfter: 1500,
		});
	});

	it('parses JSON string bodies returned for vnd.api+json responses', async () => {
		mockRequest.mockResolvedValue('{"data":[],"meta":{}}');

		await expect(makeBooqableRequest('/users', 'key', 'acme')).resolves.toEqual(
			{ data: [], meta: {} },
		);
	});

	it('passes through non-JSON string bodies untouched', async () => {
		mockRequest.mockResolvedValue('<html>oops</html>');

		await expect(makeBooqableRequest('/users', 'key', 'acme')).resolves.toBe(
			'<html>oops</html>',
		);
	});

	it('wraps ApiError in BooqableAPIError with status and retryAfter', async () => {
		const apiError = new ApiError(
			{ url: '/orders', method: 'GET' },
			{
				url: '/orders',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: {},
			},
			'unauthorized',
		);
		mockRequest.mockRejectedValue(apiError);

		try {
			await makeBooqableRequest('/orders', 'key', 'acme');
			fail('expected throw');
		} catch (error) {
			expect(error).toBeInstanceOf(BooqableAPIError);
			if (error instanceof BooqableAPIError) {
				expect(error.status).toBe(401);
			} else {
				throw new Error('[test] expected BooqableAPIError');
			}
		}
	});
});
