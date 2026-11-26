import * as core from 'corsair/core';
import type { LinkhutContext } from './index';

const TEST_API_KEY = 'linkhut-test-token';
const TEST_ACCOUNT_ID = 'linkhut-test-account';

/** A context the endpoints accept, plus `log`, the mock they log through. */
export type LinkhutTestContext = LinkhutContext & { log: jest.Mock };

export type LinkhutTestContextOverrides = {
	/** The API key the endpoints send. `'linkhut-test-token'` by default. */
	key?: string;
	/** A mock the endpoints log through, instead of a fresh one. */
	log?: jest.Mock;
};

/** What `mockFetchResponse` and `mockFetchRejection` return: the installed fetch. */
export type FetchMock = jest.Mock<Promise<Response>, Parameters<typeof fetch>>;

let installedLog: jest.SpyInstance | undefined;
let installedFetch: FetchMock | undefined;

function useLog(override: jest.Mock | undefined): jest.Mock {
	// Undo the spy an earlier createTestContext() installed, so two never stack.
	if (installedLog && Object.is(core.logEventFromContext, installedLog)) {
		installedLog.mockRestore();
	}
	installedLog = undefined;
	const current = core.logEventFromContext;
	// A test file that mocks 'corsair/core' already routes logging to its own
	// mock. Reuse it rather than spy over it.
	const log =
		override ??
		(jest.isMockFunction(current)
			? current
			: jest.fn().mockResolvedValue('evt'));
	if (current !== log) {
		installedLog = jest
			.spyOn(core, 'logEventFromContext')
			.mockImplementation(log);
	}
	return log;
}

function installFetch(
	respond: (...args: Parameters<typeof fetch>) => Promise<Response>,
): FetchMock {
	// Reuse the spy this helper installed earlier. jest.restoreAllMocks()
	// replaces it with the real fetch, and that is detected here too.
	if (!installedFetch || globalThis.fetch !== installedFetch) {
		installedFetch = jest.spyOn(globalThis, 'fetch') as FetchMock;
	}
	// Clears any answer an earlier call queued.
	installedFetch.mockReset();
	installedFetch.mockImplementation(respond);
	return installedFetch;
}

/**
 * `createTestContext(overrides?: { key?: string; log?: jest.Mock }): LinkhutTestContext`
 *
 * Returns a context the endpoint functions accept. It has `key` (the
 * override, else `'linkhut-test-token'`), `options: {}`, and a
 * `$getAccountId` that resolves `'linkhut-test-account'`.
 *
 * `ctx.log` is the mock every endpoint logs through. Endpoints call
 * `logEventFromContext` from `corsair/core` as
 * `logEventFromContext(ctx, 'linkhut.<operation>', payload, 'completed')`, so
 * `ctx.log.mock.calls[0]` is that argument list. When the test file mocks
 * `corsair/core` with its own `logEventFromContext: jest.fn()`, `ctx.log` is
 * that same mock. Otherwise this installs a spy on `corsair/core` and `ctx.log`
 * is a fresh `jest.fn()` that resolves `'evt'`. Either way the call history
 * starts empty for each context: the spy an earlier call installed is restored
 * first. `jest.restoreAllMocks()` restores it as well.
 */
export function createTestContext(
	overrides: LinkhutTestContextOverrides = {},
): LinkhutTestContext {
	const log = useLog(overrides.log);
	// The endpoints read `key` and log through `log`. Everything else a real
	// context has comes from a database, so the cast below only fills that in.
	const ctx: Pick<LinkhutContext, 'key' | 'options' | '$getAccountId'> & {
		log: jest.Mock;
	} = {
		key: overrides.key ?? TEST_API_KEY,
		options: {},
		$getAccountId: async () => TEST_ACCOUNT_ID,
		log,
	};
	return ctx as LinkhutTestContext;
}

