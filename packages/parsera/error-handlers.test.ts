import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(
	status: number,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
): ApiError {
	return new ApiError(
		{ method, url: '/v1/extractor/extract' },
		{
			url: '/v1/extractor/extract',
			ok: false,
			status,
			statusText: '',
			body: null,
		},
		`Parsera ${status}: boom`,
	);
}

const NO_CONTEXT: ErrorContext = {
	pluginId: 'parsera',
	operation: 'test',
	input: {},
	originalError: new Error('test'),
};

// The literal narrows each handler's parameter list; going through the
// CorsairErrorHandler shape gives every entry the full (error, context)
// signature the runtime calls it with.
const handlers: CorsairErrorHandler = errorHandlers;

async function retriesFor(error: Error): Promise<number> {
	for (const [name, entry] of Object.entries(handlers)) {
		if (!entry) continue;
		if (name !== 'DEFAULT' && entry.match(error, NO_CONTEXT)) {
			const result = await entry.handler(error, NO_CONTEXT);
			return result.maxRetries ?? 0;
		}
	}
	const fallback = handlers.DEFAULT;
	if (!fallback) throw new Error('DEFAULT handler missing');
	const result = await fallback.handler(error, NO_CONTEXT);
	return result.maxRetries ?? 0;
}

describe('error handlers', () => {
	it('claims a 429 with zero retries so a caller root handler cannot restart the transport retries', async () => {
		const entry = handlers.RATE_LIMIT_ERROR;
		if (!entry) throw new Error('RATE_LIMIT_ERROR handler missing');
		expect(entry.match(apiError(429), NO_CONTEXT)).toBe(true);
		expect((await entry.handler(apiError(429), NO_CONTEXT)).maxRetries).toBe(0);
	});

	it('does not retry a 401', async () => {
		expect(await retriesFor(apiError(401))).toBe(0);
	});

	it('does not retry a 400 or a 404', async () => {
		expect(await retriesFor(apiError(400))).toBe(0);
		expect(await retriesFor(apiError(404))).toBe(0);
	});

	it('does not retry a ZodError', async () => {
		expect(await retriesFor(zodError())).toBe(0);
	});

	it('retries a GET 5xx twice with exponential backoff', async () => {
		const entry = handlers.SERVER_ERROR;
		if (!entry) throw new Error('SERVER_ERROR handler missing');
		expect(entry.match(apiError(503, 'GET'), NO_CONTEXT)).toBe(true);
		const result = await entry.handler(apiError(503, 'GET'), NO_CONTEXT);
		expect(result.maxRetries).toBe(2);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	it('does not retry a write 5xx, because extraction runs charge credits', async () => {
		expect(await retriesFor(apiError(502, 'POST'))).toBe(0);
		expect(await retriesFor(apiError(502, 'DELETE'))).toBe(0);
	});

	it('does not retry anything else via DEFAULT', async () => {
		expect(await retriesFor(apiError(418))).toBe(0);
	});

	it('matches DEFAULT last, after every named handler', () => {
		const order = Object.keys(errorHandlers);
		expect(order.at(-1)).toBe('DEFAULT');
		expect(order).toEqual([
			'RATE_LIMIT_ERROR',
			'AUTH_ERROR',
			'VALIDATION_ERROR',
			'SERVER_ERROR',
			'DEFAULT',
		]);
	});
});

// A ZodError with no message body of its own; only its name matters here.
function zodError(): Error {
	const error = new Error('Zod validation failed');
	error.name = 'ZodError';
	return error;
}

describe('mergeErrorHandlers', () => {
	const builtin: CorsairErrorHandler = errorHandlers;

	it('returns the builtin set unchanged without a caller', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('runs a caller handler for a status no builtin covers', async () => {
		const caller: CorsairErrorHandler = {
			OVERLOADED_ERROR: {
				match: (error: Error) => statusIs(error, 529),
				handler: async () => ({ maxRetries: 1 }),
			},
		};
		const merged = mergeErrorHandlers(builtin, caller);
		const order = Object.keys(merged);
		expect(order[0]).toBe('OVERLOADED_ERROR');
		expect(order.at(-1)).toBe('DEFAULT');
		const entry = merged.OVERLOADED_ERROR;
		if (!entry) throw new Error('caller handler missing');
		const result = await entry.handler(apiError(529), NO_CONTEXT);
		expect(result.maxRetries).toBe(1);
	});

	it('lets a caller override a builtin value while keeping DEFAULT last', async () => {
		const caller: CorsairErrorHandler = {
			AUTH_ERROR: {
				match: (error: Error) => statusIs(error, 401),
				handler: async () => ({ maxRetries: 3 }),
			},
		};
		const merged = mergeErrorHandlers(builtin, caller);
		const entry = merged.AUTH_ERROR;
		if (!entry) throw new Error('AUTH_ERROR handler missing');
		const result = await entry.handler(apiError(401), NO_CONTEXT);
		expect(result.maxRetries).toBe(3);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('uses the caller DEFAULT when one is given', async () => {
		const caller: CorsairErrorHandler = {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		};
		const merged = mergeErrorHandlers(builtin, caller);
		const result = await merged.DEFAULT?.handler(apiError(418), NO_CONTEXT);
		expect(result).toMatchObject({ maxRetries: 9 });
	});
});

function statusIs(error: Error, status: number): boolean {
	return error instanceof ApiError && error.status === status;
}
