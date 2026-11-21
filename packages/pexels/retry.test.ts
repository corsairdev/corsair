import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { pexels } from './index';
import { curatedPhotos } from './test-fixtures';

/**
 * A 429 is not retried: Pexels sends one only when the hourly or monthly
 * quota is spent. error-handlers.ts decides the rest; every route here is a
 * GET, so a 5xx replay is safe.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'pexels', 'default');
	const corsair = createCorsair({
		plugins: [pexels({ key: 'px-test-key' })],
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
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
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
	it('does not retry a 429, which means a quota is spent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });

			await expect(corsair.pexels.api.photos.curated({})).rejects.toMatchObject(
				{ status: 429 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong' }, 503);
			respond(curatedPhotos);

			await expect(
				corsair.pexels.api.photos.curated({}),
			).resolves.toMatchObject({ photos: curatedPhotos.photos });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 401, message: 'Invalid API key' }, 401);

			await expect(corsair.pexels.api.photos.curated({})).rejects.toMatchObject(
				{ status: 401 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
