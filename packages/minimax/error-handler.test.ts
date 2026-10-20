import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

// MiniMax answers many endpoints with HTTP 200 plus a non-zero
// `base_resp.status_code`; the request client turns those into a plain Error
// whose message is the provider `status_msg` (see the error-code reference at
// https://platform.minimax.io/docs/api-reference/errorcode).
function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v1/text/chatcompletion_v2' },
		{
			url: 'https://api.minimax.io/v1/text/chatcompletion_v2',
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

describe('Minimax errorHandlers', () => {
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

	it('retries transient rate limits reported through the 200 envelope', async () => {
		// base_resp.status_code 1002 "rate limit" is delivered as HTTP 200.
		const error = new Error('rate limit triggered, please try again later');
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
		});
	});

	it('treats token and connection limits as transient', () => {
		expect(route(new Error('token limit reached'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('conn limit exceeded'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes balance exhaustion to INSUFFICIENT_CREDITS_ERROR with no retries', async () => {
		const error = new Error('insufficient balance');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes usage limit exhaustion to INSUFFICIENT_CREDITS_ERROR', () => {
		expect(route(new Error('usage limit exceeded'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes envelope auth failures to AUTH_ERROR', () => {
		expect(route(new Error('invalid api key'))).toBe('AUTH_ERROR');
		expect(route(new Error('not authorized'))).toBe('AUTH_ERROR');
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes envelope invalid-params failures to BAD_REQUEST_ERROR', () => {
		expect(route(new Error('invalid params, please check your request'))).toBe(
			'BAD_REQUEST_ERROR',
		);
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
