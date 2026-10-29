/**
 * Covers the transport: the `SGAI-APIKEY` header (not a Bearer token), the
 * single-host base URL, method/body/query wiring, and error propagation.
 * Network access is mocked, so this runs in CI.
 */
import {
	makeScrapegraphAiRequest,
	ScrapegraphAiAPIError,
	ScrapegraphAiRateLimitError,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: unknown;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
};

let captured: Captured | undefined;

function mockFetch(response: MockResponse) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body ? JSON.parse(String(init.body)) : undefined,
		};

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Retry-After': '0',
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeScrapegraphAiRequest', () => {
	it('sends the API key as an SGAI-APIKEY header, not a Bearer token', async () => {
		mockFetch({ body: { remaining_credits: 100 } });

		await makeScrapegraphAiRequest('v1/credits', 'sgai-test-key', {
			method: 'GET',
		});

		expect(captured?.headers['sgai-apikey']).toBe('sgai-test-key');
		expect(captured?.headers.authorization).toBeUndefined();
	});

	it('targets the api.scrapegraphai.com host under /v1', async () => {
		mockFetch({ body: {} });

		await makeScrapegraphAiRequest('v1/smartscraper', 'key', {
			method: 'POST',
			body: { user_prompt: 'test' },
		});

		expect(captured?.url).toBe('https://api.scrapegraphai.com/v1/smartscraper');
	});

	it('defaults to GET', async () => {
		mockFetch({ body: {} });

		await makeScrapegraphAiRequest('v1/credits', 'key');

		expect(captured?.method).toBe('GET');
	});

	it('sends a JSON body on POST requests', async () => {
		mockFetch({ body: { request_id: 'abc' } });

		await makeScrapegraphAiRequest('v1/searchscraper', 'key', {
			method: 'POST',
			body: { user_prompt: 'find the docs', num_results: 5 },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.body).toEqual({
			user_prompt: 'find the docs',
			num_results: 5,
		});
	});

	it('appends query parameters on GET requests', async () => {
		mockFetch({ body: { requests: [] } });

		await makeScrapegraphAiRequest('v1/history/smartscraper', 'key', {
			method: 'GET',
			query: { page: 2, page_size: 10 },
		});

		expect(captured?.url).toContain('page=2');
		expect(captured?.url).toContain('page_size=10');
	});

	it('rejects a blank API key before fetching', async () => {
		mockFetch({ body: {} });

		await expect(makeScrapegraphAiRequest('v1/credits', '   ')).rejects.toThrow(
			'ScrapeGraphAI API key is required',
		);
		expect(captured).toBeUndefined();
	});

	it('propagates a real ApiError status through ScrapegraphAiAPIError', async () => {
		mockFetch({ status: 401, ok: false, body: { detail: 'Invalid API key' } });

		await expect(
			makeScrapegraphAiRequest('v1/credits', 'bad-key'),
		).rejects.toMatchObject({
			name: 'ScrapegraphAiAPIError',
			status: 401,
		});
	});

	it('surfaces a 402 insufficient-credits response with its status intact', async () => {
		mockFetch({
			status: 402,
			ok: false,
			body: { detail: 'Insufficient credits' },
		});

		const error = await makeScrapegraphAiRequest('v1/smartscraper', 'key', {
			method: 'POST',
			body: { user_prompt: 'x', website_url: 'https://example.com' },
		}).catch((e) => e);

		expect(error).toBeInstanceOf(ScrapegraphAiAPIError);
		expect((error as ScrapegraphAiAPIError).status).toBe(402);
	});

	it('throws ScrapegraphAiRateLimitError on HTTP 429', async () => {
		mockFetch({
			status: 429,
			ok: false,
			body: { detail: 'Too Many Requests' },
		});

		const error = await makeScrapegraphAiRequest('v1/credits', 'key').catch(
			(e) => e,
		);

		expect(error).toBeInstanceOf(ScrapegraphAiRateLimitError);
		expect((error as ScrapegraphAiRateLimitError).status).toBe(429);
	});
});
