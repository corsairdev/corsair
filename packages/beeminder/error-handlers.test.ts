import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number) {
	return new ApiError(
		{ method: 'GET', url: 'users/me.json' },
		{
			url: 'https://www.beeminder.com/api/v1/users/me.json',
			ok: false,
			status,
			statusText: '',
			body: { errors: 'fail' },
		},
		'request failed',
	);
}

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('Beeminder error handlers', () => {
	it('classifies 429 as rate limit', () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies 401 as auth', () => {
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
	});

	it('classifies 403 as permission', () => {
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
	});

	it('classifies 404 as not found', () => {
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry auth failures', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('retries rate limits', async () => {
		const err = apiError(429);
		(err as { retryAfter?: number }).retryAfter = 2000;
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(2000);
	});
});
