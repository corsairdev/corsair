import type { ErrorContext } from 'corsair/core';
import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

const sampleRequest: ApiRequestOptions = {
	method: 'GET',
	url: 'assistants',
};

function apiErrorOf(
	status: number,
	statusText: string,
	retryAfterMs?: number,
): ApiError {
	return new ApiError(
		sampleRequest,
		{
			url: 'https://cloud.griptape.ai/api/assistants',
			ok: false,
			status,
			statusText,
			body: { message: statusText },
		},
		statusText,
		retryAfterMs === undefined ? undefined : { retryAfter: retryAfterMs },
	);
}

const errorContext: ErrorContext = {
	pluginId: 'griptape',
	operation: 'assistant.list',
	input: {},
	originalError: new Error('original'),
};

type ErrorHandlerKey = 'RATE_LIMIT_ERROR' | 'AUTH_ERROR' | 'DEFAULT';

function handlerFor(key: ErrorHandlerKey) {
	const entry = errorHandlers[key];
	if (!entry) throw new Error(`missing ${key} error handler`);
	return entry;
}

describe('griptape error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches ApiError with status 429', () => {
			expect(
				handlerFor('RATE_LIMIT_ERROR').match(
					apiErrorOf(429, 'x'),
					errorContext,
				),
			).toBe(true);
		});

		it('matches rate-limit text on plain errors', () => {
			expect(
				handlerFor('RATE_LIMIT_ERROR').match(
					new Error('rate_limited: slow down'),
					errorContext,
				),
			).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(
				handlerFor('RATE_LIMIT_ERROR').match(
					new Error('not found'),
					errorContext,
				),
			).toBe(false);
		});

		it('passes the provider Retry-After through to the retry policy', async () => {
			const policy = await handlerFor('RATE_LIMIT_ERROR').handler(
				apiErrorOf(429, 'Too Many Requests', 45000),
				errorContext,
			);

			expect(policy).toEqual({ maxRetries: 5, headersRetryAfterMs: 45000 });
		});

		it('omits Retry-After when the provider does not send one', async () => {
			const policy = await handlerFor('RATE_LIMIT_ERROR').handler(
				apiErrorOf(429, 'Too Many Requests'),
				errorContext,
			);

			expect(policy).toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches ApiError with status 401', () => {
			expect(
				handlerFor('AUTH_ERROR').match(apiErrorOf(401, 'x'), errorContext),
			).toBe(true);
		});

		it('matches unauthorized text on plain errors', () => {
			expect(
				handlerFor('AUTH_ERROR').match(
					new Error('unauthorized key'),
					errorContext,
				),
			).toBe(true);
		});

		it('does not match 403 errors', () => {
			expect(
				handlerFor('AUTH_ERROR').match(apiErrorOf(403, 'x'), errorContext),
			).toBe(false);
		});

		it('does not retry auth failures', async () => {
			const policy = await handlerFor('AUTH_ERROR').handler(
				apiErrorOf(401, 'Unauthorized'),
				errorContext,
			);

			expect(policy).toEqual({ maxRetries: 0 });
		});
	});

	describe('DEFAULT', () => {
		it('matches every error', () => {
			expect(
				handlerFor('DEFAULT').match(new Error('anything'), errorContext),
			).toBe(true);
		});

		it('does not retry by default', async () => {
			const policy = await handlerFor('DEFAULT').handler(
				new Error('boom'),
				errorContext,
			);

			expect(policy).toEqual({ maxRetries: 0 });
		});
	});
});
