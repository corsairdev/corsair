/**
 * Covers the transport: bearer auth, optional Profile-Key, DELETE bodies
 * (Ayrshare requires a JSON body on delete), and 429 retries. Network access
 * is mocked, so this runs in CI.
 */
import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	AYRSHARE_API_BASE,
	compactBody,
	compactQuery,
	makeAyrshareRequest,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;
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
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};

		const response =
			responses[Math.min(attempts, responses.length - 1)] ??
			({} as MockResponse);
		attempts++;

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

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeAyrshareRequest', () => {
	it('sends the bearer token and targets /api', async () => {
		mockFetch({ body: { status: 'success' } });

		await makeAyrshareRequest('auto-schedule/list', 'test-key');

		expect(captured?.headers.authorization).toBe('Bearer test-key');
		expect(captured?.url).toContain(`${AYRSHARE_API_BASE}/`);
		expect(captured?.url).toContain('auto-schedule/list');
		expect(captured?.headers['profile-key']).toBeUndefined();
	});

	it('sends Profile-Key when a user profile is selected', async () => {
		mockFetch({ body: {} });

		await makeAyrshareRequest('user', 'test-key', {
			profileKey: 'PROFILE_KEY',
		});

		expect(captured?.headers['profile-key']).toBe('PROFILE_KEY');
	});

	it('refuses to call out without an API key', async () => {
		mockFetch({ body: {} });

		await expect(makeAyrshareRequest('user', '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(captured).toBeUndefined();
	});

	it('sends a JSON body on POST and DELETE', async () => {
		mockFetch({ body: { status: 'success' } });
		await makeAyrshareRequest('auto-schedule/set', 'test-key', {
			method: 'POST',
			body: { schedule: ['13:05Z'] },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toContain('13:05Z');

		mockFetch({ body: { status: 'success' } });
		await makeAyrshareRequest('post', 'test-key', {
			method: 'DELETE',
			body: { id: 'abc' },
		});
		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toContain('abc');
	});

	it('omits undefined query parameters', async () => {
		mockFetch({ body: { history: [] } });

		await makeAyrshareRequest('history', 'test-key', {
			query: { limit: 10, status: undefined },
		});

		expect(captured?.url).toContain('limit=10');
		expect(captured?.url).not.toContain('status');
	});

	it('retries a 429 and leaves the eventual ApiError unwrapped', async () => {
		jest.useFakeTimers();
		mockFetchSequence([
			{
				status: 429,
				body: { status: 'error' },
				headers: { 'Retry-After': '0' },
			},
			{
				status: 429,
				body: { status: 'error' },
				headers: { 'Retry-After': '0' },
			},
			{
				status: 429,
				body: { status: 'error' },
				headers: { 'Retry-After': '0' },
			},
		]);

		try {
			const pending = makeAyrshareRequest('history', 'test-key').catch(
				(e) => e,
			);
			await jest.runAllTimersAsync();
			const error = await pending;

			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(429);
			expect(attempts).toBe(3);
		} finally {
			jest.useRealTimers();
		}
	});
});

describe('compact helpers', () => {
	it('drops undefined keys', () => {
		expect(compactQuery({ limit: 1, status: undefined })).toEqual({
			limit: 1,
		});
		expect(compactBody({ id: 'a', markManualDeleted: undefined })).toEqual({
			id: 'a',
		});
	});
});
