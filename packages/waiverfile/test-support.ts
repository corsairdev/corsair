export const API_KEY = 'wf-test-api-key';
export const SITE_ID = '00000000-0000-0000-0000-000000000001';

/** The packed form a Corsair key holds: the API key, a newline, the site ID. */
export const PACKED_KEY = `${API_KEY}\n${SITE_ID}`;

/** A fake context carrying only what the endpoints read. */
export const testContext = { key: PACKED_KEY } as never;

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
export async function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(testContext, input as never);
}

export function installFetchMock() {
	const unmocked = () => {
		throw new Error('unmocked fetch in a unit test');
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(unmocked);
	afterEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(unmocked);
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

export function respondText(
	fetchMock: jest.SpyInstance,
	body: string,
	contentType: string,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, {
			status: 200,
			headers: { 'Content-Type': contentType },
		}),
	);
}

/**
 * Both credentials travel as query parameters on every route — there is no
 * bearer token and no auth header.
 */
export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://api.waiverfile.com');
	expect(sent.path.startsWith('/api/v1/')).toBe(true);
	expect(sent.query.apiKey).toBe(API_KEY);
	expect(sent.query.siteID).toBe(SITE_ID);
	expect(sent.headers['authorization']).toBeUndefined();
}
