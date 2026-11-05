import { VaquillAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('RATE_LIMIT_ERROR handler', () => {
	it('caps the replay at the promised five attempts', async () => {
		const error = new VaquillAPIError('rate_limited', undefined, 429, '7000');
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		// One initial execution plus these retries must stay at five.
		expect(strategy.maxRetries).toBe(4);
		expect(strategy.headersRetryAfterMs).toBe(7000);
	});
});
