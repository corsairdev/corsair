import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'request failed') {
	return new ApiError(
		{ method: 'GET', url: 'storage/storages' },
		{
			url: 'https://api.claid.ai/v1/storage/storages',
			ok: false,
			status,
			statusText: '',
			body: { error_message: message },
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

describe('Claid.ai error handlers', () => {
	it('classifies 429 as rate limit', () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies 401 as auth', () => {
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
	});

	it('classifies 403 as auth', () => {
		expect(classify(apiError(403))).toBe('AUTH_ERROR');
	});

	it('classifies 404 as not found', () => {
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
	});

	it('does not treat a 400 mentioning 429 as rate limit', () => {
		expect(classify(apiError(400, 'error 4290 in field'))).not.toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(apiError(400, 'error 4290 in field'))).toBe('DEFAULT');
	});

	it('matches rate_limited message errors', () => {
		expect(classify(new Error('rate_limited: slow down'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('matches unauthorized message errors', () => {
		expect(classify(new Error('unauthorized'))).toBe('AUTH_ERROR');
	});

	it('matches storage not found message errors', () => {
		expect(classify(new Error('Storage not found'))).toBe('NOT_FOUND_ERROR');
	});

	it('retries rate limits with Retry-After metadata', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'image/edit' },
			{
				url: 'https://api.claid.ai/v1/image/edit',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 1000 },
		);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(1000);
	});

	it('does not retry auth or not-found failures', async () => {
		const auth = await errorHandlers.AUTH_ERROR.handler();
		expect(auth.maxRetries).toBe(0);
		const notFound = await errorHandlers.NOT_FOUND_ERROR.handler();
		expect(notFound.maxRetries).toBe(0);
	});
});
