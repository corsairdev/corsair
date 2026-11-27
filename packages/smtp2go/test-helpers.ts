import type { Smtp2goContext } from './index';
import { smtp2go } from './index';

export const BASE = 'https://api.smtp2go.com/v3';

// 32 alphanumeric characters after the `api-` prefix, as the real keys are.
export const API_KEY = 'api-testkey000000000000000000000001';

/** A context the endpoints read: only `key` matters to them. */
export function makeCtx(): Smtp2goContext {
	// unknown: the endpoints read only key and options from the context.
	return { key: API_KEY, options: {} } as unknown as Smtp2goContext;
}

export const endpoints = smtp2go({ key: API_KEY }).endpoints!;

// unknown: fixtures are complete `{ request_id, data }` envelopes whose
// shapes each test states.
export function ok(envelope: unknown): Response {
	return jsonResponse(envelope);
}

export function errorResponse(
	status: number,
	// unknown: error envelopes are arbitrary JSON; each test states its own.
	envelopeBody: unknown,
	headers: Record<string, string> = {},
): Response {
	return jsonResponse(envelopeBody, {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
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

// unknown: the parsed body is an open record until the test asserts on it.
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

/**
 * The single fetch spy, created per test. Tests reach it through `mockFetch`
 * rather than importing a module-level binding, which would capture a stale
 * spy across `beforeEach` runs.
 */
let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach SMTP2GO.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a smtp2go test: ${String(input)}`);
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

// unknown: a promise can reject with any value, so the rejection reason has
// no static type; each caller narrows it to the fields it asserts on.
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}
