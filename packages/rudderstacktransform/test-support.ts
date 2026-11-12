import { asRecord } from 'corsair/core';

/**
 * The fake context the endpoints read: `key`, the plugin options that carry the
 * region, plus logging and db stubs.
 */
export function testContext(
	apiKey = 'rudderstack-test-key',
	region: 'us' | 'eu' = 'us',
) {
	return {
		key: apiKey,
		authType: 'api_key' as const,
		options: { region },
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
	region: 'us' | 'eu' = 'us',
) {
	return endpoint(testContext(undefined, region) as never, input as never);
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
