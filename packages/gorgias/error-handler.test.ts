import { ApiError } from 'corsair/http';
import { GorgiasAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/account' },
		{
			url: 'https://acme-helpdesk.gorgias.com/api/account',
			ok: false,
			status,
			statusText: 'Provider response',
			body: { message: 'redacted by client' },
		},
		'Gorgias request failed',
		{ retryAfter },
	);
}

describe('Gorgias error handling', () => {
	it('recognizes 429 responses and does not add endpoint-level retries', async () => {
		const error = apiError(429, 4000);
		const rateLimit = errorHandlers.RATE_LIMIT_ERROR;
		expect(rateLimit?.match(error)).toBe(true);
		await expect(rateLimit?.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(4000);
	});

	it('recognizes binary-transport 429 and authentication errors', async () => {
		const rateLimit = errorHandlers.RATE_LIMIT_ERROR;
		const auth = errorHandlers.AUTH_ERROR;
		expect(
			rateLimit?.match(
				new GorgiasAPIError('Gorgias request failed.', 429, 5000),
			),
		).toBe(true);
		expect(auth?.match(apiError(401))).toBe(true);
		expect(auth?.match(apiError(403))).toBe(true);
		expect(auth?.match(apiError(404))).toBe(false);
	});

	it('keeps the catch-all handler last and disables unsafe write retries', async () => {
		const names = Object.keys(errorHandlers);
		expect(names.at(-1)).toBe('DEFAULT');
		const fallback = errorHandlers.DEFAULT;
		expect(fallback?.match()).toBe(true);
		await expect(fallback?.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
