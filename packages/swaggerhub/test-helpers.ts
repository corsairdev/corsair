import type { SwaggerhubContext } from './index';
import { swaggerhub } from './index';

export const TEST_KEY = 'test-api-key';

export const BASE = 'https://api.swaggerhub.com';

/**
 * SwaggerHub takes the API key in `Authorization` with no `Bearer` prefix, so the
 * header is the key itself.
 */
export const TEST_AUTH = TEST_KEY;

/** A context the endpoints read: only `key` and the event logging fields. */
export function makeCtx(): SwaggerhubContext {
	// Safe: the endpoints read only `key` and the event logging fields.
	return {
		key: TEST_KEY,
		options: {},
		db: {},
		$getAccountId: jest.fn().mockResolvedValue('acct'),
	} as unknown as SwaggerhubContext;
}

/** A response body the test states, as JSON. */
// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

/** A definition response, which the route serves as YAML or plain text. */
export function textResponse(
	body: string,
	contentType = 'application/yaml',
): Response {
	return new Response(body, {
		status: 200,
		headers: { 'Content-Type': contentType },
	});
}

/** A 204, which every flag-style route answers. */
export function emptyResponse(): Response {
	return new Response(null, { status: 204 });
}

export const endpoints = swaggerhub({ key: TEST_KEY }).endpoints!;

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

export function fetchCount(): number {
	return currentFetch().mock.calls.length;
}

export function lastCall(): { url: string; init: RequestInit } {
	const [url, init] = currentFetch().mock.lastCall!;
	return { url: String(url), init: (init ?? {}) as RequestInit };
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

/** The body exactly as it went on the wire, which is what a definition route needs. */
export function rawBody(): string {
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a string body');
	}
	return body;
}

// unknown: a sent JSON body is arbitrary JSON; each test asserts the fields it expects.
export function sentBody(): Record<string, unknown> {
	return JSON.parse(rawBody()) as Record<string, unknown>;
}

export function queryParam(name: string): string | null {
	return new URL(lastCall().url).searchParams.get(name);
}

export function pathname(): string {
	return new URL(lastCall().url).pathname;
}
