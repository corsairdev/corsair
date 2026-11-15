import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { PRERENDER_API_BASE } from './client';
import { prerender } from './index';
import { captureError } from './test-helpers';

async function createClient(options: Parameters<typeof prerender>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'prerender', 'default');
	const corsair = createCorsair({
		plugins: [prerender(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one response for the next fetch call. */
function respond(
	body: unknown, // unknown: each test passes one of Prerender's response shapes.
	status = 200,
	headers: Record<string, string> = {},
) {
	// Prerender answers plain text on a rejection and a confirmation, so the
	// content type has to match what it really sends or the client would try to
	// parse text as JSON.
	const isText = typeof body === 'string';
	fetchMock.mockResolvedValueOnce(
		new Response(isText ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': isText
					? 'text/plain; charset=utf-8'
					: 'application/json',
				...headers,
			},
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Prerender plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no token is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.prerender.keys.issue_new_dek();
			await expect(
				corsair.prerender.api.cache.search({ query: 'example.com' }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('puts the stored token in the X-Prerender-Token header, not the body', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.prerender.keys.issue_new_dek();
			await corsair.prerender.keys.set_api_key('stored-token');
			// The live route answers an empty 200.
			fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

			await corsair.prerender.api.cache.recache({
				url: 'https://example.com/',
			});

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${PRERENDER_API_BASE}/recache`);
			expect(new Headers(init.headers).get('X-Prerender-Token')).toBe(
				'stored-token',
			);
			expect(JSON.parse(String(init.body))).toEqual({
				url: 'https://example.com/',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('puts the token in the path on the status route and reads not queued', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond('not queued');

			const result = await corsair.prerender.api.cache.clearStatus({});

			expect(result).toMatchObject({
				message: 'not queued',
				inProgress: false,
			});
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${PRERENDER_API_BASE}/cache-clear-status/inline-token`);
			expect(init.body).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a 403 on the status route as a job in progress', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond('in progress', 403);

			const result = await corsair.prerender.api.cache.clearStatus({});

			expect(result).toMatchObject({ inProgress: true });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected token, and keeps the plain-text reason', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-token' });
		try {
			respond('Invalid prerenderToken', 400);

			const error = await captureError(
				corsair.prerender.api.cache.recache({ url: 'https://example.com/' }),
			);

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({
				status: 400,
				body: 'Invalid prerenderToken',
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(JSON.stringify(error)).not.toContain('bad-token');
		} finally {
			testDb.cleanup();
		}
	});

	it('treats a 403 on cache clear as a state, not a retryable failure', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond('Cache clear in progress', 403);

			const error = await captureError(
				corsair.prerender.api.cache.clear({ query: 'https://example.com%' }),
			);

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on cache clear, which may already have run', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond('Upstream error', 503);

			const error = await captureError(
				corsair.prerender.api.cache.clear({ query: 'https://example.com%' }),
			);

			expect(error).toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on search, which only reads', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond('Upstream error', 503);
			respond([{ url: 'https://example.com/', cacheState: 'Cached' }]);

			const pending = corsair.prerender.api.cache.search({
				query: 'example.com',
			});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.urls[0]?.cacheState).toBe('Cached');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
