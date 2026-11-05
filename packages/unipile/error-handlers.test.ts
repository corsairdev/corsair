import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { UnipileAPIError } from './client';
import {
	errorHandlers,
	isLinkedInLimitError,
	MAX_RETRY_AFTER_MS,
	mergeErrorHandlers,
} from './error-handlers';
import { problem } from './test-fixtures';

function context(operation: string, error: Error): ErrorContext {
	return { pluginId: 'unipile', operation, input: {}, originalError: error };
}

function entry(handlers: CorsairErrorHandler, name: string) {
	const found = handlers[name];
	if (!found) throw new Error(`missing handler ${name}`);
	return found;
}

// Mirrors corsair core (handleCorsairError): the first handler whose match()
// passes, in key order, else DEFAULT.
function classify(
	error: Error,
	operation = 'chats.list',
	handlers: CorsairErrorHandler = errorHandlers,
): string {
	return (
		Object.keys(handlers).find((key) =>
			entry(handlers, key).match(error, context(operation, error)),
		) ?? 'DEFAULT'
	);
}

async function strategy(
	error: Error,
	operation: string,
	handlers: CorsairErrorHandler = errorHandlers,
) {
	return entry(handlers, classify(error, operation, handlers)).handler(
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

function abortError() {
	const cause = new Error('This operation was aborted');
	cause.name = 'AbortError';
	return new UnipileAPIError(cause.message, { cause });
}

function networkError() {
	const cause = new TypeError('fetch failed');
	return new UnipileAPIError(cause.message, { cause });
}

const RETRY_READ = {
	maxRetries: 2,
	retryStrategy: 'exponential_backoff_jitter',
};
const NO_RETRY = { maxRetries: 0 };

const SENDS = [
	'messages.send',
	'chats.start',
	'relationRequests.create',
	'inboxes.startChat',
	'messages.forward',
	'emails.send',
	'drafts.send',
	'posts.create',
	'posts.addComment',
	'posts.replyToComment',
	'linkedin.inviteToFollowCompany',
	'linkedin.request',
];
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
	'accounts.list',
	'emails.list',
	'calendarEvents.list',
	'inboxes.listChats',
];
const PROFILE_VIEWS = [
	'users.getProfile',
	'users.visitProfile',
	'posts.get',
	'linkedin.getCompany',
	'linkedin.searchPeople',
	'salesNavigator.searchPeople',
];

const TRANSIENT: Array<[string, () => Error]> = [
	['500 api/internal_error', () => apiError(500, 'api/internal_error')],
	['502 provider/server_error', () => apiError(502, 'provider/server_error')],
	['502 api/proxy_error', () => apiError(502, 'api/proxy_error')],
	['503 without a body', () => apiError(503)],
	['504 provider/timeout', () => apiError(504, 'provider/timeout')],
	['504 api/proxy_timeout', () => apiError(504, 'api/proxy_timeout')],
	['a client timeout', timeoutError],
	['a dropped connection', networkError],
];

describe('Unipile error handlers: handler keys', () => {
	it('prefixes every handler and keeps the catch-all last', () => {
		const names = Object.keys(errorHandlers);
		expect(names.at(-1)).toBe('DEFAULT');
		for (const name of names.slice(0, -1)) {
			expect(name).toMatch(/^UNIPILE_/);
		}
	});

	it('gives the same answer from the catch-all as from the ordered rules', async () => {
		// A root-level DEFAULT sits first in corsair's merged order, so the
		// plugin's DEFAULT can run before its own UNIPILE_ rules.
		const catchAll = entry(errorHandlers, 'DEFAULT');
		const cases: Array<[Error, string]> = [
			[apiError(502, 'provider/server_error'), 'chats.list'],
			[apiError(502, 'provider/server_error'), 'messages.send'],
			[
				apiError(429, 'provider/too_many_requests', undefined, 1000),
				'chats.list',
			],
			[
				apiError(429, 'api/too_many_requests', undefined, 2000),
				'messages.send',
			],
			[timeoutError(), 'users.getProfile'],
			[new Error('something unexpected'), 'chats.list'],
		];
		for (const [error, op] of cases) {
			expect(await catchAll.handler(error, context(op, error))).toEqual(
				await strategy(error, op),
			);
		}
	});

	it('runs caller handlers after the built-ins and their DEFAULT last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: (error) => error.message === 'quota',
				handler: async () => ({ maxRetries: 4 }),
			},
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 1 }) },
		});
		const names = Object.keys(merged);
		expect(names[0]).toBe('UNIPILE_LINKEDIN_LIMIT');
		expect(names.at(-2)).toBe('QUOTA_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');

		const catchAll = entry(merged, 'DEFAULT');
		const quota = new Error('quota');
		expect(await catchAll.handler(quota, context('chats.list', quota))).toEqual(
			{
				maxRetries: 4,
			},
		);
		const other = new Error('other');
		expect(await catchAll.handler(other, context('chats.list', other))).toEqual(
			{
				maxRetries: 1,
			},
		);
		const send502 = apiError(502, 'provider/server_error');
		expect(
			await catchAll.handler(send502, context('messages.send', send502)),
		).toEqual(NO_RETRY);
	});
});

