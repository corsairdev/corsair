import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { UnipileAPIError } from './client';
import {
	errorHandlers,
	isLinkedInLimitError,
	MAX_RETRY_AFTER_MS,
} from './error-handlers';
import { problem } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// The core signature: every matcher and handler receives (error, context).
const handlers: CorsairErrorHandler = errorHandlers;

function entry(name: HandlerName) {
	const found = handlers[name];
	if (!found) throw new Error(`missing handler ${name}`);
	return found;
}

function context(operation: string, error: Error): ErrorContext {
	return { pluginId: 'unipile', operation, input: {}, originalError: error };
}

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error, operation = 'chats.list'): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		entry(key).match(error, context(operation, error)),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error, operation: string) {
	return entry(classify(error, operation)).handler(
		error,
		context(operation, error),
	);
}

function apiError(
	status: number,
	type?: string,
	detail?: string,
	retryAfter?: number,
) {
	return new UnipileAPIError(`Unipile ${status}`, {
		status,
		retryAfter,
		body: type ? problem(status, type, 'Error', detail) : undefined,
	});
}

function timeoutError() {
	const cause = new Error('The operation was aborted due to timeout');
	cause.name = 'TimeoutError';
	return new UnipileAPIError(cause.message, { cause });
}

function networkError() {
	const cause = new TypeError('fetch failed');
	return new UnipileAPIError(cause.message, { cause });
}

const SENDS = ['messages.send', 'chats.start', 'relationRequests.create'];
const OTHER_WRITES = [
	'accounts.createAuthLink',
	'users.visitProfile',
	'relationRequests.accept',
	'relationRequests.cancel',
	'accounts.remove',
	'webhookEndpoints.create',
	'webhookEndpoints.update',
	'webhookEndpoints.delete',
];
const READS = [
	'chats.list',
	'messages.list',
	'users.getProfile',
	'accounts.list',
];

describe('Unipile error handlers: sends are never replayed blindly', () => {
	const failures: Array<[string, () => Error]> = [
		['500 api/internal_error', () => apiError(500, 'api/internal_error')],
		['502 provider/server_error', () => apiError(502, 'provider/server_error')],
		['502 api/proxy_error', () => apiError(502, 'api/proxy_error')],
		['503 without a body', () => apiError(503)],
		['504 provider/timeout', () => apiError(504, 'provider/timeout')],
		['504 api/proxy_timeout', () => apiError(504, 'api/proxy_timeout')],
		['a client timeout', timeoutError],
		['a dropped connection', networkError],
	];

	it.each(
		SENDS.flatMap((op) =>
			failures.map(([label, make]) => [op, label, make] as const),
		),
	)('%s is not retried after %s', async (operation, _label, make) => {
		expect(await strategy(make(), operation)).toEqual({ maxRetries: 0 });
	});

	it.each(OTHER_WRITES)(
		'%s is not retried after a 502 or timeout',
		async (op) => {
			expect(
				await strategy(apiError(502, 'provider/server_error'), op),
			).toEqual({
				maxRetries: 0,
			});
			expect(await strategy(timeoutError(), op)).toEqual({ maxRetries: 0 });
		},
	);

	it.each(READS)(
		'%s is retried after a 5xx, timeout or dropped connection',
		async (op) => {
			const retry = {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff_jitter',
			};
			expect(await strategy(apiError(500, 'api/internal_error'), op)).toEqual(
				retry,
			);
			expect(
				await strategy(apiError(502, 'provider/server_error'), op),
			).toEqual(retry);
			expect(await strategy(apiError(504, 'provider/timeout'), op)).toEqual(
				retry,
			);
			expect(await strategy(timeoutError(), op)).toEqual(retry);
			expect(await strategy(networkError(), op)).toEqual(retry);
		},
	);
});

