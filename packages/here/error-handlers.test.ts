import { ApiError } from 'corsair/http';
import { HereAPIError } from './client';
import { errorHandlers } from './error-handlers';

const request = {
	method: 'GET',
	url: 'https://geocode.search.hereapi.com/v1/geocode',
} as any;

describe('HERE error handlers', () => {
	it('retries wrapped 429 errors and keeps Retry-After', async () => {
		const cause = new ApiError(
			request,
			{
				url: request.url,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: null,
			} as any,
			'Too Many Requests',
			{ retryAfter: 2500 },
		);
		const error = new HereAPIError(cause.message, 429, undefined, 2500);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2500,
		});
	});

	it('does not retry 401 or 403', async () => {
		expect(errorHandlers.AUTH_ERROR.match(new HereAPIError('nope', 401))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new HereAPIError('nope', 403))).toBe(
			true,
		);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('uses the default handler for unknown errors', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
