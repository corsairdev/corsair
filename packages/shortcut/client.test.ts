import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import * as corsairHttp from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeShortcutRequest, SHORTCUT_API_BASE } from './client';

const rateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
} satisfies RateLimitConfig;

describe('Shortcut HTTP client', () => {
	afterEach(() => jest.restoreAllMocks());

	it('uses HTTPS v3 routes and the Shortcut-Token header', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ id: 4 }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await expect(
			makeShortcutRequest('/api/v3/categories', 'safe-test-token'),
		).resolves.toEqual({ id: 4 });

		const call = fetchMock.mock.calls[0];
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the Shortcut request to reach fetch');
		const [url, init] = call;
		expect(url).toBe(`${SHORTCUT_API_BASE}/api/v3/categories`);
		expect(new Headers(init?.headers).get('Shortcut-Token')).toBe(
			'safe-test-token',
		);
		expect(String(url)).not.toContain('token=');
	});

	it('fails before network I/O when the API key is empty', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(makeShortcutRequest('/api/v3/categories', '')).rejects.toThrow(
			'[auth-missing:shortcut:api_key]',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('retains Retry-After from the real HTTP transport for 429 responses', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'busy' }), {
				status: 429,
				headers: {
					'content-type': 'application/json',
					'retry-after': '2',
				},
			}),
		);
		const config: OpenAPIConfig = {
			BASE: SHORTCUT_API_BASE,
			VERSION: '3',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { 'Shortcut-Token': 'safe-test-token' },
		};
		// `unknown` because a rejected promise may contain any JavaScript value.
		const error = await request(
			config,
			{ method: 'GET', url: '/api/v3/categories' },
			{ rateLimitConfig },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('redacts request payloads and provider bodies from propagated HTTP errors', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'private story body' }), {
				status: 400,
				headers: { 'content-type': 'application/json' },
			}),
		);
		// `unknown` because a rejected promise may contain any JavaScript value.
		const error = await makeShortcutRequest(
			'/api/v3/stories',
			'safe-test-token',
			{
				method: 'POST',
				body: { name: 'sensitive story title' },
			},
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.message).toBe('Shortcut request failed with HTTP 400');
			expect(error.message).not.toContain('private story body');
			expect(error.stack).not.toContain('private story body');
			expect(error.url).toBe(`${SHORTCUT_API_BASE}/api/v3`);
			expect(error.request.url).toBe('/api/v3');
			expect(error.request.path).toBeUndefined();
			expect(error.request.query).toBeUndefined();
			expect(error.request.body).toBeUndefined();
			expect(error.body).toBeUndefined();
		}
	});

	it('keeps the original core ApiError identity while sanitizing diagnostics', async () => {
		const original = new ApiError(
			{
				method: 'POST',
				url: '/api/v3/stories/{story-public-id}',
				path: { 'story-public-id': 42 },
				query: { search: 'private query' },
				body: { name: 'private title' },
			},
			{
				url: `${SHORTCUT_API_BASE}/api/v3/stories/42?search=private`,
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: { detail: 'private provider detail' },
			},
			'private provider detail',
			{ retryAfter: 1500 },
		);
		const requestSpy = jest
			.spyOn(corsairHttp, 'request')
			.mockImplementation(() => {
				throw original;
			});

		// `unknown` because a rejected promise may contain any JavaScript value.
		const caught = await makeShortcutRequest(
			'/api/v3/stories/{story-public-id}',
			'safe-test-token',
			{ method: 'POST', path: { 'story-public-id': 42 } },
		).catch((error: unknown) => error);

		expect(caught).toBe(original);
		expect(original.status).toBe(422);
		expect(original.retryAfter).toBe(1500);
		expect(original.message).toBe('Shortcut request failed with HTTP 422');
		expect(original.url).toBe(`${SHORTCUT_API_BASE}/api/v3`);
		expect(original.request.path).toBeUndefined();
		expect(original.request.query).toBeUndefined();
		expect(original.request.body).toBeUndefined();
		expect(original.body).toBeUndefined();
		expect(original.stack).not.toContain('private provider detail');
		requestSpy.mockRestore();
	});
});
