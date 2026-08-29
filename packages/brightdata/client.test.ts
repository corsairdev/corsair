import { BrightDataAPIError, makeBrightDataRequest } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
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
			body: init?.body as string | undefined,
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
				...response.headers,
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeBrightDataRequest', () => {
	it('sends Authorization header with Bearer token', async () => {
		mockFetch({ body: { status: 200, body: '<html>ok</html>' } });

		await makeBrightDataRequest('request', 'test-api-key', {
			method: 'POST',
			body: { zone: 'unblocker', url: 'https://example.com' },
		});

		expect(captured?.headers.authorization).toBe('Bearer test-api-key');
		expect(captured?.url).toContain('https://api.brightdata.com/request');
		expect(captured?.method).toBe('POST');
	});

	it('rejects an empty API key', async () => {
		mockFetch({ body: {} });

		await expect(makeBrightDataRequest('request', '   ')).rejects.toThrow(
			BrightDataAPIError,
		);
		expect(captured).toBeUndefined();
	});

	it('handles GET requests with query parameters', async () => {
		mockFetch({ body: { status: 'ready', progress: 100 } });

		await makeBrightDataRequest('datasets/v3/progress/s_123', 'test-key', {
			method: 'GET',
		});

		expect(captured?.method).toBe('GET');
		expect(captured?.url).toContain('https://api.brightdata.com/datasets/v3/progress/s_123');
	});

	it('handles custom request headers', async () => {
		mockFetch({ body: { success: true } });

		await makeBrightDataRequest('request', 'test-key', {
			method: 'POST',
			body: { zone: 'serp', url: 'https://www.google.com/search?q=test' },
			headers: { 'x-unblock-data-format': 'parsed_light' },
		});

		expect(captured?.headers['x-unblock-data-format']).toBe('parsed_light');
	});
});
