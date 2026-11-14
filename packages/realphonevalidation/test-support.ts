/** The fake context the endpoints read: `key`, plus logging and db stubs. */
export function testContext(apiKey = 'rpv-test-token') {
	return {
		key: apiKey,
		authType: 'api_key' as const,
		log: jest.fn().mockResolvedValue(undefined),
		db: {},
	};
}

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Result is the endpoint's own output type, so a
// test reads typed fields with no cast.
export type AnyEndpoint<Result> = (ctx: never, input: never) => Promise<Result>;

// unknown: negative cases pass values no schema accepts. The never casts hand
// the fake context and raw input to an endpoint typed for the real ones; the
// endpoint parses both at runtime.
export function invoke<Result>(
	endpoint: AnyEndpoint<Result>,
	input: unknown,
): Promise<Result> {
	return endpoint(testContext() as never, input as never);
}

export type CapturedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	method?: string;
	headers: Headers;
};

export function lastRequest(fetchMock: jest.SpyInstance): CapturedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

// unknown: response bodies are arbitrary JSON or text.
export function respond(
	fetchMock: jest.SpyInstance,
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}
