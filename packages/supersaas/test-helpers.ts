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

/** A documented empty 201, where the id lives only in a Location header. */
export function respondCreated(fetchMock: jest.SpyInstance) {
	fetchMock.mockResolvedValueOnce(
		new Response(null, {
			status: 201,
			headers: { Location: 'https://www.supersaas.com/api/users/123456.json' },
		}),
	);
}

/** A documented empty 200, which is what a delete answers. */
export function respondEmpty(fetchMock: jest.SpyInstance) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
}
