import type { ScrapeDoContext } from './index';

/**
 * A context the endpoints read. Only `key` matters to them; each suite that
 * calls an endpoint mocks `logEventFromContext` at module level with
 * `jest.mock('corsair/core', …)`, so no account resolver is needed here.
 */
export function makeCtx(key = 'sd-test-token'): ScrapeDoContext {
	// unknown: a full context needs a database and an account resolver that no
	// offline test provides, and a call reads only `key` on this object.
	return { key } as unknown as ScrapeDoContext;
}

let spy: jest.SpyInstance | undefined;

/** Installs the fetch spy. A call with no queued answer fails, never dials out. */
export function installFetchMock(): void {
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respond() first');
	});
}

export function restoreFetchMock(): void {
	jest.restoreAllMocks();
	spy = undefined;
}

function currentFetch(): jest.SpyInstance {
	if (!spy) {
		throw new Error('installFetchMock() must run before using the fetch spy');
	}
	return spy;
}

/**
 * Queues one response. An object is sent as JSON; a string is sent verbatim,
 * which is how the scrape surface returns a page.
 */
export function respond(
	body: object | string,
	status = 200,
	headers: Record<string, string> = {},
): void {
	const text = typeof body === 'string' ? body : JSON.stringify(body);
	currentFetch().mockResolvedValueOnce(
		new Response(text, {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/html' : 'application/json',
				...headers,
			},
		}),
	);
}

/** Queues a transport failure, the shape a dropped connection takes. */
export function rejectNextFetch(error: Error): void {
	currentFetch().mockRejectedValueOnce(error);
}

/** The last request sent, with its query parsed. */
export function sentUrl(): URL {
	const calls = currentFetch().mock.calls;
	const [input] = calls[calls.length - 1] as [string | URL | Request];
	return input instanceof URL ? input : new URL(String(input));
}

export function sentQuery(): URLSearchParams {
	return sentUrl().searchParams;
}

export function sentHeaders(): Headers {
	const calls = currentFetch().mock.calls;
	// unknown: jest records a call's arguments as unknown[], and only the init
	// object's headers are read here.
	const call = calls[calls.length - 1] as [unknown, RequestInit?];
	return new Headers(call[1]?.headers);
}

export function sentMethod(): string | undefined {
	const calls = currentFetch().mock.calls;
	// unknown: jest records a call's arguments as unknown[]; only `method` is read.
	const call = calls[calls.length - 1] as [unknown, RequestInit?];
	return call[1]?.method;
}

/**
 * The JSON body of the last request, or undefined when it sent none.
 *
 * unknown: the body is parsed back from the serialised wire form the client
 * sent, which carries no static type; each test asserts on the fields it names.
 */
export function sentBody(): unknown {
	const calls = currentFetch().mock.calls;
	// unknown: jest records a call's arguments as unknown[]; only `body` is read.
	const call = calls[calls.length - 1] as [unknown, RequestInit?];
	const body = call[1]?.body;
	return typeof body === 'string' ? JSON.parse(body) : undefined;
}

export function fetchCallCount(): number {
	return currentFetch().mock.calls.length;
}
