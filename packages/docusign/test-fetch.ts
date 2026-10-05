export function joinUrl(base: string, path: string): string {
	const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function mockFetchJson(body: unknown = {}): jest.Mock {
	const fetchMock = jest.fn().mockImplementation(() =>
		Promise.resolve(
			new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		),
	);
	globalThis.fetch = fetchMock;
	return fetchMock;
}

export function mockFetchText(body: string): jest.Mock {
	const fetchMock = jest.fn().mockImplementation(() =>
		Promise.resolve(
			new Response(body, {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			}),
		),
	);
	globalThis.fetch = fetchMock;
	return fetchMock;
}

export function lastFetchCall(): { url: string; init: RequestInit } {
	const calls = (globalThis.fetch as jest.Mock).mock.calls;
	const last = calls[calls.length - 1];
	if (!last) {
		throw new Error('expected fetch to be called');
	}
	return { url: String(last[0]), init: last[1] as RequestInit };
}
