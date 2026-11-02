import type { ErrorContext } from 'corsair/core';
import { z } from 'zod';
import { ZohoDeskAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { errorBody } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

function context(error: Error, operation = 'tickets.list'): ErrorContext {
	return { pluginId: 'zohodesk', operation, input: {}, originalError: error };
}

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

function strategy(error: Error, operation?: string) {
	return errorHandlers[classify(error)].handler(
		error,
		context(error, operation),
	);
}

function failure(status: number, code?: string, retryAfter?: number) {
	return new ZohoDeskAPIError(`Zoho Desk ${status}`, {
		status,
		retryAfter,
		body: code ? errorBody(code) : undefined,
	});
}

beforeEach(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Zoho Desk error classification', () => {
	it.each<[string, Error, HandlerName]>([
		['a bare 429', failure(429), 'RATE_LIMIT_ERROR'],
		['credit limit', failure(429, 'THRESHOLD_EXCEEDED'), 'RATE_LIMIT_ERROR'],
		['concurrency', failure(429, 'TOO_MANY_REQUESTS'), 'RATE_LIMIT_ERROR'],
		[
			'a rate code on a 503',
			failure(503, 'TOO_MANY_REQUESTS'),
			'RATE_LIMIT_ERROR',
		],
		['an expired token', failure(401, 'INVALID_OAUTH'), 'AUTH_ERROR'],
		['a bad token', failure(401, 'UNAUTHORIZED'), 'AUTH_ERROR'],
		['a bare 401', failure(401), 'AUTH_ERROR'],
		['a missing scope', failure(401, 'SCOPE_MISMATCH'), 'PERMISSION_ERROR'],
		['the wrong org', failure(401, 'OAUTH_ORG_MISMATCH'), 'PERMISSION_ERROR'],
		['forbidden', failure(403, 'FORBIDDEN'), 'PERMISSION_ERROR'],
		[
			'an edition limit',
			failure(403, 'LICENSE_ACCESS_LIMITED'),
			'PERMISSION_ERROR',
		],
		['a bare 403', failure(403), 'PERMISSION_ERROR'],
		['not found', failure(404, 'URL_NOT_FOUND'), 'NOT_FOUND_ERROR'],
		['bad request', failure(400), 'VALIDATION_ERROR'],
		['too large', failure(413, 'RESOURCE_SIZE_EXCEEDED'), 'VALIDATION_ERROR'],
		[
			'bad media type',
			failure(415, 'UNSUPPORTED_MEDIA_TYPE'),
			'VALIDATION_ERROR',
		],
		['invalid data', failure(422, 'INVALID_DATA'), 'VALIDATION_ERROR'],
		['server error', failure(500, 'INTERNAL_SERVER_ERROR'), 'SERVER_ERROR'],
		['bad gateway', failure(502), 'SERVER_ERROR'],
		['a network failure', new ZohoDeskAPIError('fetch failed'), 'SERVER_ERROR'],
		['anything else', new Error('boom'), 'DEFAULT'],
	])('files %s under the right handler', (_name, error, expected) => {
		expect(classify(error)).toBe(expected);
	});

	it('treats a zod failure as a validation error', () => {
		const { error } = z.string().safeParse(1);
		expect(error && classify(error)).toBe('VALIDATION_ERROR');
	});
});

describe('Zoho Desk retry strategy', () => {
	it('backs off when the concurrency limit gives no Retry-After', async () => {
		await expect(strategy(failure(429, 'TOO_MANY_REQUESTS'))).resolves.toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('waits out a short Retry-After once', async () => {
		await expect(
			strategy(failure(429, 'THRESHOLD_EXCEEDED', 34_000)),
		).resolves.toEqual({ maxRetries: 1, headersRetryAfterMs: 34_000 });
	});

	it('waits a full minute at most', async () => {
		await expect(strategy(failure(429, undefined, 60_000))).resolves.toEqual({
			maxRetries: 1,
			headersRetryAfterMs: 60_000,
		});
	});

	it('does not hold a call open until the daily credits come back', async () => {
		await expect(
			strategy(failure(429, 'THRESHOLD_EXCEEDED', 60_001)),
		).resolves.toEqual({ maxRetries: 0 });
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Daily API credits used up, retry in 61s'),
		);
	});

	it('retries a rate limit on a write, since Zoho refused it outright', async () => {
		await expect(
			strategy(failure(429, 'TOO_MANY_REQUESTS'), 'tasks.updateMany'),
		).resolves.toMatchObject({ maxRetries: 5 });
	});

	it('retries a 5xx on a read', async () => {
		await expect(strategy(failure(500))).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a read after a lost connection', async () => {
		await expect(
			strategy(new ZohoDeskAPIError('fetch failed')),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['tasks.updateMany', 'departments.uploadLogo'])(
		'does not repeat %s after a lost connection, which may have landed',
		async (operation) => {
			await expect(
				strategy(new ZohoDeskAPIError('fetch failed'), operation),
			).resolves.toEqual({ maxRetries: 0 });
		},
	);

	it.each(['tasks.updateMany', 'departments.uploadLogo'])(
		'does not repeat %s after a 5xx, which may have landed',
		async (operation) => {
			await expect(strategy(failure(500), operation)).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each<[string, Error]>([
		['an auth failure', failure(401, 'INVALID_OAUTH')],
		['a permission failure', failure(403, 'FORBIDDEN')],
		['a missing resource', failure(404, 'URL_NOT_FOUND')],
		['invalid input', failure(422, 'INVALID_DATA')],
		['an unknown failure', new Error('boom')],
	])('does not retry %s', async (_name, error) => {
		await expect(strategy(error)).resolves.toEqual({ maxRetries: 0 });
	});
});
