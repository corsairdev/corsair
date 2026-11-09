import type { CorsairErrorHandler } from 'corsair/core';
import { InboxkitAPIError, InboxkitError } from './client';
import {
	errorHandlers,
	mergeErrorHandlers,
	outcomeUnknown,
	readRetryDelay,
	withReadRetries,
} from './error-handlers';
import { inboxkit } from './index';
import { API_KEY, jsonResponse, WORKSPACE } from './test-fixtures';
import { SPENDS_MONEY, TEST_ROUTES } from './test-routes';

const apiError = (status: number, retryAfter?: number) =>
	new InboxkitAPIError(`InboxKit ${status}`, { status, retryAfter });

describe('readRetryDelay', () => {
	it.each([
		['429 first', apiError(429), 1, 1000],
		['429 second', apiError(429), 2, 2000],
		['429 third gives up', apiError(429), 3, undefined],
		['429 honours a short wait', apiError(429, 3000), 1, 3000],
		['429 gives up on a long wait', apiError(429, 48_000), 1, undefined],
		['500 first', apiError(500), 1, 1000],
		['500 third gives up', apiError(500), 3, undefined],
		['timeout once', new InboxkitError('t', 'timeout'), 1, 1000],
		['timeout twice gives up', new InboxkitError('t', 'timeout'), 2, undefined],
		['network', new InboxkitError('n', 'network'), 1, 1000],
		['400', apiError(400), 1, undefined],
		['401', apiError(401), 1, undefined],
		['402', apiError(402), 1, undefined],
		['404', apiError(404), 1, undefined],
		['bad input', new InboxkitError('b', 'invalid_input'), 1, undefined],
		['anything else', new Error('other'), 1, undefined],
	])('%s', (_label, error, attempt, expected) => {
		expect(readRetryDelay(error, attempt)).toBe(expected);
	});
});

describe('withReadRetries', () => {
	it('returns once it succeeds', async () => {
		const send = jest
			.fn()
			.mockRejectedValueOnce(apiError(500))
			.mockResolvedValueOnce('done');
		const wait = jest.fn().mockResolvedValue(undefined);
		await expect(withReadRetries(send, wait)).resolves.toBe('done');
		expect(send).toHaveBeenCalledTimes(2);
		expect(wait).toHaveBeenCalledWith(1000);
	});

	it('stops at the limit and throws the last error', async () => {
		const send = jest.fn().mockRejectedValue(apiError(500));
		const wait = jest.fn().mockResolvedValue(undefined);
		await expect(withReadRetries(send, wait)).rejects.toMatchObject({
			status: 500,
		});
		expect(send).toHaveBeenCalledTimes(3);
	});
});

describe('outcomeUnknown', () => {
	it.each([
		['a 500', apiError(500), true],
		['a 502', apiError(502), true],
		['a timeout', new InboxkitError('t', 'timeout'), true],
		['a dropped connection', new InboxkitError('n', 'network'), true],
		['a 400', apiError(400), false],
		['a 402', apiError(402), false],
		['a 429', apiError(429), false],
		['bad input', new InboxkitError('b', 'invalid_input'), false],
		['any other error', new Error('other'), false],
	])('%s', (_label, error, expected) => {
		expect(outcomeUnknown(error)).toBe(expected);
	});
});

