import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function providerError(status: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/api/v1/General/AITranslateText' },
		{
			url: 'https://api.apps-encodian.com/api/v1/General/AITranslateText',
			ok: false,
			status,
			statusText: 'Provider response',
			body: { message: 'redacted by client' },
		},
		`HTTP ${status}`,
		{ retryAfter: status === 429 ? 2500 : undefined },
	);
}

describe('Encodian error handler routing', () => {
	it('matches 429 first and exposes Retry-After without automatic retries', async () => {
		const error = providerError(429);
		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR?.handler(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});

	it.each([401, 403])(
		'stops retrying an HTTP %i authentication failure',
		async (status) => {
			const error = providerError(status);
			expect(errorHandlers.AUTH_ERROR?.match(error)).toBe(true);
			expect(await errorHandlers.AUTH_ERROR?.handler()).toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each([400, 422])(
		'classifies HTTP %i as a request validation error',
		(status) => {
			const error = providerError(status);
			expect(errorHandlers.VALIDATION_ERROR?.match(error)).toBe(true);
		},
	);

	it('classifies missing routes and provider failures without retrying', async () => {
		const notFound = providerError(404);
		const serverFailure = providerError(503);
		expect(errorHandlers.NOT_FOUND_ERROR?.match(notFound)).toBe(true);
		expect(errorHandlers.SERVER_ERROR?.match(serverFailure)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR?.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
