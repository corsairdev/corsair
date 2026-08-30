import { AuthMissingError } from 'corsair/core';
import {
	ASHBY_API_BASE,
	ASHBY_RATE_LIMIT_CONFIG,
	AshbyAPIError,
	buildAshbyBasicAuthHeader,
	makeAshbyRequest,
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
			text: async () =>
				typeof payload === 'string' ? payload : JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('Ashby Client', () => {
	describe('buildAshbyBasicAuthHeader', () => {
		it('formats API key as HTTP Basic Auth with key as username and empty password', () => {
			const apiKey = 'test-api-key-12345';
			const expectedEncoded = Buffer.from('test-api-key-12345:').toString(
				'base64',
			);
			expect(buildAshbyBasicAuthHeader(apiKey)).toBe(
				`Basic ${expectedEncoded}`,
			);
		});
	});

	describe('makeAshbyRequest', () => {
		it('targets the Ashby API base URL with POST method and Basic auth', async () => {
			mockFetch({ body: { success: true, results: { id: 'cand_123' } } });

			const apiKey = 'sec_key_abc';
			const result = await makeAshbyRequest<{
				success: boolean;
				results: { id: string };
			}>('candidate.info', apiKey, {
				body: { candidateId: 'cand_123' },
			});

			expect(captured?.url).toBe(`${ASHBY_API_BASE}/candidate.info`);
			expect(captured?.method).toBe('POST');
			expect(captured?.headers.authorization).toBe(
				`Basic ${Buffer.from('sec_key_abc:').toString('base64')}`,
			);
			expect(captured?.headers['content-type']).toContain('application/json');
			expect(JSON.parse(captured?.body ?? '{}')).toEqual({
				candidateId: 'cand_123',
			});
			expect(result.results.id).toBe('cand_123');
		});

		it('handles endpoints with leading slash gracefully', async () => {
			mockFetch({ body: { success: true, results: [] } });

			await makeAshbyRequest('/candidate.list', 'test-key', {
				body: { limit: 10 },
			});

			expect(captured?.url).toBe(`${ASHBY_API_BASE}/candidate.list`);
			expect(captured?.method).toBe('POST');
		});

		it('rejects empty or whitespace API keys before calling the transport', async () => {
			attempts = 0;
			await expect(
				makeAshbyRequest('candidate.info', ''),
			).rejects.toBeInstanceOf(AuthMissingError);
			await expect(
				makeAshbyRequest('candidate.info', '   '),
			).rejects.toBeInstanceOf(AuthMissingError);
			expect(attempts).toBe(0);
		});

		it('maps success:false resource_not_found to status 404', async () => {
			mockFetch({
				body: {
					success: false,
					errors: [
						{
							code: 'resource_not_found',
							message: 'Candidate not found',
						},
					],
				},
			});

			await expect(
				makeAshbyRequest('candidate.info', 'test-key', {
					body: { candidateId: 'missing' },
				}),
			).rejects.toMatchObject({
				name: 'AshbyAPIError',
				status: 404,
				code: 'resource_not_found',
			});
		});

		it('throws AshbyAPIError when response has success: false envelope', async () => {
			mockFetch({
				body: {
					success: false,
					errors: [
						{
							code: 'missing_endpoint_permission',
							message: 'Missing candidate write permission',
						},
					],
				},
			});

			await expect(
				makeAshbyRequest('candidate.create', 'test-key', {
					body: { name: 'Test' },
				}),
			).rejects.toMatchObject({
				name: 'AshbyAPIError',
				status: 403,
				code: 'missing_endpoint_permission',
			});
		});

		it('does not retry 429 at the transport layer', async () => {
			mockFetchSequence([
				{ status: 429, body: {}, headers: { 'Retry-After': '1' } },
				{ status: 200, body: { success: true, results: { id: '1' } } },
			]);

			await expect(
				makeAshbyRequest('candidate.info', 'test-key', {
					body: { candidateId: '1' },
				}),
			).rejects.toBeInstanceOf(AshbyAPIError);
			expect(attempts).toBe(1);
			expect(ASHBY_RATE_LIMIT_CONFIG.enabled).toBe(true);
			expect(ASHBY_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
		});

		it('stores retryAfter on AshbyAPIError', () => {
			const err = new AshbyAPIError(
				'Too many requests',
				429,
				'rate_limit_exceeded',
				undefined,
				4000,
			);
			expect(err.retryAfter).toBe(4000);
		});

		it('parses HTTP 403 ApiError into AshbyAPIError with status and code', async () => {
			mockFetch({
				status: 403,
				body: {
					success: false,
					errors: [
						{
							code: 'missing_endpoint_permission',
							message: 'Access forbidden',
						},
					],
				},
			});

			await expect(
				makeAshbyRequest('candidate.anonymize', 'test-key', {
					body: { candidateId: '123' },
				}),
			).rejects.toMatchObject({
				name: 'AshbyAPIError',
				status: 403,
				code: 'missing_endpoint_permission',
			});
		});
	});
});
