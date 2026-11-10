import type { FoursquareContext } from './index';
import { foursquare } from './index';

/** A context the endpoints read: only `key` and `options` matter to them. */
export function makeCtx(): FoursquareContext {
	// Safe: the endpoints read only key, options and db from the context.
	return {
		key: 'test-key',
		options: {},
		db: {},
	} as unknown as FoursquareContext;
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

export const BASE = 'https://places-api.foursquare.com';

export const endpoints = foursquare({ key: 'test-key' }).endpoints!;

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

export function queryParam(name: string): string | null {
	return new URL(lastCall().url).searchParams.get(name);
}
