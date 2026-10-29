import { GoogleAddressValidationAPIError } from './client';
import { errorHandlers } from './error-handlers';

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('errorHandlers', () => {
	it('retries 429 using preserved retryAfter', async () => {
		const error = new GoogleAddressValidationAPIError('rate limited', '429', {
			status: 429,
			retryAfter: 1500,
		});

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not retry 403', async () => {
		const error = new GoogleAddressValidationAPIError('forbidden', '403', {
			status: 403,
		});

		expect(route(error)).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('falls back to DEFAULT for errors with no status or known message', async () => {
		const error = new Error('socket hang up');

		expect(route(error)).toBe('DEFAULT');
		expect(await errorHandlers.DEFAULT.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
