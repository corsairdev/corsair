import type { MailerLiteContext } from './index';
import { mailerlite } from './index';

/** A context the endpoints read: only `key` and `options` matter to them. */
export function makeCtx(): MailerLiteContext {
	// unknown: only key, options and db are read; the rest of the context is
	// core-runtime state no test can construct.
	return { key: 'test-token', options: {}, db: {} } as unknown as MailerLiteContext; // unknown: the context is runtime state no test can construct
}

// unknown: response bodies are arbitrary JSON, so each test states its own.
export function jsonResponse(
	body: unknown, // unknown: each test states its own body shape.
	init: ResponseInit = {},
): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

/** A no-content success, which the delete operations answer with. */
export function noContent(): Response {
	return new Response(null, { status: 204 });
}

export function lastCall() {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

export function sentBody(): Record<string, unknown> { // unknown: the sent body is asserted field by field
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as Record<string, unknown>; // unknown: same open sent body
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

export const BASE = 'https://connect.mailerlite.com/api';

export const endpoints = mailerlite({ key: 'test-token' }).endpoints!;

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale spy
 * across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach MailerLite.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a MailerLite test: ${String(input)}`);
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

// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller narrows it to the fields it asserts on.
export async function captureError<T>(promise: Promise<T>): Promise<unknown> { // unknown: a rejection reason has no static type
	return promise.catch((caught: unknown) => caught); // unknown: same rejection reason as above
}
