export const PUSH_KEY = 'push-test-key';
export const WEBHOOK_SECRET = 'whsec_test_secret';

/** A fake context carrying only what the endpoints read. */
export const testContext = { key: PUSH_KEY } as never;

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

export function respondEmpty(fetchMock: jest.SpyInstance, status = 202) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: response bodies are arbitrary JSON.
export function respond(
	fetchMock: jest.SpyInstance,
	body: unknown,
	status: number,
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
	method: string | undefined;
	/** Header names are lowercased by the Headers class. */
	headers: Record<string, string>;
	// unknown: the request body is whatever the endpoint serialized.
	body: unknown;
};

export function lastRequest(fetchMock: jest.SpyInstance): RecordedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const headers = new Headers(init.headers);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams.entries()),
		method: init.method,
		headers: Object.fromEntries(headers.entries()),
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

export function expectAuthenticated(fetchMock: jest.SpyInstance) {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://push.userlist.com');
	// The scheme is `Push`, not Bearer — a Bearer token is a 401.
	expect(sent.headers['authorization']).toBe(`Push ${PUSH_KEY}`);
}

export function expectAcknowledgement(
	// unknown: the endpoint's shaped result.
	result: unknown,
	operation: string,
) {
	expect(result).toMatchObject({ accepted: true, operation });
}
