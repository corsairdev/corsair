import { ApiError } from 'corsair/http';
import { TripadvisorAPIError } from './client';
import { errorHandlers } from './error-handlers';

function rateLimitedCause(): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/locations/123' },
		{
			url: 'https://terra.tripadvisor.com/api/locations/123',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: null,
		},
		'Too Many Requests',
		{ retryAfter: 2500 },
	);
}

describe('Tripadvisor error handlers', () => {
	it('matches 429 failures by status or message', () => {
		const cause = rateLimitedCause();
		const wrapped = new TripadvisorAPIError(cause.message, cause.status, {
			cause,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new TripadvisorAPIError('Too Many Requests', 500),
			),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new TripadvisorAPIError('Not Found', 404),
			),
		).toBe(false);
	});

	it('retries rate limits and forwards Retry-After', async () => {
		const cause = rateLimitedCause();
		const wrapped = new TripadvisorAPIError(cause.message, cause.status, {
			cause,
		});

		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(wrapped),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2500 });
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(
				new TripadvisorAPIError('Too Many Requests', 429),
			),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });
	});

	it('does not retry auth failures', async () => {
		expect(
			errorHandlers.AUTH_ERROR.match(new TripadvisorAPIError('nope', 401)),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(new TripadvisorAPIError('nope', 403)),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(new TripadvisorAPIError('nope', 404)),
		).toBe(false);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('uses the default handler for anything else', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
