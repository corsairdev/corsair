import type { ErrorContext } from 'corsair/core';
import { ClickhouseAPIError } from '../client';
import { errorHandlers } from '../error-handlers';

const stubContext: ErrorContext = {
	pluginId: 'clickhouse',
	operation: 'test',
	input: {},
	originalError: new Error('x'),
};

describe('clickhouse errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches a 429 ClickhouseAPIError without any body keywords', () => {
			const err = new ClickhouseAPIError('Too Many Requests', 429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err, stubContext)).toBe(true);
		});

		it('matches the literal "rate_limited" string in the body', () => {
			const err = new ClickhouseAPIError('rate_limited: slow down');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err, stubContext)).toBe(true);
		});

		it('does not match an unrelated error', () => {
			const err = new ClickhouseAPIError('not found', 404);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err, stubContext)).toBe(
				false,
			);
		});

		it('returns maxRetries=5 with no retry-after when header is absent', async () => {
			const err = new ClickhouseAPIError('Too Many Requests', 429);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				err,
				stubContext,
			);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBeUndefined();
		});

		it('does not retry query.execute so a 429 cannot replay mutations', async () => {
			const err = new ClickhouseAPIError('Too Many Requests', 429);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err, {
				...stubContext,
				operation: 'query.execute',
			});
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches a 401 ClickhouseAPIError', () => {
			const err = new ClickhouseAPIError('Unauthorized', 401);
			expect(errorHandlers.AUTH_ERROR.match(err, stubContext)).toBe(true);
		});

		it('returns maxRetries=0', async () => {
			const result = await errorHandlers.AUTH_ERROR.handler(
				new ClickhouseAPIError('Unauthorized', 401),
				stubContext,
			);
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('DEFAULT', () => {
		it('matches any error', () => {
			expect(
				errorHandlers.DEFAULT.match(new Error('anything'), stubContext),
			).toBe(true);
		});
		it('returns maxRetries=0', async () => {
			const result = await errorHandlers.DEFAULT.handler(
				new Error('x'),
				stubContext,
			);
			expect(result.maxRetries).toBe(0);
		});
	});
});
