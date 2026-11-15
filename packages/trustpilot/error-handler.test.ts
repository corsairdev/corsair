import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function rateLimitError(retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/reviews/latest' },
		{
			url: 'https://api.trustpilot.com/v1/reviews/latest',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: undefined,
		},
		'Trustpilot request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Trustpilot error handlers', () => {
	it('matches 429 and leaves retries to the handler using Retry-After', async () => {
		const error = rateLimitError(2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(error, {
				pluginId: 'trustpilot',
				operation: 'reviews.get',
				input: {},
				originalError: error,
			}),
		).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2500,
		});
	});

	it('does not replay invitation-link writes after a 429', async () => {
		const error = rateLimitError(2500);
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(error, {
				pluginId: 'trustpilot',
				operation: 'invitations.link',
				input: {},
				originalError: error,
			}),
		).toEqual({ maxRetries: 0, headersRetryAfterMs: 2500 });
	});

	it('matches auth errors without retrying', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/reviews/latest' },
			{
				url: 'https://api.trustpilot.com/v1/reviews/latest',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: undefined,
			},
			'Trustpilot request failed',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({ maxRetries: 0 });
	});

	it('does not retry unrelated errors and keeps the default handler last', async () => {
		const error = new Error('Bad request');
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		expect(await errorHandlers.DEFAULT.handler()).toEqual({ maxRetries: 0 });
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError())).toBe(true);
	});

	it('recognizes provider 429 text when no ApiError instance is available', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('HTTP 429'))).toBe(
			true,
		);
	});
});
