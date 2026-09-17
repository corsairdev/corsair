import { ImejisioAPIError } from './client';
import { errorHandlers } from './error-handlers';

/** Returns the first handler key whose matcher claims the error. */
function route(error: Error): string {
	const key = Object.keys(errorHandlers).find((name) =>
		errorHandlers[name as keyof typeof errorHandlers].match(error),
	);
	return key ?? 'UNMATCHED';
}

describe('errorHandlers routing', () => {
	it('routes an exhausted quota to the rate-limit handler', () => {
		expect(route(new ImejisioAPIError('quota exceeded', undefined, 429))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('routes a no-plan 429 to the permission handler, not rate-limit', () => {
		// Verbatim `reason` returned by render.imejis.io for a plan-less workspace.
		expect(route(new ImejisioAPIError('no active plan', 'no-plan', 429))).toBe(
			'PERMISSION_ERROR',
		);
	});

	it('routes a 401 to the auth handler', () => {
		expect(route(new ImejisioAPIError('nope', undefined, 401))).toBe(
			'AUTH_ERROR',
		);
	});

	it('routes a 404 to the not-found handler', () => {
		expect(
			route(new ImejisioAPIError('Design not found', undefined, 404)),
		).toBe('NOT_FOUND_ERROR');
	});

	it('routes an unknown render key (404 "Key not found") to auth', () => {
		expect(route(new ImejisioAPIError('Key not found', undefined, 404))).toBe(
			'AUTH_ERROR',
		);
	});

	it('routes 5xx to the server-error handler', () => {
		expect(route(new ImejisioAPIError('boom', undefined, 503))).toBe(
			'SERVER_ERROR',
		);
	});

	it('falls through to DEFAULT for an unclassified error', () => {
		expect(route(new Error('something odd'))).toBe('DEFAULT');
	});
});

describe('errorHandlers retry strategies', () => {
	it('waits for a quota reset that is close enough to sit out', async () => {
		const error = new ImejisioAPIError('quota', undefined, 429, 45_000);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);

		expect(strategy).toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 45_000,
		});
	});

	it('falls back to backoff rather than blocking on a distant reset', async () => {
		// 17 minutes out — the real reset distance observed from the live service.
		const error = new ImejisioAPIError('quota', undefined, 429, 1_022_441);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);

		expect(strategy.headersRetryAfterMs).toBeUndefined();
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	it('never retries a plan-less workspace', async () => {
		await expect(errorHandlers.PERMISSION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('backs off without a reset hint when the body carried none', async () => {
		const error = new ImejisioAPIError('slow down', undefined, 429);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);

		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBeUndefined();
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

	it('retries server errors a bounded number of times', async () => {
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});
});
