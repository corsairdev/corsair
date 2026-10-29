import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CodeInterpreterRateLimitError } from './client';
import { errorHandlers } from './error-handlers';

function makeApiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://code.librechat.ai/files' },
		{
			url: 'https://code.librechat.ai/files',
			ok: false,
			status,
			statusText: message,
			body: { detail: message },
		},
		message,
	);
}

// Widen the literal handler map to the framework interface so match/handler
// accept the documented (error, context) arguments.
const handlers: CorsairErrorHandler = errorHandlers;

function makeContext(error: Error): ErrorContext {
	return {
		pluginId: 'codeinterpreter',
		operation: 'code.execute',
		input: {},
		originalError: error,
	};
}

function getEntry(name: 'RATE_LIMIT_ERROR' | 'AUTH_ERROR' | 'DEFAULT') {
	const entry = handlers[name];
	if (!entry) {
		throw new Error(`missing error handler entry: ${name}`);
	}
	return entry;
}

function matches(
	name: 'RATE_LIMIT_ERROR' | 'AUTH_ERROR' | 'DEFAULT',
	error: Error,
): boolean {
	const entry = getEntry(name);
	return entry.match(error, makeContext(error));
}

describe('codeinterpreter errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches the custom rate limit error', () => {
			expect(
				matches('RATE_LIMIT_ERROR', new CodeInterpreterRateLimitError()),
			).toBe(true);
		});

		it('matches an ApiError with status 429', () => {
			expect(
				matches('RATE_LIMIT_ERROR', makeApiError(429, 'Too Many Requests')),
			).toBe(true);
		});

		it('matches message-based rate limit signals', () => {
			expect(
				matches('RATE_LIMIT_ERROR', new Error('rate_limited by upstream')),
			).toBe(true);
			expect(
				matches('RATE_LIMIT_ERROR', new Error('request failed with 429')),
			).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(matches('RATE_LIMIT_ERROR', new Error('boom'))).toBe(false);
		});

		it('honors retryAfterMs from the custom error', async () => {
			const error = new CodeInterpreterRateLimitError(undefined, 4000);
			const result = await getEntry('RATE_LIMIT_ERROR').handler(
				error,
				makeContext(error),
			);
			expect(result).toMatchObject({
				maxRetries: 5,
				headersRetryAfterMs: 4000,
			});
		});

		it('returns maxRetries 5 without retry info otherwise', async () => {
			const error = new Error('rate_limited');
			const result = await getEntry('RATE_LIMIT_ERROR').handler(
				error,
				makeContext(error),
			);
			expect(result).toMatchObject({ maxRetries: 5 });
			expect(result.headersRetryAfterMs).toBeUndefined();
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches an ApiError with status 401', () => {
			expect(matches('AUTH_ERROR', makeApiError(401, 'Unauthorized'))).toBe(
				true,
			);
		});

		it('matches message-based auth signals', () => {
			expect(matches('AUTH_ERROR', new Error('unauthorized'))).toBe(true);
			expect(matches('AUTH_ERROR', new Error('invalid_auth token'))).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(matches('AUTH_ERROR', new Error('boom'))).toBe(false);
		});

		it('returns maxRetries 0', async () => {
			const error = makeApiError(401, 'Unauthorized');
			const result = await getEntry('AUTH_ERROR').handler(
				error,
				makeContext(error),
			);
			expect(result).toMatchObject({ maxRetries: 0 });
		});
	});

	describe('DEFAULT', () => {
		it('matches everything', () => {
			expect(matches('DEFAULT', new Error('boom'))).toBe(true);
			expect(matches('DEFAULT', makeApiError(500, 'Server Error'))).toBe(true);
		});

		it('returns maxRetries 0', async () => {
			const error = new Error('boom');
			const result = await getEntry('DEFAULT').handler(
				error,
				makeContext(error),
			);
			expect(result).toMatchObject({ maxRetries: 0 });
		});
	});
});
