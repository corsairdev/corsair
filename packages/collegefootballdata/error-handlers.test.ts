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

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies a 401 as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiError(401))).toBe('AUTH_ERROR');
	});

	it('classifies a 403 as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiError(403))).toBe('AUTH_ERROR');
	});

	it('classifies a 404 as NOT_FOUND_ERROR', () => {
		expect(matchedHandlerName(apiError(404))).toBe('NOT_FOUND_ERROR');
	});

	it('classifies a 400 as VALIDATION_ERROR', () => {
		expect(matchedHandlerName(apiError(400))).toBe('VALIDATION_ERROR');
	});

	/**
	 * `packages/corsair/core/endpoints/bind.ts`'s endpoint-level retry
	 * recurses on retry but discards the retried result, always rethrowing
	 * the original error even when the retry would have succeeded - so any
	 * handler here returning `maxRetries > 0` only spends extra requests
	 * against a metered monthly quota for no benefit. Every handler must
	 * return 0 and let `client.ts`'s transport-level retry (a real loop,
	 * already the sole 429 retry path) be the only place retries happen.
	 */
	function context(error: Error) {
		return {
			pluginId: 'collegefootballdata',
			operation: 'test.op',
			input: {},
			originalError: error,
		};
	}

	it('returns maxRetries: 0 for every handler, since the shared endpoint-level retry path discards successful retries', async () => {
		for (const def of Object.values(errorHandlers)) {
			const error = apiError(500);
			const strategy = await def.handler(error, context(error));
			expect(strategy.maxRetries ?? 0).toBe(0);
		}
	});

	it('does not ask for a further endpoint-level retry after a 429', async () => {
		const error = apiError(429);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			context(error),
		);
		expect(strategy.maxRetries).toBe(0);
	});
});
