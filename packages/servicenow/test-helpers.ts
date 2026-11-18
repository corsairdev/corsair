import type { ServicenowContext } from './index';
import { servicenow } from './index';

/** A credential pair as the key builder JSON-encodes it. */
export const TEST_KEY = JSON.stringify({
	username: 'admin',
	password: 'secret',
});

export const TEST_HOST = 'acme.service-now.com';

/**
 * A context the endpoints read: `key`, `options` and a `keys` slice with
 * `get_host`. The endpoints resolve the host from `options` first, so the
 * fixture supplies it there.
 */
/**
 * A context the endpoints read: `key`, `options` and a `keys` slice with
 * `get_host`. The endpoints resolve the host from `options` first, so the
 * fixture supplies it there.
 *
 * Pass `storedHost` to exercise the stored-host path, and `host: null` to leave
 * `options.host` unset so the stored value is what resolves.
 */
export function makeCtx(
	overrides: { host?: string | null; storedHost?: string | null } = {},
): ServicenowContext {
	const host =
		overrides.host === null ? undefined : (overrides.host ?? TEST_HOST);
	// Safe: the endpoints read only key, options, db and keys.get_host.
	return {
		key: TEST_KEY,
		options: host === undefined ? {} : { host },
		db: {},
		keys: {
			get_host: jest.fn().mockResolvedValue(overrides.storedHost ?? null),
		},
	} as unknown as ServicenowContext;
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

export function noContent(): Response {
	return new Response(null, { status: 204 });
}

export const BASE = `https://${TEST_HOST}/api/now`;

export const endpoints = servicenow({ host: TEST_HOST, key: TEST_KEY })
	.endpoints!;

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

export function queryParam(name: string): string | null {
	return new URL(lastCall().url).searchParams.get(name);
}
