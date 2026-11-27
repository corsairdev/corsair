import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, method = 'GET') {
	return new ApiError(
		{ method: method as 'GET', url: '/wc/v3/orders/{id}' },
		{
			url: 'https://example.com/wp-json/wc/v3/orders/12',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		`WooCommerce ${status}`,
	);
}

describe('error handlers', () => {
	it('leaves 429 retries to core', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('never retries auth, missing or invalid requests', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(400))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(410))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(409))).toBe(true);
	});

	it('retries a 5xx for reads only', async () => {
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(502, 'GET')),
		).resolves.toMatchObject({ maxRetries: 2 });
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(502, 'POST')),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
