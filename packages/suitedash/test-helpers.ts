import type { UnknownJson } from './json';

export type CapturedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	method: string | undefined;
	headers: Headers;
	// unknown: the serialized request body, either parsed JSON or flattened parts.
	body: UnknownJson;
};

/**
 * Reads the last request. A JSON body is parsed and a FormData body is flattened,
 * so a route that uploads does not fail the harness on `"[object FormData]"`.
 */
export function lastRequest(fetchMock: jest.SpyInstance): CapturedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body:
			init.body instanceof FormData
				? Object.fromEntries(
						[...init.body.entries()].map(([k, v]) => [
							k,
							typeof v === 'string' ? v : `file:${v.name}`,
						]),
					)
				: init.body
					? (JSON.parse(String(init.body)) as UnknownJson)
					: undefined,
	};
}

// unknown: response bodies are arbitrary JSON.
export function respond(
	fetchMock: jest.SpyInstance,
	body: UnknownJson,
	status = 200,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}
