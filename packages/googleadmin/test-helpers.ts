import type { GoogleAdminContext } from './index';
import { googleadmin } from './index';

export const BASE = 'https://admin.googleapis.com/admin/directory/v1';

/** A context the endpoints read: only `key` matters to them. */
export function makeCtx(): GoogleAdminContext {
	return {
		key: 'test-token', // unknown: endpoints read only `key`.
	} as unknown as GoogleAdminContext; // unknown: only `key` is read.
}

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than a module-level binding, which would capture a stale spy across
 * `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Google.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Google Admin test: ${String(input)}`);
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

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(
	body: unknown, // unknown: response bodies are arbitrary JSON per test.
	init: ResponseInit = {},
): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

/** A 200 with no body, which is what delete, undelete, makeAdmin and signOut answer. */
export function emptyResponse(status = 200): Response {
	return new Response(null, { status });
}

export function lastCall(): { url: string; init: RequestInit } {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

/** The JSON body of the last request, as a plain record. */
// unknown: a parsed JSON body has no static shape; tests read single keys.
/** The JSON body of the last request, as a plain record. */
export function sentBody(): Record<string, unknown> {
	// unknown: parsed JSON.
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	// unknown: a parsed JSON object has no static shape; tests read single keys.
	return JSON.parse(body) as Record<string, unknown>; // unknown: parsed JSON.
}

export function queryOf(url: string): URLSearchParams {
	return new URL(url).searchParams;
}

export const endpoints = googleadmin().endpoints!;

/** A Google error envelope, as the API sends it. */
export function googleError(
	code: number,
	status: string,
	reason: string,
	message = 'Request failed',
): Response {
	return jsonResponse(
		{
			error: {
				code,
				message,
				errors: [{ message, domain: 'global', reason }],
				status,
			},
		},
		{ status: code },
	);
}
