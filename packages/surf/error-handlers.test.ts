import { SurfAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { surf } from './index';

function surfError(
	status: number,
	code: string,
	method: 'GET' | 'POST' = 'GET',
	retryAfter?: number,
) {
	return new SurfAPIError(code, { status, code, method, retryAfter });
}

describe('surf error handlers', () => {
	it('matches credits before the rate-limit handler', () => {
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('INSUFFICIENT_CREDITS')).toBeLessThan(
			names.indexOf('RATE_LIMIT'),
		);
		const credits = surfError(402, 'PAID_BALANCE_ZERO');
		expect(errorHandlers.INSUFFICIENT_CREDITS.match(credits)).toBe(true);
		expect(errorHandlers.RATE_LIMIT.match(credits)).toBe(false);
	});

	it('does not retry a credit or validation error', async () => {
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS.handler(
				surfError(402, 'FREE_QUOTA_EXHAUSTED'),
			),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.CLIENT_ERROR.handler(surfError(422, 'INVALID_REQUEST')),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('caps an hour-long Retry-After on 429', async () => {
		const result = await errorHandlers.RATE_LIMIT.handler(
			surfError(429, 'RATE_LIMITED', 'GET', 3_600_000),
		);
		expect(result.maxRetries).toBe(2);
		expect(result.headersRetryAfterMs).toBeGreaterThanOrEqual(60_000);
		expect(result.headersRetryAfterMs).toBeLessThan(60_250);
	});

	it('uses backoff when a 429 has no Retry-After', async () => {
		await expect(
			errorHandlers.RATE_LIMIT.handler(surfError(429, 'RATE_LIMITED')),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('retries an upstream GET and does not retry an upstream POST', async () => {
		await expect(
			errorHandlers.UPSTREAM.handler(
				surfError(503, 'UPSTREAM_UNAVAILABLE', 'GET'),
			),
		).resolves.toEqual({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff_jitter',
		});
		const post = surfError(503, 'UPSTREAM_UNAVAILABLE', 'POST');
		expect(errorHandlers.UPSTREAM.match(post)).toBe(false);
		expect(errorHandlers.DEFAULT.match(post)).toBe(true);
	});

	it('does not treat a 500 that mentions rate limits as a 429', () => {
		const error = surfError(500, 'INTERNAL_ERROR');
		error.message = 'rate limit exceeded';
		expect(errorHandlers.RATE_LIMIT.match(error)).toBe(false);
	});

	it('keeps a user handler ahead of the catch-all default', () => {
		const plugin = surf({
			errorHandlers: {
				zzzUser: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names.indexOf('zzzUser')).toBeGreaterThan(-1);
		expect(names.indexOf('zzzUser')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names.at(-1)).toBe('DEFAULT');
	});
});
