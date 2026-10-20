import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v1/ai-talking-photo' },
		{
			url: 'https://api.magichour.ai/v1/ai-talking-photo',
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

describe('Magic Hour errorHandlers', () => {
	it('routes 402 to INSUFFICIENT_CREDITS_ERROR with no retries', async () => {
		const error = apiError(402, 'Payment Required');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes insufficient-credit and subscription errors by message', async () => {
		expect(route(new Error('insufficient credits for this render'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		expect(route(new Error('insufficient_credits'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		expect(route(new Error('subscription_required'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		expect(route(new Error('plan_upgrade_required'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes 429 to RATE_LIMIT_ERROR and respects retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('leaves headersRetryAfterMs undefined when retryAfter is absent', async () => {
		const error = apiError(429, 'Too Many Requests');
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
		});
	});

	it('still matches a real 429 ApiError', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many Requests')),
		).toBe(true);
	});

	it('does not treat a message merely containing the digits 429 as rate limiting', async () => {
		const error = apiError(500, 'task 429 was aborted');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 401 and 403 to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid api key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown errors (e.g. 500) to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('prefers the credit handler over the rate-limit handler for 402', () => {
		expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(apiError(402, 'x')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(402, 'x'))).toBe(
			false,
		);
	});
});
