import { DocmosisAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Docmosis error handlers', () => {
	it('treats the 400 "Invalid accessKey" response as an auth error', async () => {
		const error = new DocmosisAPIError('Invalid accessKey', 400);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('retries 429 responses with the provider retry delay', async () => {
		const error = new DocmosisAPIError('Too Many Requests', 429, {
			retryAfter: 3000,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});
});
