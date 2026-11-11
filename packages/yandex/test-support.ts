export const API_KEY = 'yandex-test-api-key';

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

/** The key is sent as `Api-Key`, and every call is a POST. */
export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://translate.api.cloud.yandex.net');
	expect(sent.path.startsWith('/translate/v2/')).toBe(true);
	expect(sent.method).toBe('POST');
	expect(sent.headers['authorization']).toBe(`Api-Key ${API_KEY}`);
}
