import { ApiError } from 'corsair/http';
import { WakaTimeAPIError } from './client';
import { errorHandlers } from './error-handlers';

function wrappedRateLimitError(): WakaTimeAPIError {
	const original = new ApiError(
		{ method: 'GET', url: 'users/current' },
		{
			url: 'https://api.wakatime.com/api/v1/users/current',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: { error: 'rate limited' },
		},
		'WakaTime request failed',
		{ retryAfter: 12 },
	);

	return new WakaTimeAPIError(original.message, original.status, {
		cause: original,
	});
}

describe('WakaTime error handlers', () => {
	it('recognizes wrapped rate-limit errors and preserves retry delay', async () => {
		const error = wrappedRateLimitError();
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		expect(handler?.match(error)).toBe(true);
		await expect(handler?.handler(error)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 12,
		});
	});
});
