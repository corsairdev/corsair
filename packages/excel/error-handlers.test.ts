import type { ErrorContext } from 'corsair/core';
import { ExcelAPIError } from './client';
import { cooldownMs, errorHandlers } from './error-handlers';
import { excel } from './index';

function context(operation: string, error: Error): ErrorContext {
	return {
		pluginId: 'excel',
		operation,
		input: {},
		originalError: error,
	};
}

function firstMatch(error: Error, operation: string) {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler?.match(error, context(operation, error))) {
			return { name, handler };
		}
	}
	throw new Error('no handler matched');
}

function graphError(options: {
	status?: number;
	code?: string;
	innerCode?: string;
	message?: string;
	retryAfter?: number;
}) {
	return new ExcelAPIError(options.message ?? 'failed', {
		status: options.status,
		code: options.code,
		innerCode: options.innerCode,
		retryAfter: options.retryAfter,
	});
}

describe('excel error handlers', () => {
	it('checks conflicts before rate limits', () => {
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('CONFLICT_ERROR')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
		expect(names.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			names.indexOf('GATEWAY_TIMEOUT_ERROR'),
		);
		expect(names.indexOf('GATEWAY_TIMEOUT_ERROR')).toBeLessThan(
			names.indexOf('SERVER_ERROR'),
		);
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('does not retry a 429 that is also an access conflict', async () => {
		const error = graphError({
			status: 429,
			code: 'TooManyRequests',
			innerCode: 'accessConflict',
		});
		const matched = firstMatch(error, 'ranges.update');
		expect(matched.name).toBe('CONFLICT_ERROR');
		await expect(
			matched.handler.handler(error, context('ranges.update', error)),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('caps an hour-long Retry-After at 60 seconds plus jitter', () => {
		expect(cooldownMs(3_600_000)).toBeGreaterThanOrEqual(60_000);
		expect(cooldownMs(3_600_000)).toBeLessThanOrEqual(60_250);
	});

	it('retries a plain 429 up to 4 attempts', async () => {
		const error = graphError({
			status: 429,
			code: 'TooManyRequests',
			retryAfter: 10_000,
		});
		const matched = firstMatch(error, 'ranges.get');
		expect(matched.name).toBe('RATE_LIMIT_ERROR');
		const strategy = await matched.handler.handler(
			error,
			context('ranges.get', error),
		);
		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBeGreaterThanOrEqual(10_000);
		expect(strategy.headersRetryAfterMs).toBeLessThanOrEqual(10_250);
	});

	it('retries 504 only for the operations Graph says to repeat', async () => {
		const error = graphError({ status: 504, code: 'GatewayTimeout' });
		const replay = firstMatch(error, 'sessions.create');
		expect(replay.name).toBe('GATEWAY_TIMEOUT_ERROR');
		await expect(
			replay.handler.handler(error, context('sessions.create', error)),
		).resolves.toMatchObject({ maxRetries: 2 });

		const read = firstMatch(error, 'worksheets.list');
		expect(read.name).toBe('SERVER_ERROR');
		await expect(
			read.handler.handler(error, context('worksheets.list', error)),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not treat a 500 message that mentions rate limits as a retry', async () => {
		const error = new ExcelAPIError('Too many requests', { status: 500 });
		const matched = firstMatch(error, 'tables.addRows');
		expect(matched.name).toBe('SERVER_ERROR');
		await expect(
			matched.handler.handler(error, context('tables.addRows', error)),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('fails fast on auth and not found', async () => {
		const missing = graphError({ status: 404, code: 'ItemNotFound' });
		expect(firstMatch(missing, 'worksheets.get').name).toBe('NOT_FOUND_ERROR');
		const unauthorized = graphError({ status: 401, code: 'Unauthorized' });
		const matched = firstMatch(unauthorized, 'worksheets.get');
		expect(matched.name).toBe('AUTH_ERROR');
		await expect(
			matched.handler.handler(
				unauthorized,
				context('worksheets.get', unauthorized),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('keeps a caller handler ahead of the catch-all', () => {
		const plugin = excel({
			errorHandlers: {
				CUSTOM_LATE: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys.indexOf('CUSTOM_LATE')).toBeGreaterThan(-1);
		expect(keys.indexOf('CUSTOM_LATE')).toBeLessThan(keys.indexOf('DEFAULT'));
		expect(keys.at(-1)).toBe('DEFAULT');
	});
});
