import { ApiBibleAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('apibible error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches a 429 and defers retries to the transport rate-limit budget', async () => {
			const error = new ApiBibleAPIError('429 Too Many Requests');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
				maxRetries: 0,
			});
		});

		it('does not match unrelated errors', () => {
			expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('nope'))).toBe(
				false,
			);
		});
	});

	describe('SERVER_ERROR', () => {
		it('matches a 500 and does not add a second binder retry layer', async () => {
			const error = new ApiBibleAPIError('500 internal server error');
			expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
			expect(await errorHandlers.SERVER_ERROR.handler(error)).toEqual({
				maxRetries: 0,
			});
		});

		it('does not match client errors', () => {
			expect(
				errorHandlers.SERVER_ERROR.match(new ApiBibleAPIError('404')),
			).toBe(false);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches a 401', () => {
			expect(errorHandlers.AUTH_ERROR.match(new ApiBibleAPIError('401'))).toBe(
				true,
			);
		});
	});
});
