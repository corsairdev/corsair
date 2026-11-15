import type { ErrorHandler, ErrorMatcher } from 'corsair/core';
import { TextCortexAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(
	status: number,
	method: 'GET' | 'POST' = 'POST',
	retryAfter?: number,
) {
	return new TextCortexAPIError(`TextCortex ${status}`, {
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

describe('textcortex error handlers', () => {
	it('keeps DEFAULT last so it only catches what nothing else matched', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('puts the out-of-credits handler before the rate-limit one', () => {
		// A 402 and a 429 both mean "stop", but only one recovers by waiting.
		const names = Object.keys(errorHandlers);
		expect(names[0]).toBe('INSUFFICIENT_CREDITS');
		expect(names.indexOf('INSUFFICIENT_CREDITS')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
	});

	it('never retries an out-of-credits answer', async () => {
		const error = apiError(402);
		expect(match('INSUFFICIENT_CREDITS')(error)).toBe(true);
		await expect(
			handler('INSUFFICIENT_CREDITS')(error, context),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats 401 and 403 as permanent auth failures', async () => {
		for (const status of [401, 403]) {
			const error = apiError(status);
			expect(match('AUTH_ERROR')(error)).toBe(true);
			await expect(handler('AUTH_ERROR')(error, context)).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('retries a 429 and passes a Retry-After through', async () => {
		await expect(
			handler('RATE_LIMIT_ERROR')(apiError(429, 'GET', 4000), context),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
			retryStrategy: 'exponential_backoff',
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

	it('does not retry an insertion or processing state', async () => {
		for (const status of [409, 423]) {
			const error = apiError(status);
			expect(match('CONFLICT_ERROR')(error)).toBe(true);
			await expect(handler('CONFLICT_ERROR')(error, context)).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('replays a 5xx read but never a paid generation', async () => {
		const read = apiError(500, 'GET');
		expect(match('SERVER_ERROR')(read)).toBe(true);
		await expect(handler('SERVER_ERROR')(read, context)).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		// Repeating a completion or image generation can bill a second answer.
		expect(match('SERVER_ERROR')(apiError(500, 'POST'))).toBe(false);
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
