import type { TldvContext } from './index';
import { tldv } from './index';

/** A context the endpoints read: only `key` and `options` matter to them. */
export function makeCtx(): TldvContext {
	// Safe: the endpoints read only key, options and db from the context.
	return { key: 'test-key', options: {}, db: {} } as unknown as TldvContext;
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

export const BASE = 'https://pasta.tldv.io';

export const endpoints = tldv({ key: 'test-key' }).endpoints!;

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

export function mockFetch(response: Response): void {
	currentFetch().mockResolvedValueOnce(response);
}

export function lastCall() {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

export function sentBody(): Record<string, unknown> {
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as Record<string, unknown>;
}
