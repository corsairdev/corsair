import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/ai-content-detection' },
		{
			url: 'https://api.gowinston.ai/v2/ai-content-detection',
			ok: false,
			status,
			statusText: `Status ${status}`,
			body: { error: `status ${status}` },
		},
		`Winston AI request failed with ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Winstonai error handlers', () => {
	it('retries 429 and keeps Retry-After', async () => {
		const error = apiError(429, 1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not retry 401', async () => {
		const error = apiError(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry 402 insufficient credits', async () => {
		const error = apiError(402);
		expect(errorHandlers.PAYMENT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.PAYMENT_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry 403 inaccessible sources', async () => {
		const error = apiError(403);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.PERMISSION_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry 400 or 415', async () => {
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(400))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(415))).toBe(true);
		await expect(
			errorHandlers.BAD_REQUEST_ERROR.handler(apiError(400)),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries 5xx with backoff', async () => {
		const error = apiError(503);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});
});
