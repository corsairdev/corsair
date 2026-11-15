import { logEventFromContext } from 'corsair/core';

// Shared harness for the offline suites. Every `unknown` lives here, with the
// note saying why a stricter type is not possible, rather than at the call
// sites that would each need their own.

export const mockLog = jest.mocked(logEventFromContext);

export const API_KEY = 'shippo_test_abc123';

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

		get fetchMock() {
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

		/** Every route is on api.goshippo.com with ShippoToken auth and a version. */
		expectAuthenticated() {
			const sent = lastRequest();
			expect(sent.origin).toBe('https://api.goshippo.com');
			// ShippoToken, not Bearer: the header format is part of the contract.
			expect(sent.headers.get('authorization')).toBe(`ShippoToken ${API_KEY}`);
			expect(sent.headers.get('shippo-api-version')).toBe('2018-02-08');
		},

		/**
		 * Awaits a promise that must reject and returns the rejection as the
		 * error type the caller names, so a missing failure fails the test here
		 * rather than surfacing as `undefined` downstream.
		 */
		// unknown: what a promise rejects with cannot be typed, since fetch, the
		// HTTP layer and the zod parsers each throw their own.
		async failure<T extends Error = Error>(
			promise: Promise<unknown>,
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
 * endpoints read. Also carries `$getAccountId` and `logEventFromContext`'s
 * dependencies, which the mocked logger ignores.
 */
// unknown: assertions deliberately pass values the schema will reject.
export function invoke<Output>(
	endpoint: (ctx: never, input: never) => Promise<Output>,
	input: unknown = {},
): Promise<Output> {
	return endpoint({ key: API_KEY } as never, input as never);
}
