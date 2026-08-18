/**
 * Covers the transport: the `api_key` query parameter, the single-host base
 * URL, and that it never sends a `Bearer` token. Network access is mocked,
 * so this runs in CI.
 */
import { makeSerpapiRequest } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
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
		captured = { url: String(url), method: init?.method ?? 'GET', headers };

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
			// Partial `Response` stub; only what the shared request helper reads.
		};
	}) as unknown as typeof global.fetch;
}

describe('makeSerpapiRequest', () => {
	it('sends api_key as a query parameter, not a header', async () => {
		mockFetch({ body: { search_metadata: { id: '1', status: 'Success' } } });

		await makeSerpapiRequest('/search', 'test-key', {
			query: { engine: 'google', q: 'test' },
		});

		expect(captured?.url).toContain('api_key=test-key');
		expect(captured?.headers.authorization).toBeUndefined();
	});

	it('targets the single serpapi.com host', async () => {
		mockFetch({ body: {} });

		await makeSerpapiRequest('/search', 'test-key', {
			query: { engine: 'google' },
		});

		expect(captured?.url).toContain('https://serpapi.com/');
		expect(captured?.url).toContain('/search');
	});

	it('defaults to GET', async () => {
		mockFetch({ body: {} });

		await makeSerpapiRequest('/search', 'test-key');

		expect(captured?.method).toBe('GET');
	});

	it('merges api_key in even when the caller supplies other query params', async () => {
		mockFetch({ body: {} });

		await makeSerpapiRequest('/search', 'test-key', {
			query: { engine: 'youtube', search_query: 'lofi' },
		});

		expect(captured?.url).toContain('engine=youtube');
		expect(captured?.url).toContain('search_query=lofi');
		expect(captured?.url).toContain('api_key=test-key');
	});

	it('never lets a caller-supplied api_key override the real one', async () => {
		mockFetch({ body: {} });

		await makeSerpapiRequest('/search', 'real-key', {
			query: { engine: 'google', api_key: 'attacker-supplied-key' },
		});

		expect(new URL(captured?.url ?? '').searchParams.get('api_key')).toBe(
			'real-key',
		);
	});

	it('rejects a blank API key before fetching', async () => {
		mockFetch({ body: {} });

		await expect(makeSerpapiRequest('/search', '   ')).rejects.toThrow(
			'SerpApi API key is required',
		);
		expect(captured).toBeUndefined();
	});

	it('propagates a real ApiError with its status, not a generic wrapper', async () => {
		mockFetch({
			status: 401,
			ok: false,
			body: { error: 'Invalid API key.' },
		});

		await expect(
			makeSerpapiRequest('/search', 'bad-key', { query: { engine: 'google' } }),
		).rejects.toMatchObject({ status: 401, name: 'ApiError' });
	});
});
