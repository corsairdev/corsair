import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function rateLimitError(): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/v1/eevee/apikey/limit/' },
		{
			url: 'https://app.docsumo.com/api/v1/eevee/apikey/limit/',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: {},
		},
		'Too Many Requests',
	);
}

function authError(): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/v1/eevee/apikey/limit/' },
		{
			url: 'https://app.docsumo.com/api/v1/eevee/apikey/limit/',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: {},
		},
		'Unauthorized',
	);
}

describe('docsumo error handlers', () => {
	it('matches 429 as RATE_LIMIT_ERROR with retries', async () => {
		const error = rateLimitError();
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
	});

	it('matches 401 as AUTH_ERROR without retries', async () => {
		const error = authError();
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('falls back to DEFAULT for unexpected errors', async () => {
		const error = new Error('boom');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});