describe('Unipile error handlers: rate limits', () => {
	it('replays a send that Unipile stopped, after Retry-After', async () => {
		const error = apiError(429, 'api/too_many_requests', undefined, 18_000);
		expect(classify(error, 'messages.send')).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error, 'messages.send')).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 18_000,
		});
	});

	it('surfaces a Unipile 429 whose window is longer than a minute', async () => {
		const error = apiError(
			429,
			'api/too_many_requests',
			undefined,
			MAX_RETRY_AFTER_MS + 1,
		);
		expect(await strategy(error, 'relationRequests.create')).toEqual({
			maxRetries: 0,
		});
		expect(await strategy(error, 'chats.list')).toEqual({ maxRetries: 0 });
	});

	it('never replays a LinkedIn (provider) 429', async () => {
		const error = apiError(429, 'provider/too_many_requests', undefined, 1000);
		for (const op of [...SENDS, ...READS]) {
			expect(classify(error, op)).toBe('LINKEDIN_LIMIT_ERROR');
			expect(await strategy(error, op)).toEqual({ maxRetries: 0 });
		}
	});

	it('replays an untyped 429 only for reads', async () => {
		const error = apiError(429, undefined, undefined, 2000);
		expect(await strategy(error, 'chats.list')).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2000,
		});
		expect(await strategy(error, 'messages.send')).toEqual({ maxRetries: 0 });
	});
});

describe('Unipile error handlers: LinkedIn limits', () => {
	it.each([
		[
			422,
			'provider/unprocessable_entity',
			'You can not resend an invitation to this user yet.',
		],
		[422, 'provider/unprocessable_entity', 'Weekly invitation limit reached.'],
		[
			400,
			'provider/invalid_parameters',
			'You have exceeded the number of invitations with a note.',
		],
		[403, 'provider/insufficient_permissions', 'Too many pending invitations.'],
	])('treats %i %s "%s" as a LinkedIn limit', async (status, type, detail) => {
		const error = apiError(status, type, detail);
		expect(isLinkedInLimitError(error)).toBe(true);
		expect(classify(error, 'relationRequests.create')).toBe(
			'LINKEDIN_LIMIT_ERROR',
		);
		expect(await strategy(error, 'relationRequests.create')).toEqual({
			maxRetries: 0,
		});
	});

	it('does not mistake a bad limit parameter for a LinkedIn quota', () => {
		const error = apiError(
			400,
			'api/invalid_parameters',
			'querystring/limit must be <= 100',
		);
		expect(isLinkedInLimitError(error)).toBe(false);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		const providerParam = apiError(
			400,
			'provider/invalid_parameters',
			'limit must be a positive integer',
		);
		expect(isLinkedInLimitError(providerParam)).toBe(false);
	});

	it('ignores errors that are not Unipile errors', () => {
		expect(isLinkedInLimitError(new Error('weekly limit'))).toBe(false);
		expect(isLinkedInLimitError('weekly limit')).toBe(false);
	});
});

describe('Unipile error handlers: client errors', () => {
	it.each([
		[401, 'api/missing_authorization', 'AUTH_ERROR'],
		[401, 'provider/invalid_authorization', 'AUTH_ERROR'],
		[403, 'api/inactive_subscription', 'PERMISSION_ERROR'],
		// Seen live: an Account API Key calling webhookEndpoints.create.
		[403, 'api/insufficient_permissions', 'PERMISSION_ERROR'],
		[404, 'provider/resource_not_found', 'NOT_FOUND_ERROR'],
		[409, 'provider/conflict', 'CONFLICT_ERROR'],
		[400, 'api/invalid_parameters', 'VALIDATION_ERROR'],
		[405, 'provider/method_not_allowed', 'VALIDATION_ERROR'],
		[415, 'provider/invalid_file', 'VALIDATION_ERROR'],
		[422, 'provider/unprocessable_entity', 'VALIDATION_ERROR'],
		[501, 'api/not_implemented', 'VALIDATION_ERROR'],
	])('does not retry %i %s', async (status, type, name) => {
		const error = apiError(status, type, 'details');
		expect(classify(error)).toBe(name);
		expect(await strategy(error, 'chats.list')).toEqual({ maxRetries: 0 });
	});

	it('does not retry input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error, 'chats.list')).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error, 'chats.list')).toEqual({ maxRetries: 0 });
	});
});