describe('Unipile error handlers: sends are never replayed blindly', () => {
	it.each(
		SENDS.flatMap((op) =>
			TRANSIENT.map(([label, make]) => [op, label, make] as const),
		),
	)('%s is not retried after %s', async (operation, _label, make) => {
		expect(await strategy(make(), operation)).toEqual(NO_RETRY);
	});

	it.each(OTHER_WRITES)(
		'%s is not retried after a 502 or timeout',
		async (op) => {
			expect(
				await strategy(apiError(502, 'provider/server_error'), op),
			).toEqual(NO_RETRY);
			expect(await strategy(timeoutError(), op)).toEqual(NO_RETRY);
		},
	);

	it.each(READS)(
		'%s is retried after a 5xx, timeout or dropped connection',
		async (op) => {
			for (const [, make] of TRANSIENT) {
				expect(await strategy(make(), op)).toEqual(RETRY_READ);
			}
		},
	);

	it.each([...READS, ...SENDS])(
		'%s is not retried after the caller aborts',
		async (op) => {
			const error = abortError();
			expect(classify(error, op)).toBe('DEFAULT');
			expect(await strategy(error, op)).toEqual(NO_RETRY);
		},
	);
});

describe('Unipile error handlers: LinkedIn budget calls', () => {
	it.each(PROFILE_VIEWS)(
		'%s is not retried after a timeout or 5xx',
		async (op) => {
			for (const [, make] of TRANSIENT) {
				expect(await strategy(make(), op)).toEqual(NO_RETRY);
			}
		},
	);

	it.each(PROFILE_VIEWS)(
		'%s is retried only when Unipile itself refused it with Retry-After',
		async (op) => {
			expect(
				await strategy(
					apiError(429, 'api/too_many_requests', undefined, 5000),
					op,
				),
			).toEqual({ maxRetries: 2, headersRetryAfterMs: 5000 });
			expect(
				await strategy(apiError(429, 'api/too_many_requests'), op),
			).toEqual(NO_RETRY);
			expect(
				await strategy(apiError(429, undefined, undefined, 5000), op),
			).toEqual(NO_RETRY);
		},
	);
});

