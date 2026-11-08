import type { CorsairErrorHandler } from 'corsair/core';
import { FinageAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Finage error handlers', () => {
	it('retries rate-limit failures without losing retry metadata', async () => {
		const error = new FinageAPIError(
			'rate_limited: Too many requests',
			429,
			'rate_limited',
			30_000,
		);
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		expect(handler.match(error)).toBe(true);
		await expect(handler.handler(error)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 30_000,
		});
	});

	it('keeps the 429 retry policy when a root DEFAULT wins the merge order', async () => {
		const error = new FinageAPIError(
			'rate_limited: Too many requests',
			429,
			'rate_limited',
			30_000,
		);
		// Core spreads root handlers before plugin handlers, so a root DEFAULT
		// keeps its insertion position ahead of the plugin's specific handlers.
		const rootHandlers: CorsairErrorHandler = {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 0 }),
			},
		};
		const merged: CorsairErrorHandler = { ...rootHandlers, ...errorHandlers };
		const context = {
			pluginId: 'finage',
			operation: 'market.getStockLastQuote',
			input: {},
			originalError: error,
		};

		const selected = Object.keys(merged).find((name) =>
			merged[name]?.match(error, context),
		);

		expect(selected).toBe('DEFAULT');
		await expect(merged.DEFAULT?.handler(error, context)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 30_000,
		});
		await expect(
			merged.DEFAULT?.handler(new Error('boom'), context),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry authentication failures', async () => {
		const error = new FinageAPIError('Unauthorized', 401);
		const handler = errorHandlers.AUTH_ERROR;

		expect(handler.match(error)).toBe(true);
		await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not classify unrelated failures as rate limits', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429 text'))).toBe(
			false,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('Unauthorized'))).toBe(
			false,
		);
	});
});
