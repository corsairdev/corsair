import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { PRERENDER_API_BASE, PrerenderAPIError } from './client';
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

	it('puts the stored token in the JSON body, not a header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.prerender.keys.issue_new_dek();
			await corsair.prerender.keys.set_api_key('stored-token');
			respond({ message: 'recached' });

			await corsair.prerender.api.cache.recache({
				url: 'https://example.com/',
			});

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${PRERENDER_API_BASE}/recache`);
			// The token is part of the payload Prerender documents.
			expect(JSON.parse(String(init.body))).toMatchObject({
				url: 'https://example.com/',
				prerenderToken: 'stored-token',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('puts the token in the path on the status route', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond('Not queued');

			const result = await corsair.prerender.api.cache.clearStatus({});

			expect(result.message).toBe('Not queued');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${PRERENDER_API_BASE}/cache-clear-status/inline-token`);
			expect(init.body).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected token, and reads the plain-text reason', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-token' });
		try {
			respond('Invalid prerenderToken', 400);

			const error = await captureError(
				corsair.prerender.api.cache.recache({ url: 'https://example.com/' }),
			);

			expect(error).toBeInstanceOf(PrerenderAPIError);
			expect(error).toMatchObject({
				status: 400,
				reason: 'Invalid prerenderToken',
				credentialsRejected: true,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// The token rode in the body, so no error may echo it.
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

			expect(error).toBeInstanceOf(PrerenderAPIError);
			expect(error).toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx, since recaching is idempotent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond('Upstream error', 503);
			respond({ message: 'recached' });

			const pending = corsair.prerender.api.cache.recache({
				url: 'https://example.com/',
			});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.message).toBe('recached');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
