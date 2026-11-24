import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { metabase } from './index';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/metabase' },
		{
			url: '/api/metabase',
			ok: false,
			status,
			statusText: `HTTP ${status}`,
			body: {},
		},
		`Metabase returned HTTP ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function matchedHandler(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!match) throw new Error('No Metabase error handler matched');
	return match[0];
}

describe('Metabase error handling', () => {
	it('routes rate limits once after transport retries while retaining Retry-After', async () => {
		const error = apiError(429, 1200);
		expect(matchedHandler(error)).toBe('RATE_LIMIT_ERROR');
		expect(error.retryAfter).toBe(1200);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes authentication, permission, missing-route, and invalid-request statuses', async () => {
		expect(matchedHandler(apiError(401))).toBe('AUTH_ERROR');
		expect(matchedHandler(apiError(403))).toBe('AUTH_ERROR');
		expect(matchedHandler(apiError(404))).toBe('NOT_FOUND_ERROR');
		expect(matchedHandler(apiError(400))).toBe('BAD_REQUEST_ERROR');
		expect(matchedHandler(apiError(422))).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry server errors and leaves DEFAULT as the last handler', async () => {
		const error = apiError(503);
		expect(matchedHandler(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		const plugin = metabase({ baseUrl: 'https://metabase.test' });
		expect(Object.keys(plugin.errorHandlers ?? {}).at(-1)).toBe('DEFAULT');
	});
});
