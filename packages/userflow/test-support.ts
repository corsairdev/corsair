export const API_KEY = 'ak_test_environment_key';

/** A fake context carrying only what the endpoints read. */
export const testContext = {
	key: API_KEY,
	options: { region: 'us' as const },
} as never;

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
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const pairs = [...parsed.searchParams.entries()];
	const headers = new Headers(init.headers);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(pairs),
		// Every raw query pair, so a repeated key is visible.
		queryPairs: pairs,
		method: init.method,
		headers: Object.fromEntries(headers.entries()),
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://api.userflow.com');
	expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
	// Sending the version explicitly is what the docs recommend.
	expect(sent.headers['userflow-version']).toBe('2020-01-03');
}
