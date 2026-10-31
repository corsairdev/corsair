import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

const originalFetch = global.fetch;

const config: OpenAPIConfig = {
	BASE: 'https://api.example.com',
	VERSION: '1',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'same-origin',
	TIMEOUT: 2_000,
};

const options: ApiRequestOptions = {
	method: 'GET',
	url: '/slow',
};

afterEach(() => {
	global.fetch = originalFetch;
});

describe('Request timeout Tests', () => {
	it('replaces path parameters without regex backtracking', async () => {
		let requestedUrl = '';
		global.fetch = jest.fn(async (url: string | URL) => {
			requestedUrl = String(url);
			return new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		}) as typeof fetch;

		await request(config, {
			method: 'GET',
			url: '/items/{itemId}/{{a{{a{{a',
			path: { itemId: 'a/b' },
		});

		expect(requestedUrl).toBe('https://api.example.com/items/a/b/{{a{{a{{a');
	});

	it('passes a timeout-aware abort signal to fetch', async () => {
		let signal: AbortSignal | undefined;

		global.fetch = jest.fn((_url, init?: RequestInit) => {
			signal = init?.signal ?? undefined;

			return new Promise<Response>((_resolve, reject) => {
				signal?.addEventListener(
					'abort',
					() => reject(signal?.reason ?? new Error('aborted')),
					{ once: true },
				);
			});
		}) as typeof fetch;

		const promise = request(config, options);

		await expect(promise).rejects.toThrow('aborted');
		expect(signal?.aborted).toBe(true);
	});

	it('still supports caller cancellation', async () => {
		let signal: AbortSignal | undefined;

		global.fetch = jest.fn((_url, init?: RequestInit) => {
			signal = init?.signal as AbortSignal;

			return new Promise<Response>((_resolve, reject) => {
				signal?.addEventListener('abort', () => {
					reject(new Error('aborted'));
				});
			});
		}) as typeof fetch;

		const promise = request(config, options);

		// Wait until fetch has started and has received its abort signal
		while (!signal) {
			await new Promise((res) => setTimeout(res, 0));
		}

		promise.cancel();

		await expect(promise).rejects.toMatchObject({ isCancelled: true });
		expect(signal?.aborted).toBe(true);
	});
});
