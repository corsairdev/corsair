import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/carriers' },
		{
			url: 'https://api.shipengine.com/v1/carriers',
			ok: false,
			status,
			statusText: 'Provider response',
			body: undefined,
		},
		`HTTP ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('ShipEngine error handlers', () => {
	it('matches 429 and leaves retries to the transport that honors Retry-After', async () => {
		const error = apiError(429, 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches both unauthorized and forbidden responses without retrying', async () => {
		for (const status of [401, 403]) {
			const error = apiError(status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not classify ordinary provider errors as rate limits or auth errors', async () => {
		const error = apiError(422);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
