import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { BAD_KEY_BODY, VALIDATION_BODY } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

const context = (error: Error) =>
	({
		pluginId: 'loomio',
		operation: 'groups.list',
		input: {},
		originalError: error,
	}) satisfies ErrorContext;

// Mirrors corsair core: the first handler whose match() passes, in key order.
const handlers = errorHandlers as CorsairErrorHandler;

function classify(error: Error): HandlerName {
	const name = (Object.keys(handlers) as HandlerName[]).find((key) =>
		handlers[key]?.match(error, context(error)),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	const handler = handlers[classify(error)]?.handler;
	if (!handler) throw new Error('DEFAULT should always match');
	return handler(error, context(error));
}

function apiError(
	status: number,
	// unknown: each case passes one of Loomio's error bodies.
	body: unknown = {},
	method = 'GET',
) {
	return new ApiError(
		{ method: method as 'GET', url: '/groups' },
		{
			url: 'https://www.loomio.com/api/user0/groups',
			ok: false,
			status,
			statusText: '',
			body,
		},
		`Loomio ${status}`,
	);
}

describe('Loomio error handlers', () => {
	it('leaves 429 retries to core', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([401, 403])(
		'does not retry a %s (bad key or permission)',
		async (status) => {
			const error = apiError(status, BAD_KEY_BODY);
			expect(classify(error)).toBe('AUTH_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('does not retry a 404', async () => {
		const error = apiError(404, { error: 404 });
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([
		['400 missing parameter', apiError(400, { error: 400 })],
		['422 field errors', apiError(422, VALIDATION_BODY)],
	])('does not retry %s', async (_name, error) => {
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('replays a 5xx on reads and falls through to DEFAULT for writes', async () => {
		const read = apiError(502);
		expect(classify(read)).toBe('SERVER_ERROR');
		expect(await strategy(read)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		for (const method of ['POST', 'PATCH', 'DELETE']) {
			const write = apiError(502, {}, method);
			expect(classify(write)).toBe('DEFAULT');
			expect(await strategy(write)).toEqual({ maxRetries: 0 });
		}
	});

	it('treats a ZodError as a validation error', () => {
		const error = new Error('bad body');
		Object.defineProperty(error, 'name', { value: 'ZodError' });
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('sends a transport failure to DEFAULT with no replay', async () => {
		const error = new TypeError('fetch failed');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers as CorsairErrorHandler;

	it('keeps DEFAULT last for builtins alone', () => {
		expect(Object.keys(builtin).at(-1)).toBe('DEFAULT');
	});

	it('puts a caller handler before DEFAULT', () => {
		const merged = mergeErrorHandlers(builtin, {
			CONFLICT_ERROR: {
				match: (error: Error) => error.message.includes('conflict'),
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		const conflict = new Error('a conflict');
		const mergedName = names.find((key) =>
			merged[key]?.match(conflict, context(conflict)),
		);
		expect(mergedName).toBe('CONFLICT_ERROR');
	});

	it('lets a caller override a builtin slot and DEFAULT', async () => {
		const merged = mergeErrorHandlers(builtin, {
			AUTH_ERROR: {
				match: (error: Error) => error.message.includes('auth'),
				handler: async () => ({ maxRetries: 1 }),
			},
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		const authError = new Error('an auth problem');
		expect(merged.AUTH_ERROR?.match(authError, context(authError))).toBe(true);
		await expect(
			merged.DEFAULT?.handler(authError, context(authError)),
		).resolves.toEqual({ maxRetries: 9 });
	});
});
