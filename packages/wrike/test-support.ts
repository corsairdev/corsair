export const API_KEY = 'wrike-test-token';

/** A fake context carrying only what the endpoints read. */
export const testContext = {
	key: API_KEY,
	options: { host: 'www' as const },
} as never;

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: parameters are contravariant, so `never` admits every concrete endpoint
// while each keeps its own output type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
export async function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(testContext, input as never);
}

/** A context on another host, for the region-routing test. */
export const euContext = {
	key: API_KEY,
	options: { host: 'eu' as const },
} as never;

export function installFetchMock() {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	afterEach(() => {
		fetchMock.mockReset();
	});
	return fetchMock;
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
		// unknown: the raw request body, before any parsing; each caller narrows it.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
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

/** Wrike documents the scheme in lowercase and accepts it. */
export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://www.wrike.com');
	expect(sent.path.startsWith('/api/v4/')).toBe(true);
	expect(sent.headers['authorization']).toBe(`bearer ${API_KEY}`);
}
