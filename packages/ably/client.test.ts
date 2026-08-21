import { makeAblyListRequest, makeAblyRequest } from './client';

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured:
	| { url: string; method: string; headers: Record<string, string> }
	| undefined;
let attempts = 0;

function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
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
		const response = responses[Math.min(attempts, responses.length - 1)] ?? {};
		attempts += 1;
		const status = response.status ?? 200;
		const payload = response.body ?? [];
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: status === 429 ? 'Too Many Requests' : 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				...response.headers,
			}),
			json: async () => payload,
			text: async () =>
				typeof payload === 'string' ? payload : JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeAblyListRequest', () => {
	it('returns items and the next query from Link', async () => {
		mockFetch({
			body: ['room-a'],
			headers: {
				Link: '</channels?limit=100&by=id>; rel="next"',
			},
		});

		await expect(
			makeAblyListRequest('channels', 'app.key:secret', {
				query: { limit: 50 },
			}),
		).resolves.toEqual({
			items: ['room-a'],
			next: { limit: '100', by: 'id' },
		});
		expect(captured?.url).toBe('https://rest.ably.io/channels?limit=50');
		expect(captured?.headers.authorization).toBe(
			`Basic ${Buffer.from('app.key:secret').toString('base64')}`,
		);
	});

	it('omits next when Link has no next rel', async () => {
		mockFetch({
			body: ['room-a'],
			headers: {
				Link: '</channels?limit=100>; rel="first"',
			},
		});

		await expect(
			makeAblyListRequest('channels', 'app.key:secret'),
		).resolves.toEqual({ items: ['room-a'] });
	});

	it('preserves 429 retryAfter on list requests', async () => {
		mockFetch({
			status: 429,
			body: { error: { message: 'rate limited', statusCode: 429 } },
			headers: { 'Retry-After': '2' },
		});

		await expect(
			makeAblyListRequest('channels', 'app.key:secret'),
		).rejects.toMatchObject({
			name: 'AblyAPIError',
			statusCode: 429,
			retryAfter: 2000,
			message: 'rate limited',
		});
	});
});

describe('makeAblyRequest', () => {
	it('sends the API key as Basic auth', async () => {
		mockFetch({ body: [1] });

		await makeAblyRequest('time', 'app.key:secret');

		expect(captured?.headers.authorization).toBe(
			`Basic ${Buffer.from('app.key:secret').toString('base64')}`,
		);
		expect(captured?.url).toBe('https://rest.ably.io/time');
	});

	it('preserves 429 status and retryAfter after transport retries', async () => {
		jest.useFakeTimers();
		try {
			mockFetchSequence(
				Array.from({ length: 4 }, () => ({
					status: 429,
					body: { error: { message: 'rate_limited', statusCode: 429 } },
					headers: { 'Retry-After': '1' },
				})),
			);

			const pending = makeAblyRequest('channels', 'app.key:secret');
			const rejection = expect(pending).rejects.toMatchObject({
				name: 'AblyAPIError',
				statusCode: 429,
				retryAfter: 1000,
				message: 'rate_limited',
			});
			await jest.runAllTimersAsync();
			await rejection;
			expect(attempts).toBe(4);
		} finally {
			jest.useRealTimers();
		}
	});

	it('maps 401 to AblyAPIError statusCode', async () => {
		mockFetch({
			status: 401,
			body: { error: { message: 'unauthorized', statusCode: 401 } },
		});

		await expect(makeAblyRequest('channels', 'bad-key')).rejects.toMatchObject({
			name: 'AblyAPIError',
			statusCode: 401,
			message: 'unauthorized',
		});
	});
});
