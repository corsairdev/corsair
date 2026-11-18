import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/search' },
		{
			url: 'https://api.octen.ai/search',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Octen errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and honours retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes text rate limit errors when the status is absent', () => {
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('rate limit exceeded'))).toBe('RATE_LIMIT_ERROR');
	});

	it('does not treat a message that merely contains 429 as a rate limit', () => {
		// An id, URL or task number can contain the digits "429"; matching on
		// them used to send unrelated, non-throttled failures down the retrying
		// path. Only a real 429 status or a genuine throttle phrase may.
		expect(route(apiError(500, 'task 429 was aborted'))).toBe('DEFAULT');
		expect(route(new Error('batch 429 finished'))).toBe('DEFAULT');
	});

	it('still matches a real ApiError carrying status 429', () => {
		// Envelope errors copy a non-zero `code` into `status`, so this is the
		// path that must keep routing throttling to RATE_LIMIT_ERROR.
		expect(route(apiError(429, 'request rejected'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		// Octen documents 403 as an exhausted account balance; it is still
		// terminal, so it stops here rather than retrying.
		expect(route(apiError(403, 'Insufficient account balance'))).toBe(
			'AUTH_ERROR',
		);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes an insufficient-balance message to AUTH_ERROR', () => {
		expect(route(new Error('insufficient balance'))).toBe('AUTH_ERROR');
	});

	it('does not treat a message that merely contains insufficient as auth', () => {
		// Only the documented "insufficient balance" phrase is terminal auth; a
		// bare "insufficient" can appear in unrelated, non-auth messages.
		expect(route(new Error('insufficient quota for export'))).toBe('DEFAULT');
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Missing parameter query'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
