import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { tomtom } from './index';
import { searchEnvelope, trafficFlow } from './test-fixtures';

/**
 * Core's request() retries a 429 three times (honouring Retry-After) and the
 * plugin's handler does not add more; `error-handlers.ts` replays a 5xx. Every
 * TomTom route is a GET, so every replay here is safe.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'tomtom', 'default');
	const corsair = createCorsair({
		plugins: [tomtom({ key: 'tt-test-key' })],
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
	it('retries a 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detailedError: { code: 'TooManyRequests' } }, 429, {
				'Retry-After': '1',
			});
			respond(searchEnvelope);

			const result = await corsair.tomtom.api.search.fuzzy({ query: 'pizza' });

			expect(result.results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({}, 429);
			}

			await expect(
				corsair.tomtom.api.search.fuzzy({ query: 'pizza' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);
			respond(trafficFlow);

			const result = await corsair.tomtom.api.traffic.flow({
				latitude: 52.37,
				longitude: 4.89,
			});

			expect(result.flowSegmentData?.currentSpeed).toBe(45);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ detailedError: { code: 'Unauthorized', message: 'bad key' } },
				401,
			);

			await expect(
				corsair.tomtom.api.search.fuzzy({ query: 'pizza' }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 403', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detailedError: { code: 'Forbidden' } }, 403);

			await expect(
				corsair.tomtom.api.search.fuzzy({ query: 'pizza' }),
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
			respond({}, 429, { 'Retry-After': '2' });
			respond(searchEnvelope);

			const pending = corsair.tomtom.api.search.fuzzy({ query: 'pizza' });
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({
				results: [expect.anything()],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the strategy delay when there is no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429);
			respond(searchEnvelope);

			const pending = corsair.tomtom.api.search.fuzzy({ query: 'pizza' });
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				results: [expect.anything()],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
