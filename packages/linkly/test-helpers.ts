import type { JsonRecord } from './client';
import type { LinklyContext } from './index';
import { linkly } from './index';

/** A context the endpoints read: only `key` matters to them. */
export function makeCtx(): LinklyContext {
	// Safe: the endpoints read only key and options from the context.
	return { key: 'test-key', options: {} } as unknown as LinklyContext; // unknown: a full CorsairPluginContext carries db and keys the endpoints never touch here
}

// Response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(
	body: unknown, // unknown: arbitrary JSON, stated per test
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

export const BASE = 'https://api.linklyhq.com';

export const endpoints = linkly({ key: 'test-key' }).endpoints!;

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale
 * spy across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Linkly.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Linkly test: ${String(input)}`);
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

export function lastCall() {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

export function callsSoFar(): number {
	return currentFetch().mock.calls.length;
}

// The parsed body is whatever the endpoint serialized; tests compare whole
// objects against it.
export function sentBody(): JsonRecord {
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as JsonRecord; // unknown: arbitrary JSON, compared per test
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}
