import type { ListcleanContext } from './index';
import { listclean } from './index';

/** A context the endpoints read: only `key` and `options` matter to them. */
export function makeCtx(): ListcleanContext {
	// Safe: the endpoints read only key, options and db from the context.
	return {
		key: 'test-token',
		options: {},
		db: {},
	} as unknown as ListcleanContext;
}

/** An envelope success body, which is what almost every Listclean answer looks like. */
// unknown: each test states its own `data` payload.
export function ok(data: unknown): Response {
	return jsonResponse(envelopeOf(data));
}

// unknown: same reason as ok().
function envelopeOf(data: unknown): Record<string, unknown> {
	return { success: 1, error_code: 0, message: 'OK', data };
}

export function fail(message: string, errorCode = 0, status = 200): Response {
	return jsonResponse(
		{ success: 0, error_code: errorCode, message },
		{ status },
	);
}

/** The 404 shape: an HTML CodeIgniter page, not JSON. */
export function htmlResponse(status = 404): Response {
	return new Response('<!DOCTYPE html><html><body>404</body></html>', {
		status,
		headers: { 'Content-Type': 'text/html' },
	});
}

/** The download route's shape: a JSON stream sent as octet-stream text. */
// unknown: each test states its own rows.
export function downloadResponse(rows: unknown): Response {
	return new Response(JSON.stringify(rows), {
		status: 200,
		headers: { 'Content-Type': 'application/octet-stream' },
	});
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

export function lastCall() {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

// unknown: the sent body is whatever the endpoint serialized.
export function sentBody(): Record<string, unknown> {
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as Record<string, unknown>;
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

export const BASE = 'https://api.listclean.xyz/v1';

export const endpoints = listclean({ key: 'test-token' }).endpoints!;

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale spy
 * across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Listclean.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Listclean test: ${String(input)}`);
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

// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller narrows it to the fields it asserts on.
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}
