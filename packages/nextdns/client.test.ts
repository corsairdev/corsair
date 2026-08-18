/**
 * Covers the transport: the `X-Api-Key` header, the single-host base URL,
 * and that it never sends a `Bearer` token. Network access is mocked, so
 * this runs in CI.
 */
import { makeNextDNSRequest } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: unknown;
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
			body: init?.body ? JSON.parse(init.body as string) : undefined,
		};

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		// A real `204` has no body and no `Content-Type` - confirmed live
		// (every sub-resource `PATCH` in this catalog returns exactly this).
		// `json()`/`text()` reject/return empty to match, so a test asserting
		// 204 handling can't accidentally pass because the mock still handed
		// back a parseable body.
		const isNoContent = status === 204;
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers(
				isNoContent
					? { ...response.headers }
					: { 'Content-Type': 'application/json', ...response.headers },
			),
			json: async () => {
				if (isNoContent) throw new SyntaxError('Unexpected end of JSON input');
				return payload;
			},
			text: async () => (isNoContent ? '' : JSON.stringify(payload)),
			// Partial `Response` stub; only what the shared request helper reads.
		};
	}) as unknown as typeof global.fetch;
}

describe('makeNextDNSRequest', () => {
	it('sends the X-Api-Key header, not Authorization', async () => {
		mockFetch({ body: { data: [] } });

		await makeNextDNSRequest('/profiles', 'test-key');

		expect(captured?.headers['x-api-key']).toBe('test-key');
		expect(captured?.headers.authorization).toBeUndefined();
	});

	it('targets the single api.nextdns.io host', async () => {
		mockFetch({ body: { data: [] } });

		await makeNextDNSRequest('/profiles', 'test-key');

		expect(captured?.url).toContain('https://api.nextdns.io/');
		expect(captured?.url).toContain('/profiles');
	});

	it('defaults to GET', async () => {
		mockFetch({ body: { data: [] } });

		await makeNextDNSRequest('/profiles', 'test-key');

		expect(captured?.method).toBe('GET');
	});

	it('sends a JSON body on PATCH', async () => {
		mockFetch({ status: 204 });

		await makeNextDNSRequest('/profiles/abc123', 'test-key', {
			method: 'PATCH',
			body: { name: 'Renamed' },
		});

		expect(captured?.method).toBe('PATCH');
		expect(captured?.body).toEqual({ name: 'Renamed' });
	});

	it('sends an array body on PUT (full-replace endpoints)', async () => {
		mockFetch({ body: { data: [] } });

		await makeNextDNSRequest('/profiles/abc123/denylist', 'test-key', {
			method: 'PUT',
			body: [{ id: 'a.com' }, { id: 'b.com' }],
		});

		expect(captured?.method).toBe('PUT');
		expect(captured?.body).toEqual([{ id: 'a.com' }, { id: 'b.com' }]);
	});

	it('serializes query parameters on GET', async () => {
		mockFetch({ body: { data: [] } });

		await makeNextDNSRequest('/profiles/abc123/analytics/status', 'test-key', {
			query: { from: '-7d', limit: 10 },
		});

		expect(captured?.url).toContain('from=-7d');
		expect(captured?.url).toContain('limit=10');
	});

	it('propagates a real ApiError with its status, not a generic wrapper', async () => {
		mockFetch({
			status: 404,
			ok: false,
			body: { errors: [{ code: 'notFound' }] },
		});

		await expect(
			makeNextDNSRequest('/profiles/missing', 'test-key'),
		).rejects.toMatchObject({ status: 404, name: 'ApiError' });
	});
});
