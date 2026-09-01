import { ApiError } from 'corsair/http';
import { ByteFormsAPIError } from './client';
import { errorHandlers } from './error-handlers';

const makeApiError = (status: number, retryAfter?: number) =>
	new ApiError(
		{ method: 'GET', url: 'https://example.test' },
		{
			url: 'https://example.test',
			ok: false,
			status,
			statusText: '',
			body: undefined,
		},
		status === 429 ? 'Too Many Requests' : 'Unauthorized',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);

describe('ByteForms error handlers', () => {
	it('matches wrapped rate-limit errors by status, not message', async () => {
		const wrapped = new ByteFormsAPIError('Too Many Requests', '429', {
			cause: makeApiError(429, 2000),
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(wrapped);
		expect(result.maxRetries).toBe(0);
		expect(
			(result as { headersRetryAfterMs?: number }).headersRetryAfterMs,
		).toBe(2000);
	});

	it('matches wrapped auth errors and never retries them', async () => {
		const wrapped = new ByteFormsAPIError('Unauthorized', '401', {
			cause: makeApiError(401),
		});

		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(true);

		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('does not treat a 500 as a rate limit just because the message mentions 429', () => {
		const wrapped = new ByteFormsAPIError('upstream 429', '500', {
			cause: makeApiError(500),
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(false);
	});

	it('does not treat a 500 as auth failure just because the message mentions unauthorized', () => {
		const wrapped = new ByteFormsAPIError('unauthorized backend', '500', {
			cause: makeApiError(500),
		});
		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(false);
	});
});
