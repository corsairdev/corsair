import { ApiError } from 'corsair/http';
import { FixerAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Fixer Error Handlers', () => {
	it('matches 429 rate limit error via ApiError and FixerAPIError', async () => {
		const rateLimitError = new ApiError(
			{ method: 'GET', url: '/latest' },
			{
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'rate_limited' },
				url: 'https://api.apilayer.com/fixer/latest',
				ok: false,
			},
			'429 Too Many Requests',
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError)).toBe(true);
		const handled =
			await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimitError);
		expect(handled.maxRetries).toBe(5);

		const fixerRateLimit = new FixerAPIError('usage limit reached', 104);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(fixerRateLimit)).toBe(true);
	});

	it('matches 401 and 403 auth errors via ApiError and FixerAPIError', async () => {
		const authError = new ApiError(
			{ method: 'GET', url: '/latest' },
			{
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'Invalid authentication credentials' },
				url: 'https://api.apilayer.com/fixer/latest',
				ok: false,
			},
			'Unauthorized',
		);

		expect(errorHandlers.AUTH_ERROR.match(authError)).toBe(true);
		const handled = await errorHandlers.AUTH_ERROR.handler(authError);
		expect(handled.maxRetries).toBe(0);

		const fixerAuthError = new FixerAPIError('invalid access key', 101);
		expect(errorHandlers.AUTH_ERROR.match(fixerAuthError)).toBe(true);
	});

	it('matches 404 not found error', async () => {
		const notFoundError = new ApiError(
			{ method: 'GET', url: '/unknown' },
			{
				status: 404,
				statusText: 'Not Found',
				body: { message: 'Resource not found' },
				url: 'https://api.apilayer.com/fixer/unknown',
				ok: false,
			},
			'Not Found',
		);

		expect(errorHandlers.NOT_FOUND_ERROR.match(notFoundError)).toBe(true);
		const handled = await errorHandlers.NOT_FOUND_ERROR.handler(notFoundError);
		expect(handled.maxRetries).toBe(0);
	});

	it('matches 400 validation error', async () => {
		const validationError = new ApiError(
			{ method: 'GET', url: '/latest' },
			{
				status: 400,
				statusText: 'Bad Request',
				body: { message: 'invalid base currency' },
				url: 'https://api.apilayer.com/fixer/latest',
				ok: false,
			},
			'invalid base currency',
		);

		expect(errorHandlers.VALIDATION_ERROR.match(validationError)).toBe(true);
		const handled =
			await errorHandlers.VALIDATION_ERROR.handler(validationError);
		expect(handled.maxRetries).toBe(0);

		const fixerValidationError = new FixerAPIError('invalid symbols', 202);
		expect(errorHandlers.VALIDATION_ERROR.match(fixerValidationError)).toBe(
			true,
		);
	});
});