describe('nothing that is not a read is ever sent twice', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	// unknown: endpoints read ctx.key and ctx.options; the rest is the runtime's.
	const ctx = {
		key: API_KEY,
		options: { workspaceId: WORKSPACE },
		$getAccountId: async () => 'account',
	} as never;
	// unknown: a test double; the real types add nothing to this check.
	const endpoints = inboxkit({ key: API_KEY }).endpoints as unknown as Record<
		string,
		// unknown: each operation's arguments are checked by its own schema at run time.
		Record<string, (ctx: never, input?: unknown) => Promise<unknown>>
	>;
	const run = (route: (typeof TEST_ROUTES)[number]) => {
		const [group = '', name = ''] = route.operation.split('.');
		return (
			// unknown: a test double; the real types add nothing to this check.
			(
				endpoints[group]?.[name] as NonNullable<unknown> as (
					ctx: never,
					// unknown: a test double; the real types add nothing to this check.
					input?: unknown,
					// unknown: a test double; the real types add nothing to this check.
				) => Promise<unknown>
			)({ ...(ctx as object) } as never, { ...route.input })
		);
	};

	const spending = TEST_ROUTES.filter((route) =>
		SPENDS_MONEY.includes(route.operation),
	).map((route) => [route.operation, route] as const);

	const failures: Array<[string, () => Promise<Response> | Response]> = [
		['a 500', () => jsonResponse({ message: 'broken' }, 500)],
		['a 502', () => jsonResponse({ message: 'bad gateway' }, 502)],
		['a 429', () => jsonResponse({ message: 'slow down' }, 429)],
		[
			'a timeout',
			() =>
				Promise.reject(
					Object.assign(new Error('aborted'), { name: 'TimeoutError' }),
				),
		],
		[
			'a dropped connection',
			() => Promise.reject(new TypeError('fetch failed')),
		],
	];

	describe.each(failures)('after %s', (_label, answer) => {
		it.each(spending)('%s', async (_operation, route) => {
			fetchMock.mockImplementation(answer);
			await expect(run(route)).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('tells the caller a timed-out purchase may have gone through', async () => {
		fetchMock.mockRejectedValue(
			Object.assign(new Error('aborted'), { name: 'TimeoutError' }),
		);
		const route = TEST_ROUTES.find((row) => row.operation === 'mailboxes.buy');
		await expect(run(route as (typeof TEST_ROUTES)[number])).rejects.toThrow(
			'may still have gone through',
		);
	});

	it('does not say so of a plain refusal', async () => {
		fetchMock.mockResolvedValue(jsonResponse({ message: 'No credits' }, 402));
		const route = TEST_ROUTES.find((row) => row.operation === 'mailboxes.buy');
		const error = await run(route as (typeof TEST_ROUTES)[number]).catch(
			(caught: Error) => caught,
		);
		expect((error as Error).message).not.toContain(
			'may still have gone through',
		);
	});

	it('retries a read that hit a 500', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ message: 'broken' }, 500))
			.mockResolvedValueOnce(jsonResponse({ uid: 'team' }));
		await expect(endpoints.account?.get?.(ctx, {})).resolves.toMatchObject({
			uid: 'team',
		});
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('errorHandlers', () => {
	it('never asks Corsair to retry, whatever the error', async () => {
		for (const handler of Object.values(errorHandlers)) {
			await expect(handler.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('names each kind of error', () => {
		const first = (error: Error) =>
			Object.entries(errorHandlers).find(([, entry]) =>
				// unknown: a test double; the real types add nothing to this check.
				(entry.match as unknown as (caught: Error) => boolean)(error),
			)?.[0];
		expect(first(apiError(400))).toBe('INBOXKIT_VALIDATION');
		expect(first(apiError(401))).toBe('INBOXKIT_AUTH');
		expect(first(apiError(402))).toBe('INBOXKIT_PAYMENT');
		expect(first(apiError(403))).toBe('INBOXKIT_PERMISSION');
		expect(first(apiError(404))).toBe('INBOXKIT_NOT_FOUND');
		expect(first(apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(first(apiError(500))).toBe('INBOXKIT_SERVER');
		expect(first(new InboxkitError('t', 'timeout'))).toBe('INBOXKIT_TIMEOUT');
		expect(first(new InboxkitError('n', 'network'))).toBe('INBOXKIT_NETWORK');
		expect(first(new InboxkitError('w', 'workspace_required'))).toBe(
			'INBOXKIT_VALIDATION',
		);
		expect(first(new InboxkitError('k', 'invalid_key'))).toBe('INBOXKIT_AUTH');
		expect(first(new Error('anything'))).toBe('INBOXKIT_FALLBACK');
	});
});

describe('mergeErrorHandlers', () => {
	const custom = {
		match: () => false,
		handler: async () => ({ maxRetries: 0 }),
	};

	it('returns the built-ins when the caller has none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts the caller’s handlers first and the catch-all last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MINE: custom,
		} as CorsairErrorHandler);
		const names = Object.keys(merged);
		expect(names[0]).toBe('MINE');
		expect(names.at(-1)).toBe('INBOXKIT_FALLBACK');
	});

	it('lets a caller DEFAULT replace the catch-all', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: custom,
		} as CorsairErrorHandler);
		expect(merged.INBOXKIT_FALLBACK).toBe(custom);
		expect(Object.keys(merged)).not.toContain('DEFAULT');
	});
});
