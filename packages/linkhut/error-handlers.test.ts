import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ZodError } from 'zod';
import {
	LINKHUT_MIN_INTERVAL_MS,
	linkhutApiError,
	linkhutRequestGap,
	makeLinkhutRequest,
} from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { unauthenticated } from './test-fixtures';
import { captureError, mockFetchRejection } from './test-helpers';

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match?.(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error): Promise<RetryStrategy> {
	const handler = errorHandlers[classify(error)].handler;
	if (!handler) throw new Error('the chosen handler has no handler');
	return handler(error);
}

function linkhutError(
	status: number,
	options: { replayable?: boolean; retryAfter?: number; body?: unknown } = {},
): Error {
	return linkhutApiError(
		{ method: 'GET', path: '/v1/posts/get' },
		{ status, body: options.body },
		`Linkhut HTTP ${status}`,
		options.replayable ?? false,
		options.retryAfter,
	);
}

async function transportError(replayable: boolean): Promise<Error> {
	linkhutRequestGap.minIntervalMs = 0;
	mockFetchRejection(new TypeError('fetch failed'));
	try {
		return (await captureError(
			makeLinkhutRequest('k', {
				method: 'GET',
				path: '/v1/posts/get',
				replayable,
			}),
		)) as Error;
	} finally {
		linkhutRequestGap.minIntervalMs = LINKHUT_MIN_INTERVAL_MS;
		jest.restoreAllMocks();
	}
}

describe('Linkhut error handlers', () => {
	it.each([true, false])(
		'leaves a 429 to core, which already retried it (replayable %s)',
		async (replayable) => {
			const error = linkhutError(429, { replayable, retryAfter: 2000 });
			expect(classify(error)).toBe('RATE_LIMIT_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('retries a 500 on a read, which linkhut documents as a throttle signal', async () => {
		const error = linkhutError(500, { replayable: true });
		expect(classify(error)).toBe('THROTTLED_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 500 or 502 on a write that may have landed', async () => {
		for (const status of [500, 502]) {
			const error = linkhutError(status, { replayable: false });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('retries a dropped connection on a read', async () => {
		const error = await transportError(true);
		expect(classify(error)).toBe('NETWORK_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a dropped connection on a write', async () => {
		const error = await transportError(false);
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401 Unauthenticated', async () => {
		const error = linkhutError(401, {
			replayable: true,
			body: unauthenticated,
		});
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		const error = linkhutError(403, { replayable: true });
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404, 406, 422])('does not retry a %i', async (status) => {
		const error = linkhutError(status, { replayable: true });
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input the schema refused', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a result_code failure that arrived at HTTP 200', async () => {
		const error = linkhutError(200, {
			body: { result_code: 'something went wrong' },
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a plain Error from elsewhere', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers as CorsairErrorHandler;

	it('leaves the builtins untouched when no caller handlers are given', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('runs a caller handler before the builtins and keeps DEFAULT last', () => {
		const caller: CorsairErrorHandler = {
			SERVER_ERROR: {
				match: () => true,
				handler: () => Promise.resolve({ maxRetries: 7 }),
			},
		};
		const merged = mergeErrorHandlers(builtin, caller);
		const names = Object.keys(merged);
		expect(names[0]).toBe('SERVER_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('prefers the caller DEFAULT over the builtin one', async () => {
		const callerDefault = {
			match: () => true,
			handler: () => Promise.resolve({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(builtin, { DEFAULT: callerDefault });
		expect(merged.DEFAULT).toBe(callerDefault);
		expect(
			await merged.DEFAULT?.handler(new Error('x'), {
				pluginId: 'linkhut',
				operation: 'test',
				input: {},
				originalError: new Error('x'),
			}),
		).toEqual({
			maxRetries: 9,
		});
	});

	it('lets a caller handler shadow a builtin it names', async () => {
		const callerAuth = {
			match: () => true,
			handler: () => Promise.resolve({ maxRetries: 3 }),
		};
		const merged = mergeErrorHandlers(builtin, { AUTH_ERROR: callerAuth });
		expect(merged.AUTH_ERROR).toBe(callerAuth);
	});
});