export type MockFetchResponse = {
	/** HTTP status of the answer. 200 by default. */
	status?: number;
	body?: unknown; // unknown: the JSON the test wants the provider to answer, or a string sent as text.
	/** Response headers. A `content-type` here replaces the default one. */
	headers?: Record<string, string>;
};

/**
 * `mockFetchResponse(response?: MockFetchResponse): FetchMock`
 *
 * Installs `globalThis.fetch` as a Jest spy and returns it. Every call resolves
 * a new `Response` built from `{ status, body, headers }`, so a retried
 * request gets a body it can still read.
 *
 * `status` defaults to 200. `body` is sent as JSON with
 * `content-type: application/json; charset=utf-8`, except that a string is
 * sent as text with `text/plain; charset=utf-8`, and an omitted `body` sends
 * no body and no content type. A `content-type` in `headers` wins. Every
 * call gets this response unless a queued one-off covers it:
 * `fetchMock.mockResolvedValueOnce(new Response(...))` applies to the next
 * call, so the first call consumes the first one-off. To fail once and then
 * get this response, install it here and chain `.mockRejectedValueOnce(...)`
 * on the returned mock. Calling this or `mockFetchRejection` again resets the
 * mock, so its call history starts again from zero. A status outside 200 to
 * 599 throws here: fetch reports such a status as a network error, so that
 * case belongs to `mockFetchRejection`. `jest.restoreAllMocks()` restores the
 * real fetch.
 */
export function mockFetchResponse(response: MockFetchResponse = {}): FetchMock {
	const { status = 200, body, headers = {} } = response;
	if (!Number.isInteger(status) || status < 200 || status > 599) {
		throw new RangeError(
			`mockFetchResponse: status ${status} is outside 200 to 599. fetch reports such a status as a network error, so use mockFetchRejection for it.`,
		);
	}
	const hasContentType = Object.keys(headers).some(
		(name) => name.toLowerCase() === 'content-type',
	);
	const defaults: Record<string, string> =
		body === undefined || hasContentType
			? {}
			: {
					'content-type':
						typeof body === 'string'
							? 'text/plain; charset=utf-8'
							: 'application/json; charset=utf-8',
				};
	const init: ResponseInit = { status, headers: { ...defaults, ...headers } };
	const payload =
		body === undefined
			? null
			: typeof body === 'string'
				? body
				: JSON.stringify(body);
	return installFetch(async () => new Response(payload, init));
}

/**
 * `mockFetchRejection(reason: unknown): FetchMock` (unknown: the reason is
 * whichever value the test rejects with.)
 *
 * Installs `globalThis.fetch` as a Jest spy that rejects with `reason` on
 * every call, and returns it. This is how a connection reset, a DNS failure,
 * an abort, a timeout and linkhut's HTTP 999 throttle signal reach the client.
 * A queued one-off such as `fetchMock.mockResolvedValueOnce(...)` applies to
 * the next call, so chaining it here makes the first call succeed, not the
 * last. To fail once and then succeed, install the success with
 * `mockFetchResponse` and chain `.mockRejectedValueOnce(reason)` on what it
 * returns. `jest.restoreAllMocks()` restores the real fetch.
 */
export function mockFetchRejection(
	reason: unknown, // unknown: the rejection reason, whichever value the test chooses.
): FetchMock {
	return installFetch(() => Promise.reject(reason));
}

/**
 * `captureError(promise: Promise<unknown>): Promise<unknown>` (unknown: a
 * rejection reason has no static type.)
 *
 * Awaits a promise that is expected to reject and resolves with the reason,
 * so a test fails on a resolved promise instead of on a thrown one. When the
 * promise does not reject, it resolves with the promise's own value. Narrow
 * the result with `toBeInstanceOf(ApiError)` before reading a field.
 */
export async function captureError(
	promise: Promise<unknown>, // unknown: the promise under test, which may reject with any value.
): Promise<unknown /* unknown: the rejection reason, or the promise's value when it resolved */> {
	return promise.catch((caught: unknown) => caught); // unknown: a rejection reason has no static type.
}
