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
		expect(result.maxRetries).toBeGreaterThan(0);
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
});
