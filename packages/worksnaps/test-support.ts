export const API_KEY = 'wsn-test-token';

/** A fake context carrying only what the endpoints read. */
export const testContext = { key: API_KEY } as never;

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
export async function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(testContext, input as never);
}

export function installFetchMock() {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	afterEach(() => {
		fetchMock.mockReset();
	});
	return fetchMock;
}

/** Answers with an XML body, which is all this API sends. */
export function respondText(
	fetchMock: jest.SpyInstance,
	body: string,
	status = 200,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, {
			status,
			headers: { 'Content-Type': 'application/xml; charset=utf-8' },
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
	/** The raw body, which is XML rather than JSON. */
	rawBody: string | undefined;
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
		rawBody:
			init.body === undefined || init.body === null
				? undefined
				: String(init.body),
	};
}

/** The token goes in Basic auth as the username, not in a header or query. */
export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://api.worksnaps.com');
	expect(sent.path.startsWith('/api/')).toBe(true);
	const encoded = Buffer.from(`${API_KEY}:`).toString('base64');
	expect(sent.headers['authorization']).toBe(`Basic ${encoded}`);
	expect(sent.query.api_key).toBeUndefined();
}
