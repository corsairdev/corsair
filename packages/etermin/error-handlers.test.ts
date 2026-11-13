import { ETerminAPIError } from './client';
import { errorHandlers } from './error-handlers';

function providerError(status: number, retryAfter?: number): ETerminAPIError {
	const error = new ETerminAPIError(`HTTP ${status}`);
	Object.assign(error, { status, retryAfter });
	return error;
}

describe('eTermin error handlers', () => {
	it('classifies authentication and validation failures without retries', async () => {
		for (const status of [400, 401, 403, 422]) {
			const error = providerError(status);
			const handler =
				status === 400 || status === 422
					? errorHandlers.VALIDATION_ERROR
					: errorHandlers.AUTH_ERROR;
			expect(handler.match(error)).toBe(true);
			expect(await handler.handler()).toEqual({ maxRetries: 0 });
		}
	});

	it('preserves Retry-After information for a wrapped 429 response', async () => {
		const error = providerError(429, 1_500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 1_500,
		});
	});

	it('classifies server failures separately from the default handler', () => {
		expect(errorHandlers.SERVER_ERROR.match(providerError(503))).toBe(true);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
