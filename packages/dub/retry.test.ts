import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { dub } from './index';
import { link } from './test-fixtures';

/**
 * Retry decisions live in error-handlers.ts; core's request() is configured
 * with maxRetries: 0. Dub documents no idempotency keys, so a 5xx write is
 * never replayed: only reads and links.upsert may repeat.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'dub', 'default');
	const corsair = createCorsair({
		plugins: [dub({ key: 'dub-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('retries a 429 rate limit and succeeds on the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'rate_limit_exceeded', message: 'slow down' } },
				429,
			);
			respond([link]);

			const result = await corsair.dub.api.links.list({ domain: 'dub.sh' });

			expect(result.items).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honours Retry-After before the second attempt', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'rate_limit_exceeded', message: 'slow down' } },
				429,
				{ 'Retry-After': '2' },
			);
			respond([link]);

			const pending = corsair.dub.api.links.list({ domain: 'dub.sh' });
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the 1s strategy delay with no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'rate_limit_exceeded', message: 'slow down' } },
				429,
			);
			respond([link]);

			const pending = corsair.dub.api.links.list({ domain: 'dub.sh' });
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				items: [expect.objectContaining({ id: 'link_1KAP4CQ4Y1' })],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('gives up after the retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(
					{ error: { code: 'rate_limit_exceeded', message: 'slow down' } },
					429,
				);
			}

			await expect(
				corsair.dub.api.links.list({ domain: 'dub.sh' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'internal_server_error', message: 'boom' } },
				500,
			);
			respond([link]);

			const result = await corsair.dub.api.links.list({ domain: 'dub.sh' });

			expect(result.items).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a 5xx write: Dub has no idempotency keys', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'internal_server_error', message: 'boom' } },
				500,
			);

			await expect(
				corsair.dub.api.track.sale({
					customerExternalId: 'ext_1',
					amount: 4900,
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on links.upsert, the idempotent write', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'internal_server_error', message: 'boom' } },
				500,
			);
			respond(link);

			const result = await corsair.dub.api.links.upsert({
				url: 'https://dub.co',
				domain: 'dub.sh',
				key: 'try',
			});

			expect(result.id).toBe('link_1KAP4CQ4Y1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401 bad key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: {
						code: 'unauthorized',
						message: 'Invalid API key.',
					},
				},
				401,
			);

			await expect(
				corsair.dub.api.links.list({ domain: 'dub.sh' }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
