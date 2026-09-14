import { TursoAPIError } from './client';
import { errorHandlers } from './error-handlers';

/** Returns the first handler key whose matcher claims the error. */
function route(error: Error): string {
	return (
		Object.keys(errorHandlers).find((name) =>
			errorHandlers[name as keyof typeof errorHandlers].match(error),
		) ?? 'UNMATCHED'
	);
}

describe('errorHandlers routing', () => {
	it('routes 429 to the rate-limit handler', () => {
		expect(route(new TursoAPIError('slow down', undefined, 429))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('routes 401 and 403 to the auth handler', () => {
		expect(route(new TursoAPIError('nope', undefined, 401))).toBe('AUTH_ERROR');
		expect(route(new TursoAPIError('nope', undefined, 403))).toBe('AUTH_ERROR');
	});

	it('routes an expired-token message to the auth handler', () => {
		expect(route(new TursoAPIError('expired token'))).toBe('AUTH_ERROR');
	});

	it('routes 404 to the not-found handler', () => {
		expect(route(new TursoAPIError('missing', undefined, 404))).toBe(
			'NOT_FOUND_ERROR',
		);
	});

	it('routes 5xx to the server-error handler', () => {
		expect(route(new TursoAPIError('boom', undefined, 503))).toBe(
			'SERVER_ERROR',
		);
	});

	it('falls through to DEFAULT for an unclassified error', () => {
		expect(route(new Error('something odd'))).toBe('DEFAULT');
	});
});

describe('errorHandlers retry strategies', () => {
	it('backs off on rate limits and keeps the Retry-After metadata', async () => {
		const error = new TursoAPIError('slow down', undefined, 429, 30_000);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 30_000,
		});
	});

	it('backs off without a hint when Retry-After was absent', async () => {
		const error = new TursoAPIError('slow down', undefined, 429);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBeUndefined();
	});

	it('retries server errors a bounded number of times', async () => {
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never retries auth, not-found or unclassified failures', async () => {
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
