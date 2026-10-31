import { DnsfilterAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('DNSFilter error handlers', () => {
	it('matches 429 responses and honours Retry-After', async () => {
		const error = new DnsfilterAPIError('Too Many Requests', 429, 'rate', 2000);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('does not retry auth, not-found and validation failures', async () => {
		const auth = new DnsfilterAPIError('Unauthorized', 401);
		const forbidden = new DnsfilterAPIError('Forbidden', 403);
		const missing = new DnsfilterAPIError('Not Found', 404);
		const invalid = new DnsfilterAPIError('Unprocessable Entity', 422);

		expect(errorHandlers.AUTH_ERROR.match(auth)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(missing)).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(invalid)).toBe(true);

		for (const error of [auth, forbidden, missing, invalid]) {
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		}
	});

	it('falls back to the default handler for unknown failures', () => {
		const error = new Error('socket hang up');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
