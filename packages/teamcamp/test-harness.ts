import { logEventFromContext } from 'corsair/core';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

export const mockLog = jest.mocked(logEventFromContext);
export const API_KEY = 'tc-test-key';

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
// passes the operation's own input; the endpoint validates it either way.
export function invoke(endpoint: AnyEndpoint, input: unknown = {}) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

/**
 * Queues one answer. `raw` decides the exact bytes, so a bare JSON string, an
 * array and an object are all expressible; Teamcamp uses all three.
 */
// unknown: the body is one of those three shapes, which the test chooses.
export function respond(raw: unknown, status = 200) {
	const body = typeof raw === 'string' ? raw : JSON.stringify(raw);
	(fetchMock as jest.SpyInstance).mockResolvedValueOnce(
		new Response(body, {
			status,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		}),
	);
}

export function calls() {
	return (fetchMock as jest.SpyInstance).mock.calls.length;
}

export type RecordedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	method: string;
	headers: Headers;
	/** The parsed JSON body, for the operations that send one. */
	// unknown: each operation sends a different body, and a test asserts only
	// the keys it set.
	body?: Record<string, unknown>;
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
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

/** The key goes in the `apiKey` header, never as a Bearer token. */
export function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.teamcamp.app');
	expect(sent.headers.get('apikey')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}
