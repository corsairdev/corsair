import type { ScrapingAntContext } from './index';

/**
 * A context the endpoints read. Only `key` matters to them; each suite that
 * calls an endpoint mocks `logEventFromContext` at module level with
 * `jest.mock('corsair/core', …)`, so no account resolver is needed here.
 */
export function makeCtx(key = 'sa-test-key'): ScrapingAntContext {
	// unknown: a full context needs a database and an account resolver that no
	// offline test provides, and a call reads only `key` on this object.
	return { key } as unknown as ScrapingAntContext;
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
 * Queues one response. `body` is a string when the route answers HTML and an
 * object when it answers JSON; both are sent as the wire form the API uses.
 */
export function respond(
	body: string | object,
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
	const call = calls[calls.length - 1] as [
		string | URL | Request,
		RequestInit?,
	];
	return new Headers(call[1]?.headers);
}

export function fetchCallCount(): number {
	return currentFetch().mock.calls.length;
}
