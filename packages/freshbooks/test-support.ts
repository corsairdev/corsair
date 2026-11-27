export const API_KEY = 'fb-test-access-token';

/** A fake context carrying only what the endpoints read. */
export const testContext = { key: API_KEY } as never;

// unknown: negative cases pass values no schema accepts, so the endpoint is
// erased to a context-and-value function; its own generic type still infers
// the input and output.
export async function invoke<
	Endpoint extends (ctx: never, input: never) => Promise<unknown>,
>(
	endpoint: Endpoint,
	input: Parameters<Endpoint>[1],
): Promise<Awaited<ReturnType<Endpoint>>> {
	return endpoint(testContext, input as never) as Awaited<ReturnType<Endpoint>>;
}

// unknown: a promise can reject with any value, so the rejection reason has
// no static type; each caller narrows it with instanceof.
export function failureOf(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

// Any call a test did not queue a response for throws, so no test can reach
// the real API.
function unmocked(): never {
	throw new Error('unmocked fetch in a unit test');
}

export function installFetchMock() {
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(unmocked);
	afterEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(unmocked);
	});
	return fetchMock;
}

export function respondJson(
	fetchMock: jest.SpyInstance,
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

export function respondEmpty(fetchMock: jest.SpyInstance, status = 200) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

export type RecordedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	queryPairs: [string, string][];
	method: string | undefined;
	/** Header names are lowercased by the Headers class. */
	headers: Record<string, string>;
	// unknown: the parsed JSON body, when one was sent, has no static type.
	body: unknown;
};

export function lastRequest(fetchMock: jest.SpyInstance): RecordedRequest {
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
		body:
			init.body === undefined || init.body === null
				? undefined
				: JSON.parse(String(init.body)),
	};
}

/** The access token rides as a Bearer header, never in the query. */
export function expectBearerAuth(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://api.freshbooks.com');
	expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
	expect(sent.query.token).toBeUndefined();
	expect(sent.query.api_key).toBeUndefined();
}
