import { OrbitAPIError } from './client';
import { errorHandlers } from './error-handlers';

function orbitError(
	status: number,
	code: string,
	method: 'GET' | 'POST' = 'POST',
	hasIdempotency = false,
	retryAfter?: number,
) {
	return new OrbitAPIError(code, {
		status,
		code,
		method,
		hasIdempotency,
		retryAfter,
	});
}

describe('orbit error handlers', () => {
	it('matches an idempotency conflict before the credit and rate-limit handlers', () => {
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('IDEMPOTENCY_CONFLICT')).toBeLessThan(
			names.indexOf('INSUFFICIENT_CREDITS'),
		);
		expect(names.indexOf('INSUFFICIENT_CREDITS')).toBeLessThan(
			names.indexOf('RATE_LIMIT'),
		);
		const conflict = orbitError(409, 'idempotency_conflict');
		expect(errorHandlers.IDEMPOTENCY_CONFLICT.match(conflict)).toBe(true);
		expect(errorHandlers.RATE_LIMIT.match(conflict)).toBe(false);
	});

	it('does not retry a credit or validation error', async () => {
		const credits = orbitError(402, 'developer_api_credits_insufficient');
		const invalid = orbitError(400, 'developer_v3_search_input_required');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS.handler(credits),
		).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.CLIENT_ERROR.handler(invalid)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('caps an hour-long Retry-After on 429', async () => {
		const error = orbitError(
			429,
			'developer_api_key_rate_limited',
			'GET',
			false,
			3_600_000,
		);
		const result = await errorHandlers.RATE_LIMIT.handler(error);
		expect(result.maxRetries).toBe(2);
		expect(result.headersRetryAfterMs).toBeGreaterThanOrEqual(60_000);
		expect(result.headersRetryAfterMs).toBeLessThan(60_250);
	});

	it('retries a server error only when the call can be replayed', async () => {
		const bare = orbitError(500, 'internal', 'POST', false);
		const replay = orbitError(500, 'internal', 'POST', true);
		const read = orbitError(503, 'unavailable', 'GET', false);
		await expect(errorHandlers.SERVER_ERROR.handler(bare)).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(
			errorHandlers.SERVER_ERROR.handler(replay),
		).resolves.toMatchObject({
			maxRetries: 1,
		});
		await expect(
			errorHandlers.SERVER_ERROR.handler(read),
		).resolves.toMatchObject({
			maxRetries: 1,
		});
	});

	it('does not treat a 500 that mentions rate limits as a 429', () => {
		const error = orbitError(500, 'internal');
		error.message = 'Too many requests';
		expect(errorHandlers.RATE_LIMIT.match(error)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
	});
});
