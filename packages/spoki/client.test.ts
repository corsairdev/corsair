import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { SpokiApiError, SpokiClient } from './client';

describe('SpokiClient', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('sends the API key and parses JSON responses', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ id: '123' }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		const result = await client.get<{ id: string }>('/accounts/123');

		expect(result).toEqual({ id: '123' });
		expect(mockFetch).toHaveBeenCalledTimes(1);

		const [, options] = mockFetch.mock.calls[0];

		const headers = new Headers(options?.headers);

		expect(headers.get('X-Spoki-Api-Key')).toBe('test-key');
		expect(headers.get('Accept')).toBe('application/json');
		expect(headers.get('Content-Type')).toBe('application/json');
	});

	it('supports custom headers', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		await client.request('/test', {
			method: 'GET',
			headers: {
				'X-Custom-Header': 'custom-value',
			},
		});

		const [, options] = mockFetch.mock.calls[0];

		const headers = new Headers(options?.headers);

		expect(headers.get('X-Custom-Header')).toBe('custom-value');
		expect(headers.get('X-Spoki-Api-Key')).toBe('test-key');
	});

	it('supports Headers instances', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		const customHeaders = new Headers({
			'X-Custom-Header': 'custom-value',
		});

		await client.request('/test', {
			method: 'GET',
			headers: customHeaders,
		});

		const [, options] = mockFetch.mock.calls[0];

		const headers = new Headers(options?.headers);

		expect(headers.get('X-Custom-Header')).toBe('custom-value');
		expect(headers.get('X-Spoki-Api-Key')).toBe('test-key');
	});

	it('throws SpokiApiError for failed responses', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
				},
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		await expect(client.get('/test')).rejects.toMatchObject({
			name: 'SpokiApiError',
			status: 401,
			body: {
				error: 'Unauthorized',
			},
		});
	});

	it('parses text responses when the response is not JSON', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('plain text response', {
				status: 200,
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		const result = await client.get<string>('/test');

		expect(result).toBe('plain text response');
	});

	it('supports POST requests', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ success: true }), {
				status: 200,
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		await client.post('/test', {
			name: 'test',
		});

		const [url, options] = mockFetch.mock.calls[0];

		expect(url).toContain('/test');
		expect(options?.method).toBe('POST');
		expect(options?.body).toBe(JSON.stringify({ name: 'test' }));
	});

	it('supports PUT requests', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ success: true }), {
				status: 200,
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		await client.put('/test', {
			name: 'updated',
		});

		const [, options] = mockFetch.mock.calls[0];

		expect(options?.method).toBe('PUT');
		expect(options?.body).toBe(JSON.stringify({ name: 'updated' }));
	});

	it('supports DELETE requests', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 204,
			}),
		);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		const result = await client.delete('/test');

		const [, options] = mockFetch.mock.calls[0];

		expect(options?.method).toBe('DELETE');
		expect(result).toBeUndefined();
	});

	it('rejects an empty API key', () => {
		expect(
			() =>
				new SpokiClient({
					apiKey: '',
				}),
		).toThrow('Spoki API key is required');
	});
});
