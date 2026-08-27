import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'request failed') {
	return new ApiError(
		{ method: 'GET', url: 'https://rw.vestaboard.com' },
		{
			url: 'https://rw.vestaboard.com',
			ok: false,
			status,
			statusText: '',
			body: { error: message },
		},
		message,
	);
}

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('Vestaboard Error Handlers Tests', () => {
	it('classifies 429 as rate limit', () => {
		expect(classify(apiError(429, 'Rate limited'))).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies 401 as auth error', () => {
		expect(classify(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
	});

	it('classifies 403 as permission error', () => {
		expect(classify(apiError(403, 'Forbidden'))).toBe('PERMISSION_ERROR');
	});

	it('classifies 404 as not found', () => {
		expect(classify(apiError(404, 'Not found'))).toBe('NOT_FOUND_ERROR');
	});

	it('falls back to default handler for unknown errors', () => {
		expect(classify(new Error('Unknown failure'))).toBe('DEFAULT');
	});

	it('does not retry auth failures', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('retries rate limits with retryAfter', async () => {
		const err = apiError(429);
		(err as { retryAfter?: number }).retryAfter = 1500;
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result.maxRetries).toBe(3);
		expect(result.headersRetryAfterMs).toBe(1500);
	});
});
