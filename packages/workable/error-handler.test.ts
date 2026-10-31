import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers, NON_IDEMPOTENT_OPERATIONS } from './error-handlers';

// why safe: narrows the object literal to the framework contract the runtime
// actually calls with (error, context) — literal functions declare fewer
// params, which is assignable but not directly callable with two args.
const handlers: CorsairErrorHandler = errorHandlers;

/** Builds the error context the framework passes to match/handler functions. */
function makeCtx(operation: string): ErrorContext {
	return {
		pluginId: 'workable',
		operation,
		input: {},
		originalError: new Error('original'),
	};
}

/** Builds a real ApiError with the given status for handler match/handler tests. */
function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: 'https://example.workable.com/spi/v3/departments',
	};
	const response: ApiResult = {
		url: 'https://example.workable.com/spi/v3/departments',
		ok: false,
		status,
		statusText: message,
		body: { error: message },
	};
	return new ApiError(request, response, message, { retryAfter });
}

describe('Workable error handlers', () => {
	describe('CONFIGURATION_ERROR', () => {
		it('matches a missing-credential error and never retries', async () => {
			const error = new AuthMissingError('workable', 'api_key');
			expect(
				handlers.CONFIGURATION_ERROR?.match(error, makeCtx('departments.list')),
			).toBe(true);
			const strategy = await handlers.CONFIGURATION_ERROR?.handler(
				error,
				makeCtx('departments.list'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});

		it('matches the client credential codes without retrying', async () => {
			for (const code of [
				'MISSING_ACCESS_TOKEN',
				'MISSING_ACCOUNT',
				'INVALID_ACCOUNT',
			]) {
				const error = Object.assign(new Error(`bad config: ${code}`), { code });
				expect(
					handlers.CONFIGURATION_ERROR?.match(
						error,
						makeCtx('departments.list'),
					),
				).toBe(true);
				const strategy = await handlers.CONFIGURATION_ERROR?.handler(
					error,
					makeCtx('departments.list'),
				);
				expect(strategy).toMatchObject({ maxRetries: 0 });
			}
		});
	});

	describe('RATE_LIMIT_ERROR', () => {
		it('matches HTTP 429 and retries with the Retry-After hint', async () => {
			const error = apiError(429, 'Too Many Requests', 2000);
			expect(
				handlers.RATE_LIMIT_ERROR?.match(error, makeCtx('jobs.list')),
			).toBe(true);
			const strategy = await handlers.RATE_LIMIT_ERROR?.handler(
				error,
				makeCtx('jobs.list'),
			);
			expect(strategy).toMatchObject({
				maxRetries: 5,
				headersRetryAfterMs: 2000,
			});
		});

		it('matches a rate-limit message without a status code', async () => {
			const error = new Error('rate limit exceeded, slow down');
			expect(
				handlers.RATE_LIMIT_ERROR?.match(error, makeCtx('jobs.list')),
			).toBe(true);
		});

		it('never retries a throttled write — a replay could land twice', async () => {
			const error = apiError(429, 'Too Many Requests', 2000);
			const strategy = await handlers.RATE_LIMIT_ERROR?.handler(
				error,
				makeCtx('members.invite'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches HTTP 401 and never retries', async () => {
			const error = apiError(401, 'Unauthorized');
			expect(handlers.AUTH_ERROR?.match(error, makeCtx('members.list'))).toBe(
				true,
			);
			const strategy = await handlers.AUTH_ERROR?.handler(
				error,
				makeCtx('members.list'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});
	});

	describe('PERMISSION_ERROR', () => {
		it('matches HTTP 403 (missing token scope) and never retries', async () => {
			const error = apiError(403, 'Forbidden');
			expect(
				handlers.PERMISSION_ERROR?.match(error, makeCtx('employees.list')),
			).toBe(true);
			const strategy = await handlers.PERMISSION_ERROR?.handler(
				error,
				makeCtx('employees.list'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches HTTP 404 and never retries', async () => {
			const error = apiError(404, 'Not Found');
			expect(
				handlers.NOT_FOUND_ERROR?.match(error, makeCtx('employees.get')),
			).toBe(true);
			const strategy = await handlers.NOT_FOUND_ERROR?.handler(
				error,
				makeCtx('employees.get'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});
	});

	describe('VALIDATION_ERROR', () => {
		it.each([400, 422])('matches HTTP %i and never retries', async (status) => {
			const error = apiError(status, 'Bad request');
			expect(
				handlers.VALIDATION_ERROR?.match(error, makeCtx('departments.create')),
			).toBe(true);
			const strategy = await handlers.VALIDATION_ERROR?.handler(
				error,
				makeCtx('departments.create'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});
	});

	describe('NETWORK_ERROR', () => {
		it('retries transport failures on read operations', async () => {
			const error = new Error('fetch failed: connection reset');
			expect(handlers.NETWORK_ERROR?.match(error, makeCtx('jobs.list'))).toBe(
				true,
			);
			const strategy = await handlers.NETWORK_ERROR?.handler(
				error,
				makeCtx('jobs.list'),
			);
			expect(strategy).toMatchObject({ maxRetries: 3 });
		});

		it('never retries a transport failure on a write — Workable has no idempotency key', async () => {
			const error = new Error('fetch failed: connection reset');
			const strategy = await handlers.NETWORK_ERROR?.handler(
				error,
				makeCtx('departments.create'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});

		it('marks every mutating endpoint as non-idempotent', () => {
			for (const operation of [
				'departments.create',
				'departments.update',
				'departments.merge',
				'departments.delete',
				'employees.create',
				'employees.update',
				'employees.uploadDocuments',
				'members.invite',
				'members.update',
				'members.enable',
				'subscriptions.create',
				'subscriptions.delete',
			]) {
				expect(NON_IDEMPOTENT_OPERATIONS.has(operation)).toBe(true);
			}
			for (const operation of [
				'departments.list',
				'jobs.list',
				'candidates.list',
			]) {
				expect(NON_IDEMPOTENT_OPERATIONS.has(operation)).toBe(false);
			}
		});
	});

	describe('DEFAULT', () => {
		it('matches anything left over and never retries', async () => {
			const error = new Error('something entirely unexpected');
			expect(handlers.DEFAULT?.match(error, makeCtx('jobs.list'))).toBe(true);
			const strategy = await handlers.DEFAULT?.handler(
				error,
				makeCtx('jobs.list'),
			);
			expect(strategy).toMatchObject({ maxRetries: 0 });
		});
	});
});
