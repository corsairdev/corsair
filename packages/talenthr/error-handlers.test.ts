import type { ErrorHandler, ErrorMatcher } from 'corsair/core';
import { TalentHRAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(
	status: number,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
	retryAfter?: number,
) {
	return new TalentHRAPIError(`TalentHR ${status}`, {
		status,
		method,
		retryAfter,
	});
}

const context = {} as Parameters<ErrorHandler>[1];

/**
 * Several handlers and matchers are declared with no parameters because their
 * bodies ignore them, so neither can be called with the full core signature
 * directly. These adapters pass the same two arguments core passes.
 */
function match(name: keyof typeof errorHandlers): (error: Error) => boolean {
	const value = errorHandlers[name];
	// The declared type is Partial, so a missing entry has to be ruled out.
	if (!value) throw new Error(`missing handler ${String(name)}`);
	return (error) => (value.match as ErrorMatcher)(error, context);
}

function handler(name: keyof typeof errorHandlers): ErrorHandler {
	const value = errorHandlers[name];
	if (!value) throw new Error(`missing handler ${String(name)}`);
	return value.handler as ErrorHandler;
}

describe('talenthr error handlers', () => {
	it('keeps DEFAULT last so it only catches what nothing else matched', () => {
		const names = Object.keys(errorHandlers);
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('retries a 429 and passes a Retry-After through', async () => {
		const error = apiError(429, 'GET', 2500);

		await expect(handler('RATE_LIMIT_ERROR')(error, context)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls back to exponential backoff when a 429 carries no header', async () => {
		const result = await handler('RATE_LIMIT_ERROR')(
			apiError(429, 'GET'),
			context,
		);

		// TalentHR documents 2000 requests per minute and sends no Retry-After.
		expect(result.maxRetries).toBe(3);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	it('does not retry a refused key', async () => {
		const error = apiError(401);

		expect(match('AUTH_ERROR')(error)).toBe(true);
		await expect(handler('AUTH_ERROR')(error, context)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a permission failure', async () => {
		const error = apiError(403);

		expect(match('PERMISSION_ERROR')(error)).toBe(true);
		await expect(handler('PERMISSION_ERROR')(error, context)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats 400, 404 and 422 as permanent, and a ZodError too', async () => {
		for (const status of [400, 404, 422]) {
			const error = apiError(status);
			expect(match('VALIDATION_ERROR')(error)).toBe(true);
			await expect(
				handler('VALIDATION_ERROR')(error, context),
			).resolves.toEqual({ maxRetries: 0 });
		}

		const zodError = Object.assign(new Error('bad input'), {
			name: 'ZodError',
		});
		expect(match('VALIDATION_ERROR')(zodError)).toBe(true);
	});

	it('does not retry a 409 uniqueness or in-use conflict', async () => {
		const error = apiError(409);

		expect(match('CONFLICT_ERROR')(error)).toBe(true);
		await expect(handler('CONFLICT_ERROR')(error, context)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 5xx read but never a write', async () => {
		const read = apiError(503, 'GET');

		expect(match('SERVER_ERROR')(read)).toBe(true);
		await expect(handler('SERVER_ERROR')(read, context)).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		// A POST that answers 5xx may already have created the employee or the
		// time off request, so repeating it would duplicate the record.
		expect(match('SERVER_ERROR')(apiError(503, 'POST'))).toBe(false);
		expect(match('SERVER_ERROR')(apiError(503, 'DELETE'))).toBe(false);
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = {
		RATE_LIMIT_ERROR: errorHandlers.RATE_LIMIT_ERROR,
		DEFAULT: errorHandlers.DEFAULT,
	};

	it('returns the builtin map when the caller passes none', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('runs a caller handler for a status no builtin covers', () => {
		const merged = mergeErrorHandlers(builtin, {
			TEAPOT: {
				match: (error) => error.message === 'teapot',
				handler: async () => ({}),
			},
		});

		const names = Object.keys(merged);
		expect(names[0]).toBe('TEAPOT');
		// DEFAULT must stay last, or it would claim the caller's error first.
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('keeps caller keys first and fills in the untouched builtins', () => {
		const merged = mergeErrorHandlers(builtin, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		const names = Object.keys(merged);
		expect(names[0]).toBe('AUTH_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('prefers the caller DEFAULT when one is given', () => {
		const callerDefault = { match: () => true, handler: async () => ({}) };
		const merged = mergeErrorHandlers(builtin, { DEFAULT: callerDefault });

		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
