import { errorHandlers } from '../error-handlers';
import { mockApiError } from './utils';

describe('tally errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		it('matches ApiError 429', () => {
			expect(handler.match(mockApiError(429, 'slow down', 5000))).toBe(true);
		});

		it('matches message containing rate', () => {
			expect(handler.match(new Error('Rate limited'))).toBe(true);
		});

		it('handler returns retry config with retryAfterMs', async () => {
			const err = mockApiError(429, 'rl', 12_000);
			const res = await handler.handler(err);
			expect(res.maxRetries).toBe(5);
			expect(res.headersRetryAfterMs).toBe(12_000);
		});
	});

	describe('AUTH_ERROR', () => {
		const handler = errorHandlers.AUTH_ERROR;

		it('matches ApiError 401', () => {
			expect(handler.match(mockApiError(401, 'nope'))).toBe(true);
		});

		it('matches unauthorized message', () => {
			expect(handler.match(new Error('Unauthorized'))).toBe(true);
		});

		it('handler returns maxRetries 0', async () => {
			const res = await handler.handler();
			expect(res.maxRetries).toBe(0);
		});
	});

	describe('DEFAULT', () => {
		it('matches unconditionally', () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
		});

		it('handler returns maxRetries 0', async () => {
			const res = await errorHandlers.DEFAULT.handler();
			expect(res.maxRetries).toBe(0);
		});
	});
});
