import { logEventFromContext } from 'corsair/core';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

export const mockLog = jest.mocked(logEventFromContext);
export const API_KEY = 'ls-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each returns its own output type, so the shared
// return is unknown, and each test casts to the fields it reads.
// unknown: see the note above; the shared return cannot be narrowed without
// listing every operation's output.
export type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

let fetchMock: jest.SpyInstance | undefined;

/** Starts the fetch spy and clears the log between tests. */
export function setUp() {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
}

export function tearDown() {
	fetchMock?.mockRestore();
}

// unknown: negative cases pass values no schema accepts, and a positive case
// passes the operation\'s own input; the endpoint validates it either way.
export function invoke(endpoint: AnyEndpoint, input: unknown = {}) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

/**
 * Queues one answer. Lemon Squeezy sends `application/vnd.api+json`, so the
 * default media type is that one: it is what makes corsair/http hand the body
 * back as text for the client to parse.
 */
// unknown: response bodies are arbitrary provider JSON, and the test decides
// the shape each one has.
export function respond(body: unknown, status = 200) {
	const mock = fetchMock as jest.SpyInstance;
	mock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/vnd.api+json' },
		}),
	);
}

export function respondEmpty(status = 204) {
	(fetchMock as jest.SpyInstance).mockResolvedValueOnce(
		new Response(null, { status }),
	);
}

export function calls() {
	return (fetchMock as jest.SpyInstance).mock.calls.length;
}

/**
 * The `data` member of a JSON:API write body. `attributes` and `relationships`
 * stay open because each endpoint sends a different set, which is the point of
 * the assertions that read them.
 */
export type RecordedWriteBody = {
	data: {
		type: string;
		id?: string;
		// unknown: each operation sends its own attributes and relationships,
		// and a test asserts only the keys it set.
		attributes?: Record<string, unknown>;
		relationships?: Record<string, unknown>;
	};
};

/** The request a test's endpoint just sent, read back off the fetch mock. */
export type RecordedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	method: string;
	headers: Headers;
	/** The parsed JSON body, for the operations that send one. */
	body?: RecordedWriteBody;
};

export function lastRequest(): RecordedRequest {
	const mock = fetchMock as jest.SpyInstance;
	const [url, init] = mock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		// `fetch` defaults to GET when no method is given.
		method: init.method ?? 'GET',
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialised.
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

export function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.lemonsqueezy.com');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	expect(sent.headers.get('accept')).toBe('application/vnd.api+json');
}
