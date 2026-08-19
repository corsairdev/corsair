/**
 * Covers the transport: the Bearer token, the single-host base URL, and the
 * 429 retry. Network access is mocked, so this runs in CI.
 */
import { makeCollegeFootballDataRequest } from './client';

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
let attempts = 0;

/**
 * Installs a fetch stub that answers each call with the next response in the
 * list, repeating the last one once the list is exhausted.
 */
function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
	// `url` is `unknown` rather than `RequestInfo | URL` because the stub only
	// ever needs `String(url)`.
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

		const response =
			responses[Math.min(attempts, responses.length - 1)] ??
			({} as MockResponse);
		attempts++;

		const status = response.status ?? 200;
		const payload = response.body ?? [];
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
			// Partial `Response` stub; only what the shared request helper reads.
		};
	}) as unknown as typeof global.fetch;
}

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeCollegeFootballDataRequest', () => {
	it('sends the bearer token', async () => {
		mockFetch({ body: [] });

		await makeCollegeFootballDataRequest('/teams', 'test-key');

		expect(captured?.headers.authorization).toBe('Bearer test-key');
	});

	it('targets the single api.collegefootballdata.com host', async () => {
		mockFetch({ body: [] });

		await makeCollegeFootballDataRequest('/teams', 'test-key');

		expect(captured?.url).toContain('https://api.collegefootballdata.com/');
		expect(captured?.url).toContain('/teams');
	});

	it('is always a GET - this API has no writes', async () => {
		mockFetch({ body: [] });

		await makeCollegeFootballDataRequest('/games', 'test-key', {
			query: { year: 2023 },
		});

		expect(captured?.method).toBe('GET');
	});

	it('serializes query parameters', async () => {
		mockFetch({ body: [] });

		await makeCollegeFootballDataRequest('/games', 'test-key', {
			query: { year: 2023, team: 'Alabama' },
		});

		expect(captured?.url).toContain('year=2023');
		expect(captured?.url).toContain('team=Alabama');
	});

	/**
	 * `Retry-After: 3` is deliberately different from `client.ts`'s
	 * `initialRetryDelay: 1000` (1s): if the retry actually waited on the
	 * fallback backoff instead of the header, this test would still pass at
	 * 1s of fake-timer advancement, hiding the bug. Advancing by only the
	 * header's 3s and asserting the second request has landed by then (but
	 * not before) proves the header value, not the fallback, drove the wait.
	 */
	it('retries once the provider answers 429, waiting exactly the Retry-After duration', async () => {
		jest.useFakeTimers();
		try {
			mockFetchSequence([
				{ status: 429, body: {}, headers: { 'Retry-After': '3' } },
				{ status: 200, body: [{ id: 1 }] },
			]);

			const pending = makeCollegeFootballDataRequest<unknown[]>(
				'/teams',
				'test-key',
			);

			await jest.advanceTimersByTimeAsync(2999);
			expect(attempts).toBe(1);

			await jest.advanceTimersByTimeAsync(1);
			expect(attempts).toBe(2);

			expect(await pending).toEqual([{ id: 1 }]);
		} finally {
			jest.useRealTimers();
		}
	});
});
