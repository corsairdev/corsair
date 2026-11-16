import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SurveymonkeyAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

const context = {
	pluginId: 'surveymonkey',
	operation: 'surveys.list',
	input: {},
	originalError: new Error('test'),
} as ErrorContext;

/**
 * The builtin map widened to the interface it satisfies. The literal narrows each
 * function to the arguments that literal passes, and a handler is documented to
 * take a context, so the tests call through the interface type.
 */
const handlers: CorsairErrorHandler = errorHandlers;

function entry(name: keyof CorsairErrorHandler) {
	const found = handlers[name];
	if (!found) throw new Error(`no handler named ${name}`);
	return found;
}

/** Core's HTTP error, the shape an HTTP failure reaches the handlers in. */
function apiError(status: number, method: 'GET' | 'POST' = 'GET'): ApiError {
	return new ApiError(
		{ method, url: '/surveys' },
		{
			url: 'https://api.surveymonkey.com/v3/surveys',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		`HTTP ${status}`,
		{ retryAfter: status === 429 ? 3000 : undefined },
	);
}

describe('surveymonkey error handling', () => {
	it('leaves 429 retries to core, which already retried three times', async () => {
		const error = apiError(429);

		expect(entry('RATE_LIMIT_ERROR').match(error, context)).toBe(true);
		expect(await entry('RATE_LIMIT_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 3000,
		});
	});

	it("classifies core's ApiError by status", () => {
		expect(entry('AUTH_ERROR').match(apiError(401), context)).toBe(true);
		expect(entry('AUTH_ERROR').match(apiError(403), context)).toBe(true);
		expect(entry('NOT_FOUND_ERROR').match(apiError(404), context)).toBe(true);
		expect(entry('VALIDATION_ERROR').match(apiError(400), context)).toBe(true);
		expect(entry('SERVER_ERROR').match(apiError(502, 'GET'), context)).toBe(
			true,
		);
		expect(entry('SERVER_ERROR').match(apiError(502, 'POST'), context)).toBe(
			false,
		);
	});

	it('sends no Retry-After when the API did not', async () => {
		const error = new SurveymonkeyAPIError('rate limited', { status: 429 });
		const strategy = await entry('RATE_LIMIT_ERROR').handler(error, context);

		expect(
			(strategy as Record<string, unknown>).headersRetryAfterMs,
		).toBeUndefined();
	});

	it('does not retry an auth failure', async () => {
		for (const status of [401, 403]) {
			const error = new SurveymonkeyAPIError('nope', { status });
			expect(entry('AUTH_ERROR').match(error, context)).toBe(true);
			expect(await entry('AUTH_ERROR').handler(error, context)).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not retry a 404', async () => {
		const error = new SurveymonkeyAPIError('Not Found', { status: 404 });

		expect(entry('NOT_FOUND_ERROR').match(error, context)).toBe(true);
		expect(await entry('NOT_FOUND_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 400 or a schema rejection', async () => {
		const error = new SurveymonkeyAPIError('bad filter', { status: 400 });
		const zod = Object.assign(new Error('bad input'), { name: 'ZodError' });

		expect(entry('VALIDATION_ERROR').match(error, context)).toBe(true);
		expect(entry('VALIDATION_ERROR').match(zod, context)).toBe(true);
		expect(await entry('VALIDATION_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 5xx only for a read', async () => {
		const read = new SurveymonkeyAPIError('boom', {
			status: 502,
			method: 'GET',
		});
		const write = new SurveymonkeyAPIError('boom', {
			status: 502,
			method: 'POST',
		});

		expect(entry('SERVER_ERROR').match(read, context)).toBe(true);
		// A create that timed out may have committed, so it is not replayed.
		expect(entry('SERVER_ERROR').match(write, context)).toBe(false);
		expect(await entry('SERVER_ERROR').handler(read, context)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches a plain error only through DEFAULT', () => {
		const error = new Error('socket hang up');

		for (const name of [
			'RATE_LIMIT_ERROR',
			'AUTH_ERROR',
			'NOT_FOUND_ERROR',
			'VALIDATION_ERROR',
			'SERVER_ERROR',
		] as const) {
			expect(entry(name).match(error, context)).toBe(false);
		}
		expect(entry('DEFAULT').match(error, context)).toBe(true);
	});
});

describe('surveymonkey error handler merging', () => {
	it('returns the builtin map when the caller passes none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts caller handlers first and keeps DEFAULT last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(Object.keys(merged)[0]).toBe('QUOTA_ERROR');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		const fallback = merged['DEFAULT'];
		expect(fallback).toBeDefined();
		expect(await fallback!.handler(new Error('x'), context)).toEqual({
			maxRetries: 1,
		});
	});

	it('lets a caller replace one builtin handler', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 5 }),
			},
		});

		const replaced = merged['AUTH_ERROR'];
		expect(replaced).toBeDefined();
		expect(await replaced!.handler(new Error('x'), context)).toEqual({
			maxRetries: 5,
		});
	});
});
