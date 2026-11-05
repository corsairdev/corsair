type MockResponse = {
	status?: number;
	// unknown: any canned JSON response body.
	body?: unknown;
	headers?: Record<string, string>;
};

export type SentRequest = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// unknown: the request body as sent, parsed back from JSON.
	body: unknown;
};

/** Answers fetch calls with `responses` in order; restore with jest.restoreAllMocks(). */
export function mockFetch(...responses: MockResponse[]) {
	const requests: SentRequest[] = [];
	jest.spyOn(global, 'fetch').mockImplementation(async (url, init) => {
		requests.push({
			url: new URL(String(url)),
			method: init?.method ?? 'GET',
			headers: Object.fromEntries(new Headers(init?.headers)),
			body: typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body,
		});
		const { status = 200, body = {}, headers } = responses.shift() ?? {};
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		});
	});
	return requests;
}
