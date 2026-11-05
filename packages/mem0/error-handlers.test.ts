import type { CorsairErrorHandler } from 'corsair/core';
import { ZodError } from 'zod';
import { Mem0APIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { Mem0APIError as Exported } from './index';
import {
	badRequest,
	memoryNotFound,
	rateLimited,
	serverError,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'm0-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function apiError(
	status: number,
	body: unknown,
	method: 'GET' | 'POST' | 'DELETE' = 'GET',
	headers: Record<string, string> = {},
): Promise<Mem0APIError> {
	const { makeMem0Request } = await import('./client');
	respond(body, status, headers);
	const error = await makeMem0Request(API_KEY, {
		method,
		path: '/v1/memories/ea925981/',
	}).catch((e: unknown) => e);
	expect(error).toBeInstanceOf(Exported);
	return error as Mem0APIError;
}

// Core calls match and handler with an error context; the literals here only
// declare the first parameter, so widen them before calling.
type WiredHandler = NonNullable<CorsairErrorHandler[string]>;

function wired(handlers: CorsairErrorHandler): WiredHandler[] {
	return Object.values(handlers).filter(
		(entry): entry is WiredHandler => entry !== undefined,
	);
}

// unknown: a test supplies only the context fields a matcher reads.
async function decide(error: Error, context?: unknown) {
	const sent = (context ?? {}) as never;
	const handler = wired(errorHandlers).find((entry) =>
		entry.match(error, sent),
	);
	expect(handler).toBeDefined();
	if (!handler) throw new Error('no handler matched');
	return handler.handler(error, sent);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('errorHandlers', () => {
	it('retries a 429 with backoff and honours Retry-After', async () => {
		const error = await apiError(429, rateLimited, 'POST', {
			'Retry-After': '2',
		});

		const result = await decide(error);
		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401 or a 403', async () => {
		const unauthorizedError = await apiError(401, unauthorized);
		expect(await decide(unauthorizedError)).toEqual({ maxRetries: 0 });

		const forbiddenError = await apiError(403, {
			error: "You don't have access to this project",
		});
		expect(await decide(forbiddenError)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400, 404, 409 or 422', async () => {
		for (const status of [400, 404, 409, 422]) {
			const error = await apiError(status, badRequest('rejected'));
			expect(await decide(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('does not retry a 413 quota error', async () => {
		const error = await apiError(413, {
			error: 'Usage limit reached for this month',
		});
		expect(await decide(error)).toEqual({ maxRetries: 0 });
	});

	it('routes a ZodError to the validation handler', async () => {
		const error = new ZodError([
			{
				code: 'custom',
				message: 'Messages are required.',
				path: ['messages'],
			},
		]);

		expect(await decide(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 5xx read twice', async () => {
		const error = await apiError(500, serverError, 'GET');
		expect(await decide(error)).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 5xx on a POST read such as search or list', async () => {
		const searchError = await apiError(500, serverError, 'POST');
		expect(
			await decide(searchError, { operation: 'memories.search' } as never),
		).toMatchObject({ maxRetries: 2 });

		const listError = await apiError(500, serverError, 'POST');
		expect(
			await decide(listError, { operation: 'memories.list' } as never),
		).toMatchObject({ maxRetries: 2 });
	});

	it('does not retry a 5xx on a POST write', async () => {
		const addError = await apiError(500, serverError, 'POST');
		expect(
			await decide(addError, { operation: 'memories.add' } as never),
		).toEqual({ maxRetries: 0 });

		const deleteAllError = await apiError(500, serverError, 'DELETE');
		expect(
			await decide(deleteAllError, {
				operation: 'memories.deleteAll',
			} as never),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 5xx when no operation is supplied', async () => {
		const bareError = await apiError(500, serverError, 'POST');
		expect(await decide(bareError)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a 5xx write, which may have gone through', async () => {
		const error = await apiError(500, serverError, 'POST');
		expect(await decide(error)).toEqual({ maxRetries: 0 });
	});

	it('does not treat a 404 as a rate limit', async () => {
		const error = await apiError(404, memoryNotFound);
		expect(error.isRateLimit).toBe(false);
	});

	it('keeps DEFAULT last so an unmatched error does not retry', async () => {
		const keys = Object.keys(errorHandlers);
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(await decide(new Error('something else'))).toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin handlers when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: {
				match: () => false,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a user handler win over an overlapping builtin match', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			NO_RETRIES_ON_LIMIT: {
				match: (error: Error) =>
					error instanceof Mem0APIError && error.isRateLimit,
				handler: async () => ({ maxRetries: 0 }),
			},
		} as CorsairErrorHandler);

		const error = await apiError(429, rateLimited, 'POST');
		const matched = wired(merged).find((entry) =>
			entry.match(error, {} as never),
		);
		expect(matched).toBeDefined();
		if (!matched) throw new Error('no handler matched');
		expect(await matched.handler(error, {} as never)).toEqual({
			maxRetries: 0,
		});
	});

	it('uses the user DEFAULT when one is supplied', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		const fallback = merged.DEFAULT;
		if (!fallback) throw new Error('DEFAULT is missing');
		expect(await fallback.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 1,
		});
	});
});
