import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, body: unknown = {}): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{ url: '/test', ok: false, status, statusText: 'Error', body },
		`request failed with status ${status}`,
	);
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

function context(error: Error) {
	return {
		pluginId: 'nextdns',
		operation: 'test.op',
		input: {},
		originalError: error,
	};
}

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies a 401 as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiError(401))).toBe('AUTH_ERROR');
	});

	/** Confirmed live: an API key probing a route it can't use (e.g. the session-only `/account`) gets 403. */
	it('classifies a 403 as PERMISSION_ERROR', () => {
		expect(matchedHandlerName(apiError(403))).toBe('PERMISSION_ERROR');
	});

	it('classifies a 404 as NOT_FOUND_ERROR', () => {
		expect(matchedHandlerName(apiError(404))).toBe('NOT_FOUND_ERROR');
	});

	/** Confirmed live: an invalid field value 400s with `{"errors":[{"code":"invalid",...}]}`. */
	it('classifies a 400 as VALIDATION_ERROR', () => {
		expect(matchedHandlerName(apiError(400))).toBe('VALIDATION_ERROR');
	});

	/**
	 * `packages/corsair/core/endpoints/bind.ts`'s endpoint-level retry
	 * recurses on retry but discards the result, always rethrowing the
	 * original error even when the retry succeeds - so every handler here
	 * must return `maxRetries: 0` and let `client.ts`'s transport-level
	 * retry (a real loop) be the only place a retry can actually happen.
	 * This matters more here than in a read-only catalog: this plugin has
	 * real POST/PUT/PATCH/DELETE operations, so a wasted retry risks a
	 * double-submitted mutation, not just a wasted read.
	 */
	it('returns maxRetries: 0 for every handler', async () => {
		for (const def of Object.values(errorHandlers)) {
			const error = apiError(500);
			const strategy = await def.handler(error, context(error));
			expect(strategy.maxRetries ?? 0).toBe(0);
		}
	});
});
