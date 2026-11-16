import { asRecord } from 'corsair/core';

/**
 * The fake context the endpoints read. `key` carries both credentials packed
 * together, which is what the real key builder produces.
 */
export function testContext(key = 'u301-test-key\nws_test_123') {
	return {
		key,
		authType: 'api_key' as const,
		log: jest.fn().mockResolvedValue(undefined),
		db: {},
	};
}

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Output is inferred from the endpoint, so each
// result keeps its real type.
// unknown: negative cases pass values no schema accepts.
export function invoke<Output>(
	endpoint: (ctx: never, input: never) => Promise<Output>,
	input: unknown,
	key?: string,
): Promise<Output> {
	// never: the endpoint reads only key and log off the fake context, and its
	// input schema parses whatever the test passes.
	return endpoint(testContext(key) as never, input as never);
}

export type CapturedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	method?: string;
	headers: Headers;
	// unknown: the body is the JSON the endpoint sent.
	body: unknown;
	// unknown: a body is arbitrary JSON, narrowed by asRecord.
	bodyRecord: Record<string, unknown> | null;
	/** The body when it is a JSON array, which the bulk route sends. */
	bodyArray: unknown[] | null;
};

export function lastRequest(fetchMock: jest.SpyInstance): CapturedRequest {
	// The spy records fetch's arguments untyped; makeU301Request always calls
	// fetch(url string, init).
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	// unknown: JSON.parse returns any; the body is narrowed by asRecord below.
	const parsedBody = init.body
		? (JSON.parse(String(init.body)) as unknown)
		: undefined;
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: parsedBody,
		bodyRecord: asRecord(parsedBody),
		bodyArray: Array.isArray(parsedBody) ? parsedBody : null,
	};
}

// unknown: response bodies are arbitrary JSON.
export function respond(
	fetchMock: jest.SpyInstance,
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
		}),
	);
}
