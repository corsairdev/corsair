import type { SupportbeeContext } from './index';
import { supportbee } from './index';

export const TEST_KEY = 'test-token';

export const TEST_COMPANY = 'acme';

export const BASE = `https://${TEST_COMPANY}.supportbee.com`;

export const TEST_AUTH = `Bearer ${TEST_KEY}`;

/**
 * A context the endpoints read: `key`, `options` and a `keys` slice with
 * `get_company`. `company: null` clears the plugin option so the stored value is
 * exercised, and `storedCompany` fills that store in.
 */
export function makeCtx(
	overrides: { company?: string | null; storedCompany?: string | null } = {},
): SupportbeeContext {
	const company =
		overrides.company === undefined ? TEST_COMPANY : overrides.company;
	const options = company === null ? {} : { company };
	const storedCompany = overrides.storedCompany ?? null;
	// Safe: the endpoints read only key, options, keys.get_company and the event
	// logging fields from the context.
	return {
		key: TEST_KEY,
		options,
		db: {},
		keys: { get_company: jest.fn().mockResolvedValue(storedCompany) },
		$getAccountId: jest.fn().mockResolvedValue('acct'),
	} as unknown as SupportbeeContext;
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

/** A 204, which is what every flag route answers. */
export function emptyResponse(): Response {
	return new Response(null, { status: 204 });
}

export const endpoints = supportbee({
	company: TEST_COMPANY,
	key: TEST_KEY,
}).endpoints!;

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

export function lastCall(): { url: string; init: RequestInit } {
	const [url, init] = currentFetch().mock.lastCall!;
	return { url: String(url), init: (init ?? {}) as RequestInit };
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

export function queryParam(name: string): string | null {
	return new URL(lastCall().url).searchParams.get(name);
}
