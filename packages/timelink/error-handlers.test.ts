import { ApiError } from 'corsair/http';
import { TimelinkAPIError } from './client';
import { errorHandlers } from './error-handlers';

const makeApiError = (status: number, retryAfter?: number) =>
	new ApiError(
		{ method: 'DELETE', url: 'https://api.timelink.io/api/v1/clients/1' },
		{
			url: 'https://api.timelink.io/api/v1/clients/1',
			ok: false,
			status,
			statusText: '',
			body: undefined,
		},
		status === 429 ? 'Too Many Requests' : 'Unauthorized',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);

describe('Timelink error handlers', () => {
	it('matches rate-limit errors by status on the raw ApiError', async () => {
		const error = makeApiError(429, 2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
		expect(result.headersRetryAfterMs).toBe(2000);
	});

	it('matches rate-limit errors by status on wrapped TimelinkAPIError', async () => {
		const wrapped = new TimelinkAPIError('Too Many Requests', 429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(wrapped);
		expect(result.maxRetries).toBe(0);
	});

	it('does not match non-429 wrapped errors as rate limit', () => {
		const wrapped = new TimelinkAPIError('Unauthorized', 401);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(false);
	});

	it('matches auth errors by status, not only message', async () => {
		const wrapped = new TimelinkAPIError('Forbidden', 401);
		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(wrapped);
		expect(result.maxRetries).toBe(0);
	});

	it('falls back to DEFAULT for unmatched errors', async () => {
		const wrapped = new TimelinkAPIError('Server Error', 500);
		expect(errorHandlers.DEFAULT.match(wrapped)).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(wrapped);
		expect(result.maxRetries).toBe(0);
	});
});
