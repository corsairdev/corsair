import type { LeigaContext } from './index';
import { leiga } from './index';

/** A context the endpoints read: only `key` and `options` matter to them. */
export function makeCtx(): LeigaContext {
	// Safe: the endpoints read only key, options and db from the context.
	return { key: 'test-token', options: {}, db: {} } as unknown as LeigaContext;
}

/** An envelope success body, which is what every Leiga answer looks like. */
export function ok(data: unknown): Response {
	return jsonResponse({ code: '0', data });
}

export function fail(code: string, msg: string): Response {
	return jsonResponse({ code, msg });
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

export const BASE = 'https://app.leiga.com/openapi/api';

export const endpoints = leiga({ key: 'test-token' }).endpoints!;

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale spy
 * across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	spy = jest.spyOn(globalThis, 'fetch');
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
