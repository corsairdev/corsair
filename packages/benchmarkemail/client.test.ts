import { ApiError } from 'corsair/http';
import { BenchmarkEmailAPIError, makeBenchmarkEmailRequest } from './client';

/**
 * Client transport tests, modelled on the merged ActiveCampaign plugin's
 * `client.test.ts`: `globalThis.fetch` is stubbed so every assertion below
 * observes the real wire behaviour of `makeBenchmarkEmailRequest` through
 * `corsair/http` - headers, URL, body serialisation, credential gating
 * and the 429 retry path.
 */

const BASE = 'https://clientapi.benchmarkemail.com';
const TOKEN = 'test-admin-token';

function readHeaders(init: RequestInit | undefined): Record<string, string> {
	const raw = init?.headers;
	if (!raw) return {};
	if (raw instanceof Headers) return Object.fromEntries(raw.entries());
	if (Array.isArray(raw)) return Object.fromEntries(raw);
	return Object.fromEntries(
		Object.entries(raw as Record<string, string>).map(([k, v]) => [k, v]),
	);
}

function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

describe('Benchmark Email client', () => {
	const originalFetch = globalThis.fetch;
	let calls: Array<{ url: string; init?: RequestInit }>;
	let responder: (call: number) => Response;

	beforeEach(() => {
		calls = [];
		responder = () => jsonResponse({ ok: true });
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			const response = responder(calls.length);
			calls.push({ url: String(url), init });
			return response;
		}) as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	describe('credential validation', () => {
		it.each(['', undefined])(
			'rejects a missing API token (%s) before issuing a request',
			async (token) => {
				await expect(
					makeBenchmarkEmailRequest('Contact/ActiveCount', token as string),
				).rejects.toBeInstanceOf(BenchmarkEmailAPIError);
				expect(calls).toHaveLength(0);
			},
		);

		it('names the missing-credential code', async () => {
			const error = await makeBenchmarkEmailRequest(
				'Contact/ActiveCount',
				'',
			).catch((e: unknown) => e);
			expect(error).toBeInstanceOf(BenchmarkEmailAPIError);
			expect((error as BenchmarkEmailAPIError).code).toBe('MISSING_API_TOKEN');
		});
	});

	describe('request shape', () => {
		it('targets the classic API base URL with the endpoint path', async () => {
			await makeBenchmarkEmailRequest('Contact/ActiveCount', TOKEN);
			expect(calls).toHaveLength(1);
			expect(calls[0]?.url).toBe(`${BASE}/Contact/ActiveCount`);
		});

		it('sends the token in the AuthToken header and never in the URL', async () => {
			await makeBenchmarkEmailRequest('Contact/ActiveCount', TOKEN);
			const headers = readHeaders(calls[0]?.init);
			const names = Object.keys(headers).map((h) => h.toLowerCase());
			expect(names).toContain('authtoken');
			expect(headers.authtoken).toBe(TOKEN);
			// A key in the URL would leak into logs and referrers.
			expect(calls[0]?.url).not.toContain(TOKEN);
			// No bearer scheme: the classic API authenticates only via AuthToken.
			expect(names).not.toContain('authorization');
		});

		it('sends no body on GET', async () => {
			await makeBenchmarkEmailRequest('Contact/ActiveCount', TOKEN, {
				method: 'GET',
			});
			expect(calls[0]?.init?.method).toBe('GET');
			expect(calls[0]?.init?.body).toBeUndefined();
		});

		it('serialises a POST body as JSON', async () => {
			await makeBenchmarkEmailRequest('Contact/list_1/ContactDetails', TOKEN, {
				method: 'POST',
				body: { email: 'jane@example.com' },
			});
			expect(calls[0]?.init?.method).toBe('POST');
			expect(typeof calls[0]?.init?.body).toBe('string');
			expect(JSON.parse(calls[0]?.init?.body as string)).toEqual({
				email: 'jane@example.com',
			});
			expect(readHeaders(calls[0]?.init)['content-type']).toContain(
				'application/json',
			);
		});

		it('forwards an explicitly supplied DELETE body as JSON', async () => {
			await makeBenchmarkEmailRequest('Contact/ContactDetails', TOKEN, {
				method: 'DELETE',
				body: { emails: ['jane@example.com'] },
			});
			expect(calls[0]?.init?.method).toBe('DELETE');
			expect(typeof calls[0]?.init?.body).toBe('string');
			expect(JSON.parse(calls[0]?.init?.body as string)).toEqual({
				emails: ['jane@example.com'],
			});
		});

		it('sends no body on a DELETE without a supplied payload', async () => {
			await makeBenchmarkEmailRequest(
				'Contact/list_1/ContactDetails/1',
				TOKEN,
				{
					method: 'DELETE',
				},
			);
			expect(calls[0]?.init?.method).toBe('DELETE');
			expect(calls[0]?.init?.body).toBeUndefined();
		});

		it('appends defined query params to the URL', async () => {
			await makeBenchmarkEmailRequest('Contact/list_1/ContactDetails', TOKEN, {
				method: 'GET',
				query: { page: 2, pageSize: 25, search: undefined },
			});
			expect(calls[0]?.url).toContain('page=2');
			expect(calls[0]?.url).toContain('pageSize=25');
			expect(calls[0]?.url).not.toContain('search');
		});

		it('resolves with the parsed response body', async () => {
			responder = () => jsonResponse({ total: 7 });
			const result = await makeBenchmarkEmailRequest<{ total: number }>(
				'Contact/ActiveCount',
				TOKEN,
			);
			expect(result).toEqual({ total: 7 });
		});
	});

	describe('error surfacing', () => {
		it('surfaces a 401 as ApiError with status 401 and no retry', async () => {
			responder = () =>
				jsonResponse({ errors: [{ errorType: 'UnauthorizedError' }] }, 401);
			const error = await makeBenchmarkEmailRequest(
				'Contact/ActiveCount',
				'bad-token',
			).catch((e: unknown) => e);
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
			expect(calls).toHaveLength(1);
		});

		it('retries a 429 and resolves once the API recovers', async () => {
			responder = (call) =>
				call === 0
					? jsonResponse(
							{ errors: [{ errorType: 'TooManyRequestsError' }] },
							429,
							{
								'Retry-After': '0',
							},
						)
					: jsonResponse({ total: 7 });
			const result = await makeBenchmarkEmailRequest<{ total: number }>(
				'Contact/ActiveCount',
				TOKEN,
			);
			expect(result).toEqual({ total: 7 });
			expect(calls.length).toBeGreaterThanOrEqual(2);
		}, 15000);

		it('caps sustained 429s at maxRetries + 1 attempts (no endpoint-layer multiplication)', async () => {
			responder = () =>
				jsonResponse({ errors: [{ errorType: 'TooManyRequestsError' }] }, 429, {
					// 1s per Retry-After; 0 would be ignored by the transport in
					// favour of its exponential backoff, slowing this test down.
					'Retry-After': '1',
				});
			await expect(
				makeBenchmarkEmailRequest('Contact/ActiveCount', TOKEN),
			).rejects.toMatchObject({ status: 429 });
			// BENCHMARKEMAIL_RATE_LIMIT_CONFIG.maxRetries (5) + the initial
			// attempt. The endpoint-level RATE_LIMIT_ERROR handler deliberately
			// does not re-invoke, so the two layers cannot multiply.
			expect(calls).toHaveLength(6);
		}, 15000);
	});
});
