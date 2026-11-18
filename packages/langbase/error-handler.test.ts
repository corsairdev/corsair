import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

describe('Langbase error handlers', () => {
	it('matches 429 status and extracts Retry-After duration', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: 'https://api.langbase.com/v1/pipes',
			},
			{
				body: { error: { message: 'Too many requests' } },
				status: 429,
				statusText: 'Too Many Requests',
				headers: {},
				ok: false,
				url: 'https://api.langbase.com/v1/pipes',
			},
			'Too Many Requests',
		);
		(apiError as { retryAfter?: number }).retryAfter = 3000;

		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(apiError);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(3000);
	});

	it('matches AUTH_ERROR for 401 and 403', async () => {
		const authError401 = new ApiError(
			{ method: 'GET', url: 'https://api.langbase.com/v1/pipes' },
			{
				body: { error: { message: 'Unauthorized' } },
				status: 401,
				statusText: 'Unauthorized',
				headers: {},
				ok: false,
				url: 'https://api.langbase.com/v1/pipes',
			},
			'Unauthorized',
		);
		expect(errorHandlers.AUTH_ERROR.match(authError401)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(authError401);
		expect(result.maxRetries).toBe(0);

		const authError403 = new ApiError(
			{ method: 'GET', url: 'https://api.langbase.com/v1/pipes' },
			{
				body: { error: { message: 'Forbidden' } },
				status: 403,
				statusText: 'Forbidden',
				headers: {},
				ok: false,
				url: 'https://api.langbase.com/v1/pipes',
			},
			'Forbidden',
		);
		expect(errorHandlers.AUTH_ERROR.match(authError403)).toBe(true);
	});

	it('matches NOT_FOUND_ERROR for 404', async () => {
		const notFoundError = new ApiError(
			{ method: 'GET', url: 'https://api.langbase.com/v1/pipes/unknown' },
			{
				body: { error: { message: 'Pipe not found' } },
				status: 404,
				statusText: 'Not Found',
				headers: {},
				ok: false,
				url: 'https://api.langbase.com/v1/pipes/unknown',
			},
			'Not Found',
		);
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFoundError)).toBe(true);
		const result = await errorHandlers.NOT_FOUND_ERROR.handler(notFoundError);
		expect(result.maxRetries).toBe(0);
	});

	it('matches VALIDATION_ERROR for 400 and 422', async () => {
		const validationError = new ApiError(
			{ method: 'POST', url: 'https://api.langbase.com/v1/pipes' },
			{
				body: { error: { message: 'Validation failed' } },
				status: 400,
				statusText: 'Bad Request',
				headers: {},
				ok: false,
				url: 'https://api.langbase.com/v1/pipes',
			},
			'Bad Request',
		);
		expect(errorHandlers.VALIDATION_ERROR.match(validationError)).toBe(true);
		const result = await errorHandlers.VALIDATION_ERROR.handler(validationError);
		expect(result.maxRetries).toBe(0);
	});

	it('falls back to DEFAULT handler', async () => {
		const generalError = new Error('Unexpected network reset');
		expect(errorHandlers.DEFAULT.match(generalError)).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(generalError);
		expect(result.maxRetries).toBe(0);
	});
});
