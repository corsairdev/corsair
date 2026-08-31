/**
 * Error-policy coverage. Real `PushbulletAPIError` objects are built (wrapped
 * around a real `ApiError`) rather than plain `Error`s, so the status, method
 * and retry metadata the handlers rely on are the ones produced by the client.
 */

import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';

import { PushbulletAPIError } from './client';
import { errorHandlers } from './error-handlers';

const BASE_REQUEST: ApiRequestOptions = {
	method: 'GET',
	url: 'pushes',
	mediaType: undefined,
};

const BASE_RESULT: ApiResult = {
	url: 'https://api.pushbullet.com/v2/pushes',
	ok: false,
	status: 500,
	statusText: 'Internal Server Error',
	body: {},
};

function makeError(options: {
	status?: number;
	retryAfter?: number;
	method?: string;
	message?: string;
}): PushbulletAPIError {
	const {
		status = 500,
		retryAfter,
		method = 'GET',
		message = 'request failed',
	} = options;
	const cause = new ApiError(
		{ ...BASE_REQUEST, method: method as ApiRequestOptions['method'] },
		{ ...BASE_RESULT, status },
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
	return new PushbulletAPIError(message, status, { cause });
}

describe('RATE_LIMIT_ERROR', () => {
	it('matches a 429 status and preserves Retry-After', async () => {
		const error = makeError({ status: 429, retryAfter: 2500 });

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 3, headersRetryAfterMs: 2500 });
	});

	it('falls back to matching a rate-limit message when no status exists', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate limit exceeded')),
		).toBe(true);
	});

	it('ignores unrelated errors', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('server exploded')),
		).toBe(false);
	});
});

describe('AUTH_ERROR', () => {
	it.each([401, 403])('matches %i and never retries', async (status) => {
		const error = makeError({ status });

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		} finally {
			warn.mockRestore();
		}
	});

	it('matches the invalid_access_token message fallback', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new Error('invalid_access_token: token revoked'),
			),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('invalid input'))).toBe(
			false,
		);
	});
});

describe('NOT_FOUND_ERROR', () => {
	it('matches 404 only and never retries', async () => {
		const error = makeError({ status: 404 });

		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(makeError({ status: 400 })),
		).toBe(false);
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('SERVER_ERROR', () => {
	it('retries a 5xx GET and preserves Retry-After', async () => {
		const error = makeError({ status: 503, retryAfter: 1000, method: 'GET' });

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 1000,
		});
	});

	it('never retries a 5xx POST — Pushbullet may have applied it', async () => {
		// Replaying a POST that already created a push would duplicate it.
		const error = makeError({ status: 502, method: 'POST' });

		await expect(errorHandlers.SERVER_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: undefined,
		});
	});

	it('ignores client errors', () => {
		expect(errorHandlers.SERVER_ERROR.match(makeError({ status: 400 }))).toBe(
			false,
		);
	});
});

describe('DEFAULT', () => {
	it('matches anything and never retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
