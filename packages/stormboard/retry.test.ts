import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { stormboard } from './index';
import { stormsPage } from './test-fixtures';

/**
 * One retry layer: the transport does not retry (client.ts pins maxRetries:
 * 0) and error-handlers.ts decides the rest. The documented 429 contract is
 * the standard RateLimit-* headers; a Retry-After is waited out. Only reads
 * are replayed on 5xx: creates (storms, ideas, invites) have no documented
 * idempotency contract.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'stormboard', 'default');
	const corsair = createCorsair({
		plugins: [stormboard({ key: 'sb-test-key' })],
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
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('waits out Retry-After on a 429 and lists storms on the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'rate limited' }, 429, { 'Retry-After': '1' });
			respond(stormsPage);

			await expect(corsair.stormboard.api.storms.list({})).resolves.toEqual(
				stormsPage,
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the retry budget on repeated 429s', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ error: 'rate limited' }, 429);
			}

			await expect(
				corsair.stormboard.api.storms.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a failed GET on a 500, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'server error' }, 500);
			respond(stormsPage);

			await expect(corsair.stormboard.api.storms.list({})).resolves.toEqual(
				stormsPage,
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a storm create on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'server error' }, 502);

			await expect(
				corsair.stormboard.api.storms.create({
					plan: 'personal',
					title: 'No retry',
				}),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an auth failure, which is a 403 on Stormboard', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error:
						'No authentication method set, it is required for this endpoint',
				},
				403,
			);

			await expect(
				corsair.stormboard.api.storms.list({}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'rate limited' }, 429, { 'Retry-After': '2' });
			respond(stormsPage);

			const pending = corsair.stormboard.api.storms.list({});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toEqual(stormsPage);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
