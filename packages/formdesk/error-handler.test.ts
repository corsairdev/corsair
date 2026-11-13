import { FormdeskAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Formdesk error handlers', () => {
	it('keeps rate limits and authorization/not-found handlers before DEFAULT', () => {
		expect(Object.keys(errorHandlers)).toEqual([
			'RATE_LIMIT_ERROR',
			'AUTH_ERROR',
			'NOT_FOUND_ERROR',
			'TIMEOUT_ERROR',
			'NETWORK_ERROR',
			'DEFAULT',
		]);
	});

	it('retries safe GET rate limits using Retry-After', async () => {
		const error = new FormdeskAPIError('Rate limited', 429, 2500, true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2500,
		});
	});

	it('does not retry non-idempotent operations after 429', async () => {
		const error = new FormdeskAPIError('Rate limited', 429, 2500, false);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});

	it.each([401, 403])(
		'does not retry HTTP %i authorization failures',
		async (status) => {
			const error = new FormdeskAPIError('Unauthorized', status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('handles 404 without retries', async () => {
		const error = new FormdeskAPIError('Not found', 404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('maps timeouts and network failures without retrying them', async () => {
		const timeout = new FormdeskAPIError(
			'Timed out',
			undefined,
			undefined,
			true,
			'TIMEOUT',
		);
		const network = new FormdeskAPIError(
			'Network failure',
			undefined,
			undefined,
			true,
			'NETWORK_ERROR',
		);
		expect(errorHandlers.TIMEOUT_ERROR.match(timeout)).toBe(true);
		expect(errorHandlers.NETWORK_ERROR.match(network)).toBe(true);
		await expect(errorHandlers.TIMEOUT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.NETWORK_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry server or unknown failures by default', async () => {
		const serverError = new FormdeskAPIError(
			'Server failure',
			503,
			undefined,
			true,
		);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
