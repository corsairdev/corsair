import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { MeloAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Strategy = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

type Handler = {
	match: (error: Error, context: ErrorContext) => boolean;
	handler: (error: Error, context: ErrorContext) => Promise<Strategy>;
};

/** The context core passes to every matcher and handler. */
function contextFor(error: Error): ErrorContext {
	return {
		pluginId: 'melo',
		operation: 'properties.list',
		input: {},
		originalError: error,
	};
}

/** Runs the handler a name resolves to, as core does. */
function strategyFor(
	handlers: CorsairErrorHandler,
	name: string,
	error: Error,
): Promise<Strategy> {
	const entry = handlers[name] as Handler | undefined;
	if (!entry) throw new Error(`Expected "${name}" to be registered`);
	return entry.handler(error, contextFor(error));
}

/** The first handler whose match passes, in key order, as core resolves it. */
function resolve(
	handlers: CorsairErrorHandler,
	error: Error,
): string | undefined {
	return Object.entries(handlers).find(([, entry]) =>
		entry?.match(error, contextFor(error)),
	)?.[0];
}

const apiError = (
	status: number,
	options: { replaySafe?: boolean; retryAfter?: number } = {},
) =>
	new MeloAPIError(`Melo ${status}`, {
		status,
		method: 'GET',
		replaySafe: options.replaySafe ?? true,
		retryAfter: options.retryAfter,
	});

describe('Melo error handlers', () => {
	it('retries a 429 up to three times with exponential backoff', async () => {
		const error = apiError(429);
		expect(resolve(errorHandlers, error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategyFor(errorHandlers, 'RATE_LIMIT_ERROR', error)).toEqual(
			{
				maxRetries: 3,
				headersRetryAfterMs: undefined,
				retryStrategy: 'exponential_backoff',
			},
		);
	});

	it('passes a real Retry-After through, and uses the backoff when there is none', async () => {
		const withHeader = await strategyFor(
			errorHandlers,
			'RATE_LIMIT_ERROR',
			apiError(429, { retryAfter: 7000 }),
		);
		expect(withHeader.headersRetryAfterMs).toBe(7000);

		const without = await strategyFor(
			errorHandlers,
			'RATE_LIMIT_ERROR',
			apiError(429),
		);
		expect(without.headersRetryAfterMs).toBeUndefined();
		expect(without.retryStrategy).toBe('exponential_backoff');
	});

	it('retries a rate-limited write, because a 429 is a refusal', async () => {
		const error = apiError(429, { replaySafe: false });
		expect(resolve(errorHandlers, error)).toBe('RATE_LIMIT_ERROR');
		expect(
			(await strategyFor(errorHandlers, 'RATE_LIMIT_ERROR', error)).maxRetries,
		).toBe(3);
	});

	it.each([
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'BAD_REQUEST_ERROR'],
	])('never retries a %i', async (status, name) => {
		const error = apiError(status);
		expect(resolve(errorHandlers, error)).toBe(name);
		expect((await strategyFor(errorHandlers, name, error)).maxRetries).toBe(0);
	});

	it('never retries input that failed the zod schema', async () => {
		const zodError = new Error('bad input');
		zodError.name = 'ZodError';
		expect(resolve(errorHandlers, zodError)).toBe('VALIDATION_ERROR');
		expect(
			(await strategyFor(errorHandlers, 'VALIDATION_ERROR', zodError))
				.maxRetries,
		).toBe(0);
	});

	it('retries a 5xx on a read twice', async () => {
		const error = apiError(503);
		expect(resolve(errorHandlers, error)).toBe('SERVER_ERROR');
		expect(await strategyFor(errorHandlers, 'SERVER_ERROR', error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a write or on webhooks.simulate', async () => {
		const error = apiError(500, { replaySafe: false });
		expect(resolve(errorHandlers, error)).toBe('DEFAULT');
		expect(
			(await strategyFor(errorHandlers, 'DEFAULT', error)).maxRetries,
		).toBe(0);
	});

	it('retries a transport failure on a read, but not on a write', async () => {
		const read = new MeloAPIError('fetch failed', {
			transport: true,
			replaySafe: true,
		});
		expect(resolve(errorHandlers, read)).toBe('NETWORK_ERROR');
		expect(
			(await strategyFor(errorHandlers, 'NETWORK_ERROR', read)).maxRetries,
		).toBe(2);

		const write = new MeloAPIError('fetch failed', {
			transport: true,
			replaySafe: false,
		});
		expect(resolve(errorHandlers, write)).toBe('DEFAULT');
	});

	it('sends an error that is not a MeloAPIError to DEFAULT', () => {
		expect(resolve(errorHandlers, new Error('boom'))).toBe('DEFAULT');
	});

	it('keeps DEFAULT as the last key', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	const custom: CorsairErrorHandler = {
		TEAPOT: {
			match: (error: Error) =>
				error instanceof MeloAPIError && error.status === 418,
			handler: async () => ({ maxRetries: 9 }),
		},
	};

	it('returns the builtin handlers when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('runs a caller handler for a status no builtin covers before DEFAULT', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(resolve(merged, apiError(418))).toBe('TEAPOT');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('keeps the builtins the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(resolve(merged, apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(resolve(merged, apiError(401))).toBe('AUTH_ERROR');
		expect(resolve(merged, new Error('boom'))).toBe('DEFAULT');
	});

	it('lets a caller override a builtin by name, in the caller position', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: (error: Error) =>
					error instanceof MeloAPIError && error.status === 429,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(Object.keys(merged)[0]).toBe('RATE_LIMIT_ERROR');
		expect(
			(await strategyFor(merged, 'RATE_LIMIT_ERROR', apiError(429))).maxRetries,
		).toBe(1);
	});

	it('lets a caller replace DEFAULT and still keeps it last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 5 }) },
		});

		const keys = Object.keys(merged);
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys.filter((key) => key === 'DEFAULT')).toHaveLength(1);
		expect(
			(await strategyFor(merged, 'DEFAULT', new Error('x'))).maxRetries,
		).toBe(5);
	});
});