describe('Unipile error handlers: rate limits', () => {
	it('replays a send that Unipile stopped, after Retry-After', async () => {
		const error = apiError(429, 'api/too_many_requests', undefined, 18_000);
		expect(classify(error, 'messages.send')).toBe('UNIPILE_RATE_LIMIT');
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
		expect(await strategy(error, 'relationRequests.create')).toEqual(NO_RETRY);
		expect(await strategy(error, 'chats.list')).toEqual(NO_RETRY);
	});

	it('never replays a LinkedIn (provider) 429', async () => {
		const error = apiError(429, 'provider/too_many_requests', undefined, 1000);
		for (const op of [...SENDS, ...READS, ...PROFILE_VIEWS]) {
			expect(classify(error, op)).toBe('UNIPILE_LINKEDIN_LIMIT');
			expect(await strategy(error, op)).toEqual(NO_RETRY);
		}
	});

	it('replays an untyped 429 only for reads', async () => {
		const error = apiError(429, undefined, undefined, 2000);
		expect(await strategy(error, 'chats.list')).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2000,
		});
		expect(await strategy(error, 'messages.send')).toEqual(NO_RETRY);
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
			'You have reached the weekly invitation limit.',
		],
		[403, 'provider/insufficient_permissions', 'Too many pending invitations.'],
		[422, 'provider/unprocessable_entity', 'Invitation limit exceeded.'],
		[
			422,
			'provider/unprocessable_entity',
			'Custom note limit reached for this month.',
		],
	])('treats %i %s "%s" as a LinkedIn limit', async (status, type, detail) => {
		const error = apiError(status, type, detail);
		expect(isLinkedInLimitError(error)).toBe(true);
		expect(classify(error, 'relationRequests.create')).toBe(
			'UNIPILE_LINKEDIN_LIMIT',
		);
		expect(await strategy(error, 'relationRequests.create')).toEqual(NO_RETRY);
	});

	it.each([
		[400, 'provider/invalid_parameters', 'Message length exceeded.'],
		[
			403,
			'provider/insufficient_permissions',
			'You are not allowed to send InMail to this user.',
		],
		[422, 'provider/unprocessable_entity', 'Quota exceeded for attachments.'],
		[400, 'provider/invalid_parameters', 'Too many recipients.'],
		[400, 'provider/invalid_parameters', 'limit must be a positive integer'],
		[400, 'api/invalid_parameters', 'querystring/limit must be <= 100'],
		[
			422,
			'api/invalid_parameters',
			'You can not resend an invitation to this user yet.',
		],
	])(
		'does not treat %i %s "%s" as a LinkedIn limit',
		(status, type, detail) => {
			expect(isLinkedInLimitError(apiError(status, type, detail))).toBe(false);
		},
	);

	it('ignores errors that are not Unipile errors', () => {
		expect(isLinkedInLimitError(new Error('weekly invitation limit'))).toBe(
			false,
		);
		expect(isLinkedInLimitError('weekly invitation limit')).toBe(false);
	});
});

describe('Unipile error handlers: client errors', () => {
	it.each([
		[401, 'api/missing_authorization', 'UNIPILE_AUTH'],
		[401, 'provider/invalid_authorization', 'UNIPILE_AUTH'],
		[403, 'api/inactive_subscription', 'UNIPILE_PERMISSION'],
		// Seen live: an Account API Key calling webhookEndpoints.create.
		[403, 'api/insufficient_permissions', 'UNIPILE_PERMISSION'],
		[403, 'provider/insufficient_permissions', 'UNIPILE_PERMISSION'],
		[404, 'provider/resource_not_found', 'UNIPILE_NOT_FOUND'],
		[409, 'provider/conflict', 'UNIPILE_CONFLICT'],
		[400, 'api/invalid_parameters', 'UNIPILE_VALIDATION'],
		[400, 'provider/invalid_parameters', 'UNIPILE_VALIDATION'],
		[405, 'provider/method_not_allowed', 'UNIPILE_VALIDATION'],
		[415, 'provider/invalid_file', 'UNIPILE_VALIDATION'],
		[422, 'provider/unprocessable_entity', 'UNIPILE_VALIDATION'],
		[501, 'api/not_implemented', 'UNIPILE_VALIDATION'],
	])('does not retry %i %s', async (status, type, name) => {
		const error = apiError(status, type, 'details');
		expect(classify(error)).toBe(name);
		expect(await strategy(error, 'chats.list')).toEqual(NO_RETRY);
	});

	it('does not retry input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('UNIPILE_VALIDATION');
		expect(await strategy(error, 'chats.list')).toEqual(NO_RETRY);
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error, 'chats.list')).toEqual(NO_RETRY);
	});
});
