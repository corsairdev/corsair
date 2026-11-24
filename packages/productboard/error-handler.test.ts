import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2/notes' },
		{
			url: 'https://api.productboard.com/v2/notes',
			ok: false,
			status,
			statusText: 'Request failed',
			body: {},
		},
		'Productboard request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function handlerName(error: Error): string | undefined {
	return Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	)?.[0];
}

describe('Productboard error handlers', () => {
	it('routes HTTP 429 to RATE_LIMIT_ERROR with transport-owned retry policy', async () => {
		const error = apiError(429, 3000);
		expect(handlerName(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 401 and 403 to AUTH_ERROR without retrying', async () => {
		expect(handlerName(apiError(401))).toBe('AUTH_ERROR');
		expect(handlerName(apiError(403))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not classify ordinary 400 and 404 responses as auth or rate errors', () => {
		expect(handlerName(apiError(400))).toBe('DEFAULT');
		expect(handlerName(apiError(404))).toBe('DEFAULT');
	});

	it('does not retry 5xx failures for writes', async () => {
		expect(handlerName(apiError(500))).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('keeps DEFAULT last because dispatch is first-match', () => {
		const names = Object.keys(errorHandlers);
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(handlerName(new Error('unrecognized provider failure'))).toBe(
			'DEFAULT',
		);
	});
});
