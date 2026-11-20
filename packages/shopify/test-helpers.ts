import { logEventFromContext } from 'corsair/core';

// Shared harness for the offline suites. Every `unknown` is declared here with
// the reason a stricter type is not possible, rather than at each call site.

export const mockLog = jest.mocked(logEventFromContext);

export const ACCESS_TOKEN = 'shpat_test_token_abc123';
export const SHOP_DOMAIN = 'corsair-test.myshopify.com';

/** Decoded form of the last request the mocked fetch received. */
export type SentRequest = {
	origin: string;
	path: string;
	method?: string;
	headers: Headers;
	// unknown: the GraphQL body is built per endpoint; an assertion reads the
	// `query` and `variables` it cares about.
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
		 * Queues one JSON response. The body is `unknown` because fixtures,
		 * inline literals and deliberately malformed bodies all pass through
		 * here.
		 */
		// unknown: the body is arbitrary JSON, including bodies a test wants
		// the output schema to reject.
		respond(body: unknown, status = 200, headers: Record<string, string> = {}) {
			return fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(body), {
					status,
					headers: { 'Content-Type': 'application/json', ...headers },
				}),
			);
		},

		lastRequest,

		/** Every call is a POST to the versioned GraphQL endpoint on the shop host. */
		expectAuthenticated() {
			const sent = lastRequest();
			expect(sent.origin).toBe(`https://${SHOP_DOMAIN}`);
			// The access token is a literal header. `Bearer` would be rejected.
			expect(sent.headers.get('x-shopify-access-token')).toBe(ACCESS_TOKEN);
		},

		/**
		 * Awaits a promise that must reject, and returns the rejection narrowed
		 * to the type the caller names.
		 */
		// unknown: the promise may resolve to anything, and the test only
		// asserts that it rejected.
		async expectRejection<T>(promise: Promise<unknown>): Promise<T> {
			// unknown: a promise can reject with any value, so the rejection
			// reason has no static type; each caller names the type it asserts.
			const error = await promise.then(
				() => {
					throw new Error('Expected the call to reject, but it resolved');
				},
				// unknown: a rejection reason has no static type; the caller
				// names the type it asserts.
				(caught: unknown) => caught,
			);
			return error as T;
		},
	};
}

/**
 * The context an endpoint sees. Only the members the endpoints read are
 * present: `key` (already resolved by the key builder), `options`, and the
 * account key manager accessors.
 */
export function createContext(
	// unknown: a test passes only the option fields and key accessors it
	// needs, so a Partial of the real types is not expressible here.
	options: Record<string, unknown> = {},
	keys: Record<string, unknown> = {},
) {
	return {
		key: ACCESS_TOKEN,
		tenantId: 'default',
		options: { authType: 'api_key', shopDomain: SHOP_DOMAIN, ...options },
		keys: {
			get_api_key: async () => ACCESS_TOKEN,
			get_shop_domain: async () => SHOP_DOMAIN,
			get_webhook_signature: async () => null,
			...keys,
		},
		// Stored entities are not declared by this plugin.
		db: {},
	} as never;
}
