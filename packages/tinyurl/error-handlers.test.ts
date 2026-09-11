import { TinyurlAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('TinyURL RATE_LIMIT_ERROR', () => {
	it('matches a 429 TinyurlAPIError and forwards retryAfter', async () => {
		const error = new TinyurlAPIError('Too Many Requests', 429, 429, 3000);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});

	it('matches rate limit message when status is omitted', () => {
		const error = new TinyurlAPIError('Rate limited by TinyURL');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('does not match a 500 error', () => {
		const error = new TinyurlAPIError('Server error', 500, 500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});
});

describe('TinyURL AUTH_ERROR', () => {
	it('matches a 401 TinyurlAPIError', () => {
		const error = new TinyurlAPIError('Unauthorized', 401, 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('matches a 403 TinyurlAPIError', () => {
		const error = new TinyurlAPIError('Forbidden', 403, 403);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('matches an invalid token message', () => {
		const error = new TinyurlAPIError('Invalid API token provided');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('returns maxRetries: 0 for auth error', async () => {
		const error = new TinyurlAPIError('Unauthorized', 401, 401);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('TinyURL BAD_REQUEST_ERROR', () => {
	it('matches a 400 TinyurlAPIError', () => {
		const error = new TinyurlAPIError('Bad Request', 400, 400);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
	});

	it('matches a 422 TinyurlAPIError (validation failure)', () => {
		const error = new TinyurlAPIError('The URL field is required.', 422, 422);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
	});

	it('returns maxRetries: 0 for bad request', async () => {
		const error = new TinyurlAPIError('Bad Request', 400, 400);
		await expect(
			errorHandlers.BAD_REQUEST_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('TinyURL DEFAULT error handler', () => {
	it('matches any fallback error and returns maxRetries: 0', async () => {
		const error = new Error('Unknown error');
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		await expect(errorHandlers.DEFAULT.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
