import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	createMetabaseMultipartFileForm,
	makeMetabaseRequest,
	normalizeMetabaseBaseUrl,
} from './client';
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

	it('returns bounded binary responses and preserves documented response headers', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0, 255, 17]), {
				status: 200,
				headers: {
					'Content-Type': 'image/png',
					'Content-Disposition': 'inline; filename="icon.png"',
					'Content-Security-Policy': "default-src 'none'",
					'Cache-Control': 'private, max-age=60',
					ETag: 'safe-etag',
				},
			}),
		);

		const artifact = await makeMetabaseRequest(
			'/api/ee/custom-viz-plugin/4/asset',
			'api-key-secret',
			'https://metabase.test',
			{ responseType: 'binary', maxResponseBytes: 16 },
		);

		expect(artifact).toEqual({
			kind: 'binary',
			contentType: 'image/png',
			base64: 'AP8R',
			size: 3,
			headers: {
				contentDisposition: 'inline; filename="icon.png"',
				contentSecurityPolicy: "default-src 'none'",
				cacheControl: 'private, max-age=60',
				etag: 'safe-etag',
			},
		});
		expect(
			new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('Accept'),
		).toBe('*/*');
	});

	it('rejects binary responses and multipart uploads above configured limits', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([1, 2, 3]), {
				status: 200,
				headers: { 'Content-Type': 'application/octet-stream' },
			}),
		);
		await expect(
			makeMetabaseRequest(
				'/api/ee/apps/test/bundle',
				'api-key-secret',
				'https://metabase.test',
				{ responseType: 'binary', maxResponseBytes: 2 },
			),
		).rejects.toThrow('Metabase binary response could not be read');

		const file = new Blob(['bundle contents']);
		const formData = createMetabaseMultipartFileForm({
			filename: 'bundle.tar.gz',
			size: file.size,
			tempfile: file,
		});
		fetchMock.mockReset();
		await expect(
			makeMetabaseRequest(
				'/api/ee/custom-viz-plugin',
				'api-key-secret',
				'https://metabase.test',
				{ method: 'POST', formData, maxUploadBytes: 2 },
			),
		).rejects.toThrow(/multipart request exceeds/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends multipart files with a filename and lets fetch set the boundary', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ id: 8 }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		const file = new Blob(['bundle contents'], { type: 'application/gzip' });
		const formData = createMetabaseMultipartFileForm({
			filename: 'bundle.tar.gz',
			size: file.size,
			tempfile: file,
		});

		await makeMetabaseRequest(
			'/api/ee/custom-viz-plugin',
			'api-key-secret',
			'https://metabase.test',
			{ method: 'POST', formData },
		);

		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(url?.toString()).toBe(
			'https://metabase.test/api/ee/custom-viz-plugin',
		);
		expect(init?.method).toBe('POST');
		expect(init?.body).toBeInstanceOf(FormData);
		expect(new Headers(init?.headers).get('Content-Type')).toBeNull();
		expect(new Headers(init?.headers).get('X-API-Key')).toBe('api-key-secret');
		const requestBody = init?.body;
		if (!(requestBody instanceof FormData)) {
			throw new Error('Expected multipart body');
		}
		const uploadedFile = requestBody.get('file');
		expect(uploadedFile).toBeInstanceOf(Blob);
		if (uploadedFile instanceof Blob) {
			expect(uploadedFile.size).toBe(file.size);
			expect(uploadedFile.type).toBe('application/gzip');
		}
	});
});
