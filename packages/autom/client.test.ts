/**
 * Covers the transport: `x-api-key` header, no Bearer token, blank-key
 * rejection, and that `ApiError` status survives the catch (not wrapped).
 */
import { AutomAPIError, makeAutomRequest } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;

function mockFetch(response: MockResponse) {
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
		captured = { url: String(url), method: init?.method ?? 'GET', headers };

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
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeAutomRequest', () => {
	it('sends x-api-key and never a Bearer token', async () => {
		mockFetch({
			body: [{ country_code: 'US', country_name: 'United States' }],
		});

		await makeAutomRequest('/v1/finder/google-countries', 'test-key', {
			query: { query: 'united' },
		});

		expect(captured?.headers['x-api-key']).toBe('test-key');
		expect(captured?.headers.authorization).toBeUndefined();
		expect(captured?.url).toContain('https://api.autom.dev/');
		expect(captured?.url).toContain('/v1/finder/google-countries');
		expect(captured?.url).toContain('query=united');
	});

	it('rejects a blank API key before fetching', async () => {
		mockFetch({ body: {} });

		await expect(makeAutomRequest('/v1/google/images', '   ')).rejects.toThrow(
			AutomAPIError,
		);
		expect(captured).toBeUndefined();
	});

	it('rethrows ApiError with status intact, not AutomAPIError', async () => {
		mockFetch({
			status: 401,
			ok: false,
			body: { error: 'Invalid API Key' },
		});

		await expect(
			makeAutomRequest('/v1/google/images', 'test-key', {
				query: { query: 'lion' },
			}),
		).rejects.toMatchObject({ name: 'ApiError', status: 401 });
	});
});
