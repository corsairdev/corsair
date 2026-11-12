import { WebscraperioAPIError } from './client';

export const API_KEY = 'ws-test-token';

/**
 * A fake context carrying only what the endpoints read. It is cast to never
 * because it is not a full WebscraperioContext, and every endpoint accepts it.
 */
export const testContext = { key: API_KEY } as never;

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Output is inferred from the endpoint, so each
// result keeps its real type.
// unknown: negative cases pass values no schema accepts.
export async function invoke<Output>(
	endpoint: (ctx: never, input: never) => Promise<Output>,
	input: unknown,
): Promise<Output> {
	// never: the input schema parses whatever the test passes.
	return endpoint(testContext, input as never);
}

/**
 * Awaits a call that must fail with a WebscraperioAPIError and returns the
 * error. The instanceof check replaces a cast, and a call that succeeds or
 * throws anything else fails the test.
 */
export async function rejection(
	// unknown: only the rejection is read, never the resolved value.
	promise: Promise<unknown>,
): Promise<WebscraperioAPIError> {
	const thrown = await promise.then(
		() => new Error('expected the call to fail, but it succeeded'),
		// unknown: a rejection can be any value until the instanceof check.
		(error: unknown) => error,
	);
	if (!(thrown instanceof WebscraperioAPIError)) {
		throw new Error(`expected a WebscraperioAPIError, got ${String(thrown)}`);
	}
	return thrown;
}

// A unit test must never reach the network: any fetch without a queued
// response throws instead of passing through to the real one.
function refuseUnmockedFetch(): never {
	throw new Error('unmocked fetch in a unit test');
}

export function installFetchMock() {
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(refuseUnmockedFetch);
	afterEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(refuseUnmockedFetch);
	});
	return fetchMock;
}

// unknown: response bodies are arbitrary JSON.
export function respond(
	fetchMock: jest.SpyInstance,
	body: unknown,
	status = 200,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

export type RecordedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	queryPairs: [string, string][];
	method: string | undefined;
	/** Header names are lowercased by the Headers class. */
	headers: Record<string, string>;
	// unknown: the request body is whatever the endpoint serialized.
	body: unknown;
};

export function lastRequest(fetchMock: jest.SpyInstance): RecordedRequest {
	// The spy records fetch's arguments untyped; the client always calls
	// fetch(url string, init).
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const pairs = [...parsed.searchParams.entries()];
	const headers = new Headers(init.headers);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(pairs),
		queryPairs: pairs,
		method: init.method,
		headers: Object.fromEntries(headers.entries()),
		// unknown: JSON.parse returns any; widening it to unknown keeps it checked.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

/** The token travels as a Bearer header, never on the query string. */
export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://api.webscraper.io');
	expect(sent.path.startsWith('/api/v1/')).toBe(true);
	expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
	expect(sent.query.api_token).toBeUndefined();
}
