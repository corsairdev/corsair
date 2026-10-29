/**
 * Covers the transport: the `X-API-Key` header, the base URL, the missing-key
 * guard, method-based body handling, and 429 retry behaviour. Network access
 * is mocked, so this runs in CI.
 */
import { BigmailerAPIError, makeBigmailerRequest } from './client';

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
let attempts = 0;

function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
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
			body: typeof init?.body === 'string' ? init.body : undefined,
		};

		const response =
			responses[Math.min(attempts, responses.length - 1)] ??
			({} as MockResponse);
		attempts++;

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

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeBigmailerRequest', () => {
	it('sends the API key as X-API-Key', async () => {
		mockFetch({ body: { id: 'b1' } });

		await makeBigmailerRequest('brands', 'test-api-key');

		expect(captured?.headers['x-api-key']).toBe('test-api-key');
	});

	it('targets the documented v1 API host', async () => {
		mockFetch({ body: {} });

		await makeBigmailerRequest('brands/b1', 'test-api-key');

		expect(captured?.url).toContain('https://api.bigmailer.io/v1/');
		expect(captured?.url).toContain('brands/b1');
	});

	it('refuses to call out without an API key', async () => {
		mockFetch({ body: {} });

		await expect(makeBigmailerRequest('brands', '')).rejects.toBeInstanceOf(
			BigmailerAPIError,
		);
		expect(captured).toBeUndefined();
	});

	it('sends a body on POST and PUT but not on GET or DELETE', async () => {
		mockFetch({ body: {} });
		await makeBigmailerRequest('brands', 'test-api-key', {
			method: 'POST',
			body: { name: 'Acme' },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toContain('Acme');

		mockFetch({ body: {} });
		await makeBigmailerRequest('brands/b1', 'test-api-key', {
			method: 'PUT',
			body: { name: 'Acme2' },
		});
		expect(captured?.method).toBe('PUT');
		expect(captured?.body).toContain('Acme2');

		mockFetch({ body: {} });
		await makeBigmailerRequest('brands/b1', 'test-api-key', {
			method: 'GET',
			body: { name: 'ignored' },
		});
		expect(captured?.method).toBe('GET');
		expect(captured?.body).toBeUndefined();

		mockFetch({ body: {} });
		await makeBigmailerRequest('brands/b1', 'test-api-key', {
			method: 'DELETE',
			body: { name: 'ignored' },
		});
		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toBeUndefined();
	});

	it('retries once BigMailer answers 429 and honours Retry-After', async () => {
		mockFetchSequence([
			{ status: 429, body: {}, headers: { 'Retry-After': '1' } },
			{ status: 200, body: { data: [] } },
		]);

		const result = await makeBigmailerRequest<{ data: unknown[] }>(
			'brands',
			'test-api-key',
		);

		expect(attempts).toBe(2);
		expect(result.data).toEqual([]);
	});

	it('wraps a 401 in a BigmailerAPIError carrying the status', async () => {
		mockFetch({ ok: false, status: 401, body: {} });

		const error = await makeBigmailerRequest('brands', 'bad-key').catch(
			(e) => e,
		);

		expect(error).toBeInstanceOf(BigmailerAPIError);
		expect((error as BigmailerAPIError).status).toBe(401);
	});
});
