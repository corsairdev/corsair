import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	body: { message?: string; error_code?: string },
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'GET', url: 'products' },
		{
			url: 'https://app.appointo.me/api/products',
			ok: false,
			status,
			statusText: String(status),
			body,
		},
		body.message ?? String(status),
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Appointo error handlers', () => {
	it('routes 429 ApiError through RATE_LIMIT_ERROR and honors Retry-After', async () => {
		const error = apiError(429, { message: 'Too many requests' }, 1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes documented no_api_token_present 401 through AUTH_ERROR', () => {
		const error = apiError(401, {
			error_code: 'no_api_token_present',
			message: 'Appointo API Token is not present in headers.',
		});
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('routes documented invalid_api_token 401 through AUTH_ERROR', () => {
		const error = apiError(401, {
			error_code: 'invalid_api_token',
			message: 'API token is invalid. Please check token in Appointo settings.',
		});
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});
});
