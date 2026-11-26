import type { LushaContext } from './index';
import { lusha } from './index';

/** A context the endpoints read: only `key` and `options` matter to them. */
export function makeCtx(): LushaContext {
	// Safe: the endpoints read only key, options and db from the context.
	return { key: 'test-key', options: {}, db: {} } as unknown as LushaContext;
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

export const BASE = 'https://api.lusha.com';

export const endpoints = lusha({ key: 'test-key' }).endpoints!;

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale
 * spy across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Lusha.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Lusha test: ${String(input)}`);
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
