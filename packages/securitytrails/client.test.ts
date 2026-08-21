import { makeSecuritytrailsRequest } from './client';

let captured:
	| {
			url: string;
			method: string;
			headers: Record<string, string>;
	  }
	| undefined;

function mockFetch(body: unknown = { hostname: 'example.com' }) {
	captured = undefined;

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
		};

		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as typeof global.fetch;
}

describe('SecurityTrails client', () => {
	it('requests a domain using the SecurityTrails API key', async () => {
		mockFetch({
			hostname: 'example.com',
		});

		await makeSecuritytrailsRequest('domain/example.com', 'test-api-key', {
			method: 'GET',
		});

		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'https://api.securitytrails.com/v1/domain/example.com',
		);
		expect(captured?.headers.apikey).toBe('test-api-key');
	});

	it('preserves a 429 ApiError', async () => {
		global.fetch = (async (url: unknown, init?: RequestInit) => {
			return {
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: String(url),
				headers: new Headers({
					'Content-Type': 'application/json',
					'Retry-After': '2',
				}),
				json: async () => ({
					message: 'rate limited',
				}),
				text: async () =>
					JSON.stringify({
						message: 'rate limited',
					}),
			};
		}) as typeof global.fetch;

		await expect(
			makeSecuritytrailsRequest('domain/example.com', 'test-api-key', {
				method: 'GET',
			}),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 2000,
		});
	});
});
