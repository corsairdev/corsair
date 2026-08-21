import { makeClockifyRequest } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

let captured: Captured | undefined;
const realFetch = global.fetch;

function mockFetch(body: unknown = []) {
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
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

afterEach(() => {
	global.fetch = realFetch;
});

describe('makeClockifyRequest', () => {
	it('sends the X-Api-Key header, not Authorization', async () => {
		mockFetch();
		await makeClockifyRequest('workspaces', 'test-api-key');
		expect(captured?.headers['x-api-key']).toBe('test-api-key');
		expect(captured?.headers.authorization).toBeUndefined();
	});

	it('targets api.clockify.me/api/v1', async () => {
		mockFetch();
		await makeClockifyRequest('workspaces', 'test-api-key');
		expect(captured?.url).toBe('https://api.clockify.me/api/v1/workspaces');
	});
});
