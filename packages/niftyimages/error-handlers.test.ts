import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { NiftyimagesAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

/** Mirrors corsair core: the first handler whose match() passes, in key order. */
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	const entry = errorHandlers[classify(error)] as ErrorHandlerAndMatchFunction;
	return entry.handler(error, {
		pluginId: 'niftyimages',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

describe('niftyimages error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = new NiftyimagesAPIError('429', { status: 429 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401, which is a bad key', async () => {
		const error = new NiftyimagesAPIError('401', { status: 401 });
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404 for a path that does not exist', async () => {
		const error = new NiftyimagesAPIError('404', {
			status: 404,
			htmlResponse: true,
		});
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('bad shape');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx, because every wrapped route is a read', async () => {
		const error = new NiftyimagesAPIError('500', { status: 500 });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls back to DEFAULT for a transport failure', () => {
		expect(classify(new Error('socket hang up'))).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps the caller keys first and DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		const names = Object.keys(merged);
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('uses the caller DEFAULT when both provide one', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
