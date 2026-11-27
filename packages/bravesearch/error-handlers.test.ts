import { ApiError } from 'corsair/http';
import { errorHandlers, isSpentQuota } from './error-handlers';

function apiError(
	status: number,
	error: Record<string, unknown>,
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'GET', url: '/web/search' },
		{
			url: 'https://api.search.brave.com/res/v1/web/search',
			ok: false,
			status,
			statusText: '',
			body: { type: 'ErrorResponse', error },
		},
		'x',
		{ retryAfter },
	);
}

function handlerFor(error: Error) {
	const entry = Object.entries(errorHandlers).find(([, h]) => h.match(error));
	if (!entry) throw new Error('no handler');
	return entry;
}

describe('error handlers', () => {
	it('retries the per-second RATE_LIMITED 429 with Retry-After or one second', async () => {
		const [name, h] = handlerFor(
			apiError(429, {
				code: 'RATE_LIMITED',
				meta: { rate_limit: 50, rate_current: 51 },
			}),
		);
		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(await h.handler(apiError(429, { code: 'RATE_LIMITED' }))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1000,
		});
		expect(
			await h.handler(apiError(429, { code: 'RATE_LIMITED' }, 2500)),
		).toEqual({ maxRetries: 3, headersRetryAfterMs: 2500 });
	});

	it('does not retry a 429 for a spent quota', async () => {
		for (const error of [
			apiError(429, { code: 'QUOTA_LIMITED' }),
			apiError(429, { code: 'USAGE_LIMIT_EXCEEDED' }),
			apiError(429, {
				code: 'RATE_LIMITED',
				meta: { quota_limit: 2000, quota_current: 2000 },
			}),
		]) {
			expect(isSpentQuota(error)).toBe(true);
			const [name, h] = handlerFor(error);
			expect(name).toBe('QUOTA_EXCEEDED_ERROR');
			expect(await h.handler(error)).toEqual({ maxRetries: 0 });
		}
		// Brave reports an unlimited monthly quota as 0.
		expect(
			isSpentQuota(
				apiError(429, {
					code: 'RATE_LIMITED',
					meta: { quota_limit: 0, quota_current: 5 },
				}),
			),
		).toBe(false);
	});

	it.each([
		[400, 'OPTION_NOT_IN_PLAN', 'PLAN_ERROR'],
		[401, 'ADMIN_KEY_INVALID', 'AUTH_ERROR'],
		[403, 'ADMIN_KEY_SCOPE_MISSING', 'AUTH_ERROR'],
		[422, 'VALIDATION', 'BAD_REQUEST_ERROR'],
		[404, 'API_VERSION_NOT_FOUND', 'BAD_REQUEST_ERROR'],
		[500, 'INTERNAL', 'DEFAULT'],
	])('%i %s is %s and not retried', async (status, code, expected) => {
		const error = apiError(status, { code });
		const [name, h] = handlerFor(error);
		expect(name).toBe(expected);
		expect(await h.handler(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 503 with its Retry-After', async () => {
		const error = apiError(503, { code: 'ADMIN_OVERLOADED' }, 5000);
		const [name, h] = handlerFor(error);
		expect(name).toBe('SERVICE_UNAVAILABLE_ERROR');
		expect(await h.handler(error)).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 5000,
		});
	});
});
