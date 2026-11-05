import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{ url: '/test', ok: false, status, statusText: 'Error', body: {} },
		`request failed with status ${status}`,
	);
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR', async () => {
		const error = apiError(429);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: undefined,
		});
	});

	it('classifies a 401 as AUTH_ERROR and does not retry', async () => {
		const error = apiError(401);
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
