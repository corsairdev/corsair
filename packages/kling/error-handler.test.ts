import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

// Application-level error codes are documented at
// https://kling.ai/document-api/api/get-started/error-codes
// Builds a synthetic ApiError; `body` is `unknown`-valued because it carries
// the raw (unmodelled) JSON error payload Kling returns.
function apiError(
	status: number,
	message: string,
	body: Record<string, unknown> = {},
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'POST', url: '/tasks' },
		{
			url: 'https://api-singapore.klingai.com/tasks',
			ok: false,
			status,
			statusText: message,
			body,
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

describe('Kling errorHandlers', () => {
	it('routes account 429 codes 1100-1102 to ACCOUNT_ERROR with no retries', async () => {
		expect(route(apiError(429, 'Account status', { code: 1100 }))).toBe(
			'ACCOUNT_ERROR',
		);
		expect(route(apiError(429, 'Account in arrears', { code: 1101 }))).toBe(
			'ACCOUNT_ERROR',
		);
		expect(
			route(apiError(429, 'Resource pack exhausted', { code: 1102 })),
		).toBe('ACCOUNT_ERROR');
		await expect(errorHandlers.ACCOUNT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes transient 429s to RATE_LIMIT_ERROR and respects retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', { code: 1302 }, 1500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not treat a message merely containing 429 as a rate limit', async () => {
		// Regression: the bare `msg.includes('429')` fallback used to match any
		// message containing those digits (an ID, URL or count), misrouting a
		// non-retryable failure into the retrying RATE_LIMIT_ERROR handler and
		// queueing duplicate work.
		const error = apiError(500, 'task 429 was aborted');

		expect(route(error)).not.toBe('RATE_LIMIT_ERROR');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('still routes a real ApiError with status 429 to RATE_LIMIT_ERROR', () => {
		// The numeric status guard, not the message, must keep driving this
		// decision.
		expect(route(apiError(429, 'Slow down'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes text-only account and rate-limit messages', () => {
		expect(route(new Error('account is in arrears'))).toBe('ACCOUNT_ERROR');
		expect(route(new Error('too many requests, retry later'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('routes 401 and 403 to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Authentication failed', { code: 1001 }))).toBe(
			'AUTH_ERROR',
		);
		expect(route(apiError(403, 'Forbidden', { code: 1103 }))).toBe(
			'AUTH_ERROR',
		);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400, 404 and 422 to BAD_REQUEST_ERROR', async () => {
		expect(route(apiError(400, 'Bad Request', { code: 1200 }))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(route(apiError(404, 'Not Found', { code: 1203 }))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes server errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error', { code: 5000 });

		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
