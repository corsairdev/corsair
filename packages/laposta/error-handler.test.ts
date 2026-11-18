import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

describe('Laposta error handlers', () => {
	it('matches 429 status and extracts Retry-After duration', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: 'https://api.laposta.nl/v2/list',
			},
			{
				body: { error: { message: 'Too many requests' } },
				status: 429,
				statusText: 'Too Many Requests',
				ok: false,
				url: 'https://api.laposta.nl/v2/list',
			},
			'Too Many Requests',
		);
		// Simulate parsed retryAfter on ApiError
		(apiError as { retryAfter?: number }).retryAfter = 4000;

		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(apiError);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(4000);
	});

	it('matches AUTH_ERROR for 401 and 403', async () => {
		const authError401 = new ApiError(
			{ method: 'GET', url: 'https://api.laposta.nl/v2/list' },
			{
				body: { error: { message: 'Unauthorized' } },
				status: 401,
				statusText: 'Unauthorized',
				ok: false,
				url: 'https://api.laposta.nl/v2/list',
			},
			'Unauthorized',
		);
		expect(errorHandlers.AUTH_ERROR.match(authError401)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);

		const authError403 = new ApiError(
			{ method: 'GET', url: 'https://api.laposta.nl/v2/list' },
			{
				body: { error: { message: 'Forbidden' } },
				status: 403,
				statusText: 'Forbidden',
				ok: false,
				url: 'https://api.laposta.nl/v2/list',
			},
			'Forbidden',
		);
		expect(errorHandlers.AUTH_ERROR.match(authError403)).toBe(true);
	});

	it('matches NOT_FOUND_ERROR for 404', async () => {
		const notFoundError = new ApiError(
			{ method: 'GET', url: 'https://api.laposta.nl/v2/list/unknown' },
			{
				body: { error: { message: 'Resource not found' } },
				status: 404,
				statusText: 'Not Found',
				ok: false,
				url: 'https://api.laposta.nl/v2/list/unknown',
			},
			'Not Found',
		);
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFoundError)).toBe(true);
		const result = await errorHandlers.NOT_FOUND_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('matches VALIDATION_ERROR for 400 and 422', async () => {
		const validationError = new ApiError(
			{ method: 'POST', url: 'https://api.laposta.nl/v2/list' },
			{
				body: { error: { message: 'Validation failed' } },
				status: 400,
				statusText: 'Bad Request',
				ok: false,
				url: 'https://api.laposta.nl/v2/list',
			},
			'Bad Request',
		);
		expect(errorHandlers.VALIDATION_ERROR.match(validationError)).toBe(true);
		const result = await errorHandlers.VALIDATION_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('falls back to DEFAULT handler', async () => {
		const generalError = new Error('Random unexpected network glitch');
		expect(errorHandlers.DEFAULT.match(generalError)).toBe(true);
		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});
