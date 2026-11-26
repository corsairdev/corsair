import { ApiError } from 'corsair/http';
import type { LobRequest } from './client';
import { recordLobRequestInfo } from './client';
import type { LobContext } from './index';
import { lob } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

export const API_KEY = 'test_fake_key_0000';

export const BASE = 'https://api.lob.com/v1';

export const endpoints = lob({ key: API_KEY }).endpoints!;

/** A context the endpoints read: only `key`, `options` and `db` matter. */
export function makeCtx(): LobContext {
	// unknown: the full CorsairPluginContext carries a database handle and key
	// manager the endpoints never touch; the cast keeps the fixture minimal.
	return { key: API_KEY, options: {}, db: {} } as unknown as LobContext;
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function ok(body: unknown): Response {
	return jsonResponse(body);
}

export function lastCall() {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

// unknown: the body the endpoint actually sent, read back per assertion.
export function sentBody(): Record<string, unknown> {
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	// unknown: a JSON string parses to whatever shape the endpoint sent.
	return JSON.parse(body) as Record<string, unknown>;
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

export const queryOf = (url: string) => new URL(url).searchParams;

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale
 * spy across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Lob.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Lob test: ${String(input)}`);
	});
}

export function restoreFetchMock(): void {
	jest.restoreAllMocks();
	spy = undefined;
}

export function currentFetch(): jest.SpyInstance {
	if (!spy)
		throw new Error('installFetchMock() must run before currentFetch()');
	return spy;
}

/** Queues one response on the single fetch spy. */
export function mockFetch(response: Response): void {
	currentFetch().mockResolvedValueOnce(response);
}

/**
 * An error shaped like the ones makeLobRequest throws: core's ApiError for an
 * HTTP answer (with Lob's `{ error: { code, message } }` envelope), or a plain
 * Error for a transport failure, tagged with the request facts.
 */
export function lobError(
	message: string,
	options: {
		status?: number;
		code?: string;
		retryAfter?: number;
		method?: LobRequest['method'];
		hasIdempotency?: boolean;
		transportFailure?: boolean;
	} = {},
): Error {
	const method = options.method ?? 'GET';
	const error =
		options.transportFailure || options.status === undefined
			? options.code === undefined
				? new Error(message)
				: new ApiError(
						{ method, url: '/x' },
						{
							url: `${BASE}/x`,
							ok: false,
							status: 0,
							statusText: '',
							body: { error: { message, code: options.code } },
						},
						message,
					)
			: new ApiError(
					{ method, url: '/x' },
					{
						url: `${BASE}/x`,
						ok: false,
						status: options.status,
						statusText: '',
						body: { error: { message, code: options.code } },
					},
					message,
					{ retryAfter: options.retryAfter },
				);
	recordLobRequestInfo(error, {
		method,
		hasIdempotency: options.hasIdempotency ?? false,
		transportFailure: options.transportFailure ?? false,
	});
	return error;
}
