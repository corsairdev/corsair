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
		pluginId: 'autom',
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

	it('classifies a 402 as PAYMENT_ERROR', () => {
		expect(matchedHandlerName(apiError(402))).toBe('PAYMENT_ERROR');
	});

	it('classifies a 400 as VALIDATION_ERROR', () => {
		expect(matchedHandlerName(apiError(400))).toBe('VALIDATION_ERROR');
	});

	it('classifies a 403 as PERMISSION_ERROR', () => {
		expect(matchedHandlerName(apiError(403))).toBe('PERMISSION_ERROR');
	});

	/**
	 * `bind.ts` endpoint-level retry discards a successful retry and rethrows
	 * the original error. Transport-level retry in `request()` is the only
	 * working 429 loop, so every handler here must return maxRetries: 0.
	 */
	it('returns maxRetries: 0 for every handler', async () => {
		for (const def of Object.values(errorHandlers)) {
			const error = apiError(500);
			const strategy = await def.handler(error, context(error));
			expect(strategy.maxRetries ?? 0).toBe(0);
		}
	});
});
