/** The fake context the endpoints read: `key`, plus logging and db stubs. */
export function testContext(apiKey = 'unisender-test-key') {
	return {
		key: apiKey,
		authType: 'api_key' as const,
		log: jest.fn().mockResolvedValue(undefined),
		db: {},
	};
}

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
export type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
export function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(testContext() as never, input as never);
}

export type CapturedRequest = {
	origin: string;
	path: string;
	/** The form fields, decoded, with repeated keys kept as arrays. */
	form: Record<string, string | string[]>;
	method?: string;
	contentType: string | null;
	/** The raw body, for asserting the encoding itself. */
	rawBody: string;
};

export function lastRequest(fetchMock: jest.SpyInstance): CapturedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const rawBody = String(init.body ?? '');
	const params = new URLSearchParams(rawBody);
	const form: Record<string, string | string[]> = {};
	for (const key of new Set(params.keys())) {
		const all = params.getAll(key);
		form[key] = all.length > 1 ? all : (all[0] ?? '');
	}
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		form,
		method: init.method,
		contentType: new Headers(init.headers).get('content-type'),
		rawBody,
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
