/**
 * Covers the transport: the x-publora-key header, the /api/v1 base, the
 * Idempotency-Key header, JSON bodies only on writes, query compaction and
 * 429 retries. Network access is mocked, so this runs in CI.
 */
import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	compactBody,
	compactQuery,
	makePubloraRequest,
	PUBLORA_API_BASE,
	segment,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

type MockResponse = {
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
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
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

describe('makePubloraRequest', () => {
	it('sends the key in x-publora-key and targets /api/v1', async () => {
		mockFetch({ body: { success: true, connections: [] } });

		await makePubloraRequest('platform-connections', 'sk_test.key');

		expect(captured?.url).toBe(`${PUBLORA_API_BASE}/platform-connections`);
		expect(captured?.method).toBe('GET');
		expect(captured?.headers['x-publora-key']).toBe('sk_test.key');
		expect(captured?.headers['x-publora-client']).toBe('corsair');
		expect(captured?.headers.authorization).toBeUndefined();
		expect(captured?.headers['idempotency-key']).toBeUndefined();
	});

	it('refuses to call out without an API key', async () => {
		mockFetch({ body: {} });

		await expect(
			makePubloraRequest('platform-connections', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(captured).toBeUndefined();
	});

	it('sends a JSON body and the Idempotency-Key on POST', async () => {
		mockFetch({ body: { success: true, postGroupId: 'g1' } });

		await makePubloraRequest('create-post', 'sk_test.key', {
			method: 'POST',
			body: { content: 'hello', platforms: ['linkedin-ABC'] },
			idempotencyKey: 'launch-1',
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['idempotency-key']).toBe('launch-1');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			content: 'hello',
			platforms: ['linkedin-ABC'],
		});
	});

	it('sends no body on DELETE', async () => {
		mockFetch({ body: { success: true } });

		await makePubloraRequest('delete-post/g1', 'sk_test.key', {
			method: 'DELETE',
			body: { ignored: true },
		});

		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toBeUndefined();
	});

	it('drops undefined query values', async () => {
		mockFetch({ body: { success: true, posts: [] } });

		await makePubloraRequest('list-posts', 'sk_test.key', {
			query: { page: 2, status: undefined, limit: 50 },
		});

		const url = new URL(captured?.url ?? '');
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('limit')).toBe('50');
		expect(url.searchParams.has('status')).toBe(false);
	});

	it('keeps a Publora error as ApiError with its body', async () => {
		mockFetch({ status: 404, body: { error: 'Post group not found' } });

		const error = await makePubloraRequest('get-post/g1', 'sk_test.key').catch(
			(e: unknown) => e,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
		expect((error as ApiError).body).toEqual({ error: 'Post group not found' });
	});

	it('strips what was sent from a propagated error, keeping status and code', async () => {
		mockFetch({
			status: 400,
			body: {
				error: 'Media could not be downloaded',
				code: 'MEDIA_URL_UNREACHABLE',
				mediaResults: [
					{ url: 'https://private.example.com/a.png?sig=s3cr3t', code: 'X' },
				],
			},
		});

		const error = (await makePubloraRequest('create-post', 'sk_test.key', {
			method: 'POST',
			body: {
				content: 'Call jane@example.com about the launch',
				platforms: ['linkedin-ABC123'],
				mediaUrls: ['https://private.example.com/a.png?sig=s3cr3t'],
			},
		}).catch((e: unknown) => e)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(400);
		expect(error.body.code).toBe('MEDIA_URL_UNREACHABLE');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		const serialized = JSON.stringify({ ...error, message: error.message });
		expect(serialized).not.toContain('jane@example.com');
		expect(serialized).not.toContain('s3cr3t');
		expect(serialized).not.toContain('sk_test.key');
	});

	it('retries a 429 that carries Retry-After', async () => {
		mockFetchSequence([
			{
				status: 429,
				body: { error: 'Too many requests' },
				headers: { 'Retry-After': '0' },
			},
			{ body: { success: true, connections: [] } },
		]);

		const result = await makePubloraRequest<{ success: boolean }>(
			'platform-connections',
			'sk_test.key',
		);

		expect(result.success).toBe(true);
		expect(attempts).toBe(2);
	});
});

describe('helpers', () => {
	it('compactQuery and compactBody drop undefined values only', () => {
		expect(compactQuery({ a: 1, b: undefined, c: false })).toEqual({
			a: 1,
			c: false,
		});
		expect(compactBody({ a: null, b: undefined, c: [] })).toEqual({
			a: null,
			c: [],
		});
	});

	it('segment encodes a path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment('507f1f77bcf86cd799439011')).toBe(
			'507f1f77bcf86cd799439011',
		);
	});
});
