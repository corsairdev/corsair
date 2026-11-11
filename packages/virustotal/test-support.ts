export const API_KEY = 'vt-test-key';

/** A fake context carrying only what the endpoints read. */
export const testContext = { key: API_KEY } as never;

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: parameters are contravariant, so `never` lets every concrete endpoint
// be passed here, while each endpoint's own output type is what actually returns.
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
	/** The raw request body as sent, before any parsing. */
	rawBody: string | undefined;
	// unknown: the body, parsed as JSON when it is JSON.
	body: unknown;
};

export function lastRequest(fetchMock: jest.SpyInstance): RecordedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const pairs = [...parsed.searchParams.entries()];
	const headers = new Headers(init.headers);
	const rawBody =
		init.body === undefined || init.body === null
			? undefined
			: String(init.body);
	// unknown: the raw request body, before any JSON parsing; each caller narrows it.
	let body: unknown;
	if (rawBody !== undefined) {
		try {
			body = JSON.parse(rawBody) as unknown;
		} catch {
			// The URL scan posts a form body, so it is not JSON.
			body = rawBody;
		}
	}
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(pairs),
		queryPairs: pairs,
		method: init.method,
		headers: Object.fromEntries(headers.entries()),
		rawBody,
		body,
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

export function respondEmpty(fetchMock: jest.SpyInstance, status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://www.virustotal.com');
	expect(sent.path.startsWith('/api/v3/')).toBe(true);
	// The key goes in x-apikey, not a bearer token.
	expect(sent.headers['x-apikey']).toBe(API_KEY);
	expect(sent.headers['authorization']).toBeUndefined();
}
