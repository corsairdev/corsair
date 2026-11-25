import type { LoopsContext } from './index';
import { loops } from './index';

/** A context the endpoints read: only `key` and `options` matter to them. */
export function makeCtx(): LoopsContext {
	// unknown: the endpoints read only key, options and db, so the fixture
	// leaves out the rest of the runtime context.
	return { key: 'test-key', options: {}, db: {} } as unknown as LoopsContext;
}

// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller narrows it to the fields it asserts on.
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

/** A success envelope body, which is what every Loops answer looks like. */
// unknown: response bodies are arbitrary JSON, so each test states its own.
export function ok(data: unknown): Response {
	return jsonResponse(data);
}

/** An error envelope with a status, as Loops answers bad requests. */
export function fail(body: unknown, status = 400): Response {
	return jsonResponse(body, { status });
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

// unknown: the request body is whatever the endpoint serialized; each test
// asserts on the fields it cares about.
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

export const BASE = 'https://app.loops.so/api';

export const endpoints = loops({ key: 'test-key' }).endpoints!;

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale
 * spy across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Loops.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Loops test: ${String(input)}`);
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
