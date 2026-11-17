import type { SurveymonkeyContext } from './index';
import { surveymonkey } from './index';

export const TEST_KEY = 'test-access-token';

export const BASE = 'https://api.surveymonkey.com/v3';

export const TEST_AUTH = `bearer ${TEST_KEY}`;

/**
 * A context the endpoints read: `key`, `options` and a `keys` slice with
 * `get_api_host`. `apiHost: null` clears the plugin option so the stored value is
 * exercised, and `storedHost` fills that store in.
 */
export function makeCtx(
	overrides: { apiHost?: string | null; storedHost?: string | null } = {},
): SurveymonkeyContext {
	const apiHost = overrides.apiHost === undefined ? null : overrides.apiHost;
	const options = apiHost === null ? {} : { apiHost };
	const storedHost = overrides.storedHost ?? null;
	// Safe: the endpoints read only key, options, keys.get_api_host and the event
	// logging fields from the context.
	return {
		key: TEST_KEY,
		options,
		db: {},
		keys: { get_api_host: jest.fn().mockResolvedValue(storedHost) },
		$getAccountId: jest.fn().mockResolvedValue('acct'),
	} as unknown as SurveymonkeyContext;
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

export const endpoints = surveymonkey({ key: TEST_KEY }).endpoints!;

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

// unknown: a sent JSON body is arbitrary JSON; each test asserts the fields it expects.
export function sentBody(): Record<string, unknown> {
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as Record<string, unknown>;
}

export function queryParam(name: string): string | null {
	return new URL(lastCall().url).searchParams.get(name);
}

export function pathname(): string {
	return new URL(lastCall().url).pathname;
}
