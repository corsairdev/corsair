import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function createApiError(status: number, message: string): ApiError {
	return new ApiError(
		{
			method: 'GET',
			url: '/test',
		},
		{
			url: 'https://example.com/test',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
		status === 429 ? { retryAfter: 1500 } : undefined,
	);
}

describe('snapchat error handlers', () => {
	it('does not classify non-429 errors as rate-limit based on message text', () => {
		const non429RateTextError = createApiError(500, 'upstream rate exceeded');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(non429RateTextError)).toBe(
			false,
		);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('classifies 429 errors as rate-limit and preserves retryAfter', async () => {
		const rateLimitError = createApiError(429, 'Too Many Requests');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError)).toBe(true);

		const handled =
			await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimitError);
		expect(handled).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});
});
