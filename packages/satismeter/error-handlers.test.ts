import type { ErrorContext, RetryStrategy } from 'corsair/core';
import { SatisMeterAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Handler = {
	match: (error: Error) => boolean;
	handler: (error: Error) => Promise<RetryStrategy>;
};
type CorsairHandler = {
	match: (error: Error, context: ErrorContext) => boolean;
	handler: (error: Error, context: ErrorContext) => Promise<RetryStrategy>;
};
type HandlerMap = Record<string, Handler>;

// unknown: the builtin map is typed against CorsairErrorHandler, whose entries
// are optional match/handler pairs with a context argument; this alias lets the
// tests probe selection without restating those types on every case.
const handlers = errorHandlers as unknown as HandlerMap;

/** Resolves the handler core would run: the first key whose `match` passes. */
function firstMatch(error: Error): string | undefined {
	return Object.keys(handlers).find((name) => handlers[name]?.match(error));
}

async function strategyFor(
	error: Error,
	handlersToUse: Record<string, CorsairHandler> = errorHandlers,
): Promise<RetryStrategy> {
	const name = Object.keys(handlersToUse).find((key) =>
		handlersToUse[key]?.match(error, contextFor(error)),
	);
	const handler = handlersToUse[name ?? 'DEFAULT'];
	// A CorsairErrorHandler entry is a Partial, so the call needs both arguments.
	return (
		(await handler?.handler(error, contextFor(error))) ?? { maxRetries: 0 }
	);
}

function contextFor(error: Error): ErrorContext {
	return {
		pluginId: 'satismeter',
		operation: 'projects.get',
		input: {},
		originalError: error,
	};
}

function readError(status: number, title: string): SatisMeterAPIError {
	return new SatisMeterAPIError(`SatisMeter ${status}: ${title}`, {
		status,
		title,
		method: 'GET',
	});
}

function writeError(status: number, title: string): SatisMeterAPIError {
	return new SatisMeterAPIError(`SatisMeter ${status}: ${title}`, {
		status,
		title,
		method: 'POST',
	});
}

describe('error handler selection', () => {
	it('does not retry a missing write key', async () => {
		const error = writeError(400, 'No write key');
		expect(firstMatch(error)).toBe('MISSING_WRITE_KEY');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a refused key', async () => {
		const error = writeError(403, 'Not authorized');
		expect(firstMatch(error)).toBe('AUTH_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('treats the v3 "Forbidden" title as auth too', async () => {
		const error = readError(403, 'Forbidden');
		expect(firstMatch(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a missing project or survey', async () => {
		const error = readError(404, 'Project not found');
		expect(firstMatch(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 429 on a read, using Retry-After when present', async () => {
		const error = new SatisMeterAPIError('slow down', {
			status: 429,
			retryAfter: 2000,
			method: 'GET',
		});
		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2000,
		});
	});

	it('retries a 429 on a read with backoff when no header came', async () => {
		const error = new SatisMeterAPIError('slow down', {
			status: 429,
			method: 'GET',
		});
		expect(await strategyFor(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('does not retry a 429 on a write, which may have been applied', async () => {
		const error = new SatisMeterAPIError('slow down', {
			status: 429,
			method: 'POST',
		});
		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure on a read', async () => {
		const error = new SatisMeterAPIError('connection reset', {
			transport: true,
			method: 'GET',
		});
		expect(firstMatch(error)).toBe('NETWORK_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_2s',
		});
	});

	it('does not replay a transport failure on a write', async () => {
		const error = new SatisMeterAPIError('connection reset', {
			transport: true,
			method: 'POST',
		});
		expect(firstMatch(error)).toBe('NETWORK_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a body that failed to read', async () => {
		const error = new SatisMeterAPIError('body unreadable', {
			bodyReadFailed: true,
			method: 'GET',
		});
		expect(firstMatch(error)).toBe('BODY_READ_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry the client deadline', async () => {
		const error = new SatisMeterAPIError('timed out', {
			transport: true,
			timedOut: true,
			method: 'GET',
		});
		// TIMEOUT_ERROR sits before NETWORK_ERROR, which would otherwise replay it.
		expect(firstMatch(error)).toBe('TIMEOUT_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 500 on a read', async () => {
		const error = readError(500, 'Internal server error');
		expect(firstMatch(error)).toBe('SERVER_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 500 on a write, which may have landed', async () => {
		const error = writeError(500, 'Internal server error');
		expect(firstMatch(error)).toBe('SERVER_ERROR');
		// users.track counts every delivery, so a replay can double-count.
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400 the API refused', async () => {
		const error = writeError(400, 'Something invalid');
		expect(firstMatch(error)).toBe('VALIDATION_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('invalid');
		error.name = 'ZodError';
		expect(firstMatch(error)).toBe('VALIDATION_ERROR');
	});

	it('leaves an unmatched failure to DEFAULT, which is last', () => {
		const names = Object.keys(handlers);
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(firstMatch(new Error('something else'))).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps a caller handler in front of the builtin DEFAULT', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: {
				match: (error: Error) => error.message === 'custom',
				handler: async () => ({ maxRetries: 7 }),
			},
		}) as HandlerMap;

		// A plain spread would keep the caller's value at the builtin's position,
		// which is after DEFAULT, so DEFAULT would claim it first.
		expect(Object.keys(merged).indexOf('CUSTOM_ERROR')).toBeLessThan(
			Object.keys(merged).indexOf('DEFAULT'),
		);
		expect(
			await strategyFor(
				new Error('custom'),
				// unknown: mergeErrorHandlers returns a CorsairErrorHandler, and
				// the probe needs the same narrowed shape as `handlers` above.
				merged as unknown as Record<string, CorsairHandler>,
			),
		).toEqual({ maxRetries: 7 });
	});

	it('uses the caller DEFAULT and keeps it last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 4 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(
			await strategyFor(
				new Error('unmatched'),
				// unknown: same narrowed shape as the test above.
				merged as unknown as Record<string, CorsairHandler>,
			),
		).toEqual({ maxRetries: 4 });
	});

	it('keeps every builtin the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {});
		for (const key of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(key);
		}
	});

	it('returns the builtin map untouched when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toEqual(errorHandlers);
	});
});
