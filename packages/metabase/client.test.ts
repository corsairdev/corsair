import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeMetabaseRequest, normalizeMetabaseBaseUrl } from './client';
import { errorHandlers } from './error-handlers';

beforeEach(() => {
	jest.restoreAllMocks();
});

describe('Metabase request client', () => {
	it('uses X-API-Key and repeats documented array query values', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		const response = await makeMetabaseRequest(
			'/api/collection/root/items',
			'api-key-secret',
			'https://metabase.test',
			{
				method: 'GET',
				query: { models: ['dashboard', 'collection'], q: 'finance' },
			},
		);

		expect(response).toEqual({ ok: true });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(url?.toString()).toBe(
			'https://metabase.test/api/collection/root/items?models=dashboard&models=collection&q=finance',
		);
		expect(init?.method).toBe('GET');
		expect(init?.redirect).toBe('manual');
		expect(init?.credentials).toBe('omit');
		expect(new Headers(init?.headers).get('X-API-Key')).toBe('api-key-secret');
		expect(new Headers(init?.headers).get('Authorization')).toBeNull();
	});

	it('sends validated JSON bodies without exposing keys in the query string', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ id: 8, name: 'Finance' }), {
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await makeMetabaseRequest(
			'/api/collection',
			'api-key-secret',
			'https://metabase.test',
			{ method: 'POST', body: { name: 'Finance', description: 'Reports' } },
		);

		const init = fetchMock.mock.calls[0]?.[1];
		expect(init?.method).toBe('POST');
		expect(init?.body).toBe(
			JSON.stringify({ name: 'Finance', description: 'Reports' }),
		);
		expect(new Headers(init?.headers).get('Content-Type')).toBe(
			'application/json',
		);
		expect(fetchMock.mock.calls[0]?.[0]?.toString()).not.toContain(
			'api-key-secret',
		);
	});

	it('fails without an API key before network I/O', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeMetabaseRequest('/api/collection', '', 'https://metabase.test'),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects unsafe base URLs before network I/O', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		for (const baseUrl of [
			'http://metabase.test',
			'https://metabase.test/path',
			'https://user:password@metabase.test',
			'https://metabase.test/?api_key=leaked',
		]) {
			await expect(
				makeMetabaseRequest('/api/collection', 'api-key-secret', baseUrl),
			).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
		expect(normalizeMetabaseBaseUrl('http://localhost:3000').origin).toBe(
			'http://localhost:3000',
		);
	});

	it('rejects paths that escape the API namespace', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeMetabaseRequest(
				'/api/../admin',
				'api-key-secret',
				'https://metabase.test',
			),
		).rejects.toThrow(/internal API path/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('does not follow redirects with the API key attached', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 302,
				headers: { Location: 'https://attacker.test/collect' },
			}),
		);

		await expect(
			makeMetabaseRequest(
				'/api/collection',
				'api-key-secret',
				'https://metabase.test',
			),
		).rejects.toMatchObject({ status: 302 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock.mock.calls[0]?.[1]?.redirect).toBe('manual');
	});

	it('retries 429 responses at the transport layer and preserves final Retry-After', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response('limited', {
					status: 429,
					headers: { 'Retry-After': '0' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ total: 0, data: [], models: [] }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);

		await expect(
			makeMetabaseRequest(
				'/api/collection',
				'api-key-secret',
				'https://metabase.test',
			),
		).resolves.toEqual({ total: 0, data: [], models: [] });
		expect(fetchMock).toHaveBeenCalledTimes(2);

		const finalFetch = jest
			.spyOn(globalThis, 'fetch')
			.mockReset()
			.mockResolvedValue(
				new Response('limited', {
					status: 429,
					headers: { 'Retry-After': '0' },
				}),
			);

		await expect(
			makeMetabaseRequest(
				'/api/collection',
				'api-key-secret',
				'https://metabase.test',
			),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 0,
			url: '/api/metabase',
		});
		expect(finalFetch).toHaveBeenCalledTimes(4);
	});

	it('sanitizes propagated provider errors and keeps only status and retry metadata', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ message: 'query text and api-key-secret' }),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);

		const caught = await makeMetabaseRequest(
			'/api/collection/root/items',
			'api-key-secret',
			'https://metabase.test',
			{
				method: 'POST',
				query: { q: 'private search text' },
				body: { customer: 'private data' },
			},
		).catch((error: unknown) => error);
		// `unknown` because a rejection has no static error type; the guard below narrows it.
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized ApiError');

		expect(caught.message).toBe('Metabase returned HTTP 500');
		expect(caught.url).toBe('/api/metabase');
		expect(caught.request).toEqual({ method: 'POST', url: '/api/metabase' });
		expect(caught.body).toEqual({});
		expect(caught.message).not.toContain('private search text');
		expect(caught.message).not.toContain('api-key-secret');
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('sanitizes timeout errors instead of exposing transport messages', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockRejectedValue(
				new DOMException('https://host/?token=private', 'TimeoutError'),
			);
		await expect(
			makeMetabaseRequest(
				'/api/collection',
				'api-key-secret',
				'https://metabase.test',
			),
		).rejects.toThrow('Metabase request timed out');
	});
});
