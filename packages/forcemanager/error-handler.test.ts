import { ForceManagerAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('ForceManager error handling', () => {
	it('recognizes 429 and carries Retry-After without automatic retries', async () => {
		const error = new ForceManagerAPIError(
			'ForceManager request failed with HTTP 429',
			429,
			4000,
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 4000,
		});
	});

	it.each([401, 403])(
		'does not retry HTTP %i authentication failures',
		async (status) => {
			const error = new ForceManagerAPIError(
				'ForceManager authentication failed',
				status,
			);

			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('handles HTTP 400 as a caller-correctable request error', async () => {
		const error = new ForceManagerAPIError(
			'ForceManager request failed with HTTP 400',
			400,
		);

		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.BAD_REQUEST_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it.each([404, 422, 500, 503])(
		'does not retry undocumented HTTP %i failures',
		async (status) => {
			const error = new ForceManagerAPIError(
				'ForceManager request failed',
				status,
			);

			expect(errorHandlers.DEFAULT.match(error)).toBe(true);
			await expect(errorHandlers.DEFAULT.handler(error)).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('keeps rate-limit matching ahead of the catch-all handler', () => {
		const error = new ForceManagerAPIError(
			'ForceManager request failed with HTTP 429',
			429,
			2000,
		);
		const firstMatchingHandler = Object.entries(errorHandlers).find(
			([, handler]) => handler.match(error),
		)?.[0];

		expect(firstMatchingHandler).toBe('RATE_LIMIT_ERROR');
	});
});
