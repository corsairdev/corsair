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
	it('does not retry a 429 on POST when retries is false', async () => {
		let attempts = 0;
		global.fetch = (async (url: unknown) => {
			attempts += 1;
			return {
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => ({ message: 'rate limited' }),
				text: async () => JSON.stringify({ message: 'rate limited' }),
			};
		}) as unknown as typeof global.fetch;

		await expect(
			makeClockifyRequest('workspaces/w1/time-entries', 'test-api-key', {
				method: 'POST',
				body: { start: '2026-08-21T10:00:00Z' },
				retries: false,
			}),
		).rejects.toMatchObject({ name: 'ApiError', status: 429 });
		expect(attempts).toBe(1);
	});

	it('retries a 429 on GET then returns the body', async () => {
		let attempts = 0;
		global.fetch = (async (url: unknown) => {
			attempts += 1;
			if (attempts < 3) {
				return {
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					url: String(url),
					headers: new Headers({
						'Content-Type': 'application/json',
						'retry-after': '0',
					}),
					json: async () => ({ message: 'rate limited' }),
					text: async () => JSON.stringify({ message: 'rate limited' }),
				};
			}
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => [{ id: 'w1', name: 'Workspace 1' }],
				text: async () => JSON.stringify([{ id: 'w1', name: 'Workspace 1' }]),
			};
		}) as unknown as typeof global.fetch;

		await expect(
			makeClockifyRequest('workspaces', 'test-api-key'),
		).resolves.toEqual([{ id: 'w1', name: 'Workspace 1' }]);
		expect(attempts).toBe(3);
	});

	it('rethrows after exhausting GET 429 retries', async () => {
		let attempts = 0;
		global.fetch = (async (url: unknown) => {
			attempts += 1;
			return {
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: String(url),
				headers: new Headers({
					'Content-Type': 'application/json',
					'retry-after': '0',
				}),
				json: async () => ({ message: 'rate limited' }),
				text: async () => JSON.stringify({ message: 'rate limited' }),
			};
		}) as unknown as typeof global.fetch;

		await expect(
			makeClockifyRequest('workspaces', 'test-api-key'),
		).rejects.toMatchObject({ name: 'ApiError', status: 429 });
		expect(attempts).toBe(6);
	});
});
