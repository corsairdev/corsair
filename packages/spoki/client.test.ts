import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { SpokiApiError, SpokiClient } from './client';

describe('SpokiClient', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('requires an API key', () => {
		expect(() => new SpokiClient({ apiKey: '' })).toThrow(
			'Spoki API key is required',
		);
	});

	it('sends the API key and parses JSON responses', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			status: 200,
			text: async () =>
				JSON.stringify({
					success: true,
				}),
		} as Response);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		const result = await client.get<{ success: boolean }>('/test');

		expect(result).toEqual({
			success: true,
		});

		expect(mockFetch).toHaveBeenCalledTimes(1);

		const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];

		expect(url).toBe('https://api.spoki.com/api/1/test');
		expect(options.method).toBe('GET');

		const headers = options.headers as Record<string, string>;

		expect(headers['X-Spoki-Api-Key']).toBe('test-key');
		expect(headers['Accept']).toBe('application/json');
		expect(headers['Content-Type']).toBe('application/json');
	});

	it('sends JSON bodies for POST requests', async () => {
		const mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			status: 200,
			text: async () =>
				JSON.stringify({
					success: true,
				}),
		} as Response);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		const body = {
			phone: '+919999999999',
			message: 'Hello',
		};

		await client.post('/messages', body);

		expect(mockFetch).toHaveBeenCalledTimes(1);

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];

		expect(options.method).toBe('POST');
		expect(options.body).toBe(JSON.stringify(body));
	});

	it('throws SpokiApiError for failed responses', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: false,
			status: 401,
			text: async () =>
				JSON.stringify({
					message: 'Unauthorized',
				}),
		} as Response);

		const client = new SpokiClient({
			apiKey: 'bad-key',
		});

		await expect(client.get('/test')).rejects.toBeInstanceOf(SpokiApiError);

		try {
			await client.get('/test');
		} catch (error) {
			expect(error).toBeInstanceOf(SpokiApiError);

			const apiError = error as SpokiApiError;

			expect(apiError.status).toBe(401);
			expect(apiError.body).toEqual({
				message: 'Unauthorized',
			});
		}
	});

	it('handles non-JSON error responses', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: false,
			status: 500,
			text: async () => 'Internal Server Error',
		} as Response);

		const client = new SpokiClient({
			apiKey: 'test-key',
		});

		await expect(client.get('/test')).rejects.toMatchObject({
			status: 500,
			body: 'Internal Server Error',
		});
	});
});
