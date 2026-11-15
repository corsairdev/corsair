import { logEventFromContext } from 'corsair/core';

// Shared harness for the offline suites. Every `unknown` lives here, with the
// note saying why a stricter type is not possible, rather than at the forty
// call sites that would otherwise each need their own.

/**
 * Each suite declares its own `jest.mock('corsair/core')` and imports this same
 * binding, so `mockLog` is the mock that suite installed.
 */
export const mockLog = jest.mocked(logEventFromContext);

export const API_KEY = 'eventbrite-test-token';

/** Decoded form of the last request the mocked fetch received. */
export type SentRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	method?: string;
	headers: Headers;
	// unknown: the body is whatever the endpoint serialized; an assertion reads
	// the individual fields it cares about.
	body: unknown;
};

export function createHarness() {
	// Assigned by `mockFetch`, so a test can never read it unset.
	let fetchMock: jest.SpyInstance;

	function lastRequest(): SentRequest {
		const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		const parsed = new URL(url);
		return {
			origin: parsed.origin,
			path: parsed.pathname,
			query: Object.fromEntries(parsed.searchParams),
			method: init.method,
			headers: new Headers(init.headers),
			// unknown: see SentRequest.body.
			body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
		};
	}

	return {
		mockFetch() {
			fetchMock = jest.spyOn(globalThis, 'fetch');
			return fetchMock;
		},

		/**
		 * Queues one JSON response for the next fetch. The body is `unknown`
		 * because fixtures, inline literals and deliberately malformed bodies
		 * all pass through here.
		 */
		// unknown: the body is arbitrary JSON, including bodies a test wants
		// rejected by the output schema.
		respond(body: unknown, status = 200, headers: Record<string, string> = {}) {
			return fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(body), {
					status,
					headers: { 'Content-Type': 'application/json', ...headers },
				}),
			);
		},

		lastRequest,

		/** True when no request left the process, which is what a schema rejection means. */
		get fetchMock() {
			return fetchMock;
		},

		/** Every route in this plugin is on the one v3 host, Bearer-authenticated. */
		expectAuthenticated() {
			const sent = lastRequest();
			expect(sent.origin).toBe('https://www.eventbriteapi.com');
			expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		},

		/**
		 * Awaits a promise that must reject and returns the rejection as the
		 * error type the caller names. Failing to reject fails the test right
		 * here instead of surfacing as `undefined` somewhere downstream.
		 */
		// unknown: what a promise rejects with cannot be typed, since fetch, the
		// HTTP layer and the zod parsers each throw their own; the caller names
		// the one it expects.
		async failure<T extends Error = Error>(
			promise: Promise<unknown>, // unknown: see the note above.
		): Promise<T> {
			try {
				await promise;
			} catch (error) {
				return error as T;
			}
			throw new Error('expected the call to fail, but it resolved');
		},
	};
}

/**
 * Invokes an endpoint with a context carrying only `ctx.key`, which is all the
 * endpoints read. Negative cases pass input no schema accepts.
 *
 * Generic in the endpoint's own return type, so a positive assertion reads the
 * parsed output with no cast at the call site.
 */
// unknown: assertions deliberately pass values the schema will reject.
export function invoke<Output>(
	endpoint: (ctx: never, input: never) => Promise<Output>,
	input: unknown = {},
): Promise<Output> {
	return endpoint({ key: API_KEY } as never, input as never);
}
