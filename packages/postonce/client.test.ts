/**
 * Covers the transport: bearer auth, the /api/public/v1 base, the
 * Idempotency-Key header, JSON bodies only on writes, and 429 retries.
 * Network access is mocked, so this runs in CI.
 */
import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	compactBody,
	compactQuery,
	makePostOnceRequest,
	POSTONCE_API_BASE,
	segment,
} from './client';

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

describe('makePostOnceRequest', () => {
	it('sends the bearer token and targets /api/public/v1', async () => {
		mockFetch({ body: { data: [] } });

		await makePostOnceRequest('accounts', 'test-key');

		expect(captured?.headers.authorization).toBe('Bearer test-key');
		expect(captured?.url).toBe(`${POSTONCE_API_BASE}/accounts`);
		expect(captured?.method).toBe('GET');
		expect(captured?.headers['idempotency-key']).toBeUndefined();
	});

	it('refuses to call out without an API key', async () => {
		mockFetch({ body: {} });

		await expect(makePostOnceRequest('accounts', '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(captured).toBeUndefined();
	});

	it('sends a JSON body and the Idempotency-Key on POST', async () => {
		mockFetch({ status: 201, body: { data: { id: 'p1' } } });

		await makePostOnceRequest('posts', 'test-key', {
			method: 'POST',
			body: { content: 'hello', targets: [{ account_id: 'a1' }] },
			idempotencyKey: 'launch-1',
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['idempotency-key']).toBe('launch-1');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			content: 'hello',
			targets: [{ account_id: 'a1' }],
		});
	});

	it('sends no body on a bodiless POST', async () => {
		mockFetch({ body: { data: { id: 'p1' } } });

		await makePostOnceRequest('posts/p1/cancel', 'test-key', {
			method: 'POST',
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.body).toBeUndefined();
	});

	it('omits undefined query parameters', async () => {
		mockFetch({ body: { data: [] } });

		await makePostOnceRequest('posts', 'test-key', {
			query: { limit: 10, after: undefined },
		});

		expect(captured?.url).toContain('limit=10');
		expect(captured?.url).not.toContain('after');
	});

	it('keeps the error envelope on the ApiError', async () => {
		mockFetch({
			status: 404,
			body: {
				error: { code: 'post_not_found', message: 'Post not found.' },
			},
		});

		const error = await makePostOnceRequest('posts/missing', 'test-key').catch(
			(e) => e,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
		expect((error as ApiError).body).toEqual({
			error: { code: 'post_not_found', message: 'Post not found.' },
		});
	});

	it('retries a 429 and leaves the eventual ApiError unwrapped', async () => {
		jest.useFakeTimers();
		const limited: MockResponse = {
			status: 429,
			body: {
				error: { code: 'rate_limit_exceeded', message: 'Too many requests.' },
			},
			headers: { 'Retry-After': '0' },
		};
		mockFetchSequence([limited, limited, limited]);

		try {
			const pending = makePostOnceRequest('accounts', 'test-key').catch(
				(e) => e,
			);
			await jest.runAllTimersAsync();
			const error = await pending;

			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(429);
			expect(attempts).toBe(3);
		} finally {
			jest.useRealTimers();
		}
	});
});

describe('helpers', () => {
	it('drops undefined keys', () => {
		expect(compactQuery({ limit: 1, after: undefined })).toEqual({
			limit: 1,
		});
		expect(compactBody({ content: 'a', publish_at: undefined })).toEqual({
			content: 'a',
		});
	});

	it('encodes a path segment so an id cannot change the route', () => {
		expect(segment('a/../b')).toBe('a%2F..%2Fb');
	});
});
