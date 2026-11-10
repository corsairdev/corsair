import type { ReamazeContext } from './index';
import { reamaze } from './index';

/** A credential pair as the key builder JSON-encodes it. */
export const TEST_KEY = JSON.stringify({
	email: 'agent@example.com',
	token: 'test-token',
});

export const TEST_HOST = 'acme.reamaze.io';

export const BASE = `https://${TEST_HOST}/api/v1`;

/** The HTTP Basic header the client builds from the JSON credential pair. */
export const TEST_AUTH = `Basic ${Buffer.from(
	'agent@example.com:test-token',
).toString('base64')}`;

/**
 * A context the endpoints read: `key`, `options` and a `keys` slice with
 * `get_host`. `host: null` clears the plugin option so the stored-host path is
 * exercised, and `storedHost` fills that store in.
 */
export function makeCtx(
	overrides: { host?: string | null; storedHost?: string | null } = {},
): ReamazeContext {
	const host = overrides.host === undefined ? TEST_HOST : overrides.host;
	const options = host === null ? {} : { host };
	const storedHost = overrides.storedHost ?? null;
	// Safe: the endpoints read only key, options, keys.get_host and the event
	// logging fields from the context.
	return {
		key: TEST_KEY,
		options,
		db: {},
		keys: { get_host: jest.fn().mockResolvedValue(storedHost) },
		$getAccountId: jest.fn().mockResolvedValue('acct'),
	} as unknown as ReamazeContext;
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

export const endpoints = reamaze({ host: TEST_HOST, key: TEST_KEY }).endpoints!;

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
	const [url, init] = currentFetch().mock.lastCall!;
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

export function queryParam(name: string): string | null {
	return new URL(lastCall().url).searchParams.get(name);
}
