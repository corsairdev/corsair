import { ApiError } from 'corsair/http';
import { RootlyAPIError } from './client';
import { errorHandlers } from './error-handlers';

function rootlyErrorWithStatus(
	status: number,
	retryAfter?: number,
): RootlyAPIError {
	const cause = new ApiError(
		{ method: 'GET', url: 'test' },
		{
			url: 'https://api.rootly.com/v1/test',
			status,
			statusText: status === 429 ? 'Too Many Requests' : 'Unauthorized',
			body: {},
			ok: false,
		},
		status === 429 ? 'Rate limited' : 'Unauthorized',
		retryAfter ? { retryAfter } : undefined,
	);
	return new RootlyAPIError(cause.message, status, { cause });
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('No error handler matched');
	return name;
}

describe('Rootly errorHandlers', () => {
	it('matches 429 RootlyAPIError as RATE_LIMIT_ERROR and extracts headersRetryAfterMs', async () => {
		const error = rootlyErrorWithStatus(429, 3000);

		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');

		const policy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(policy.maxRetries).toBe(5);
		expect(policy.headersRetryAfterMs).toBe(3000);
	});

	it('matches 401 RootlyAPIError as AUTH_ERROR with 0 retries', async () => {
		const error = rootlyErrorWithStatus(401);

		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');

		const policy = await errorHandlers.AUTH_ERROR.handler();
		expect(policy.maxRetries).toBe(0);
	});

	it('matches generic error as DEFAULT with 0 retries', async () => {
		const error = new Error('Something unexpected happened');

		expect(matchedHandlerName(error)).toBe('DEFAULT');

		const policy = await errorHandlers.DEFAULT.handler();
		expect(policy.maxRetries).toBe(0);
	});
});
