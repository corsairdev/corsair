import { asRecord } from 'corsair/core';

/**
 * The fake context the endpoints read: `key`, the plugin options that carry the
 * server, plus logging and db stubs.
 */
export function testContext(
	apiKey = 'ragic-test-key',
	server = 'www.ragic.com',
) {
	return {
		key: apiKey,
		authType: 'api_key' as const,
		options: { server },
		log: jest.fn().mockResolvedValue(undefined),
		db: {},
	};
}

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
export type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
export function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	server = 'www.ragic.com',
) {
	return endpoint(testContext(undefined, server) as never, input as never);
}

export type CapturedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	queryAll: (name: string) => string[];
	method?: string;
	headers: Headers;
	// unknown: the body is the JSON the endpoint sent.
	body: unknown;
	// unknown: a body is arbitrary JSON, narrowed by asRecord.
	bodyRecord: Record<string, unknown> | null;
	/** The multipart body, when the request sent one. */
	formData?: FormData;
};

export function lastRequest(fetchMock: jest.SpyInstance): CapturedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	if (init.body instanceof FormData) {
		return {
			origin: parsed.origin,
			path: parsed.pathname,
			query: Object.fromEntries(parsed.searchParams),
			queryAll: (name: string) => parsed.searchParams.getAll(name),
			method: init.method,
			headers: new Headers(init.headers),
			body: undefined,
			bodyRecord: null,
			formData: init.body,
		};
	}
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		queryAll: (name: string) => parsed.searchParams.getAll(name),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
		bodyRecord: asRecord(
			init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
		),
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
