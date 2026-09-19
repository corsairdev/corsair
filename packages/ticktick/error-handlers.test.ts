import { TickTickAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('TickTick error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches typed 429 errors and forwards the provider Retry-After', async () => {
			const error = new TickTickAPIError(
				'[429] Too Many Requests',
				'429',
				2500,
			);

			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(error),
			).resolves.toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 2500,
			});
		});

		it('does not classify unrelated errors that merely contain "429" in their message', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(
					new TickTickAPIError('[400] Title exceeds limit 4295', '400'),
				),
			).toBe(false);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('task-429 failed')),
			).toBe(false);
		});

		it('forwards an undefined Retry-After when the provider did not send one', async () => {
			const error = new TickTickAPIError('[429] Too Many Requests', '429');

			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(error),
			).resolves.toEqual({
				maxRetries: 5,
				headersRetryAfterMs: undefined,
			});
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches typed 401 errors with no retries', async () => {
			const error = new TickTickAPIError('[401] Unauthorized', '401');

			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('does not match other statuses', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(
					new TickTickAPIError('[403] forbidden', '403'),
				),
			).toBe(false);
		});
	});

	describe('DEFAULT', () => {
		it('catches everything else without retries', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});
});
