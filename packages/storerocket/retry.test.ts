import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { storerocket } from './index';
import { project } from './test-fixtures';

/**
 * One retry layer: the transport does not retry (client.ts pins maxRetries:
 * 0) and error-handlers.ts decides the rest. The documented 429 contract is
 * to wait out Retry-After. Only reads are replayed on 5xx: the docs warn
 * that retrying a location POST can create a second location.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'storerocket', 'default');
	const corsair = createCorsair({
		plugins: [storerocket({ key: 'sr-test-token' })],
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
	it('waits out Retry-After on a 429 and lists projects on the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '1' });
			respond({ data: [project] });

			await expect(corsair.storerocket.api.projects.list({})).resolves.toEqual({
				data: [project],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the retry budget on repeated 429s', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ message: 'Too many requests' }, 429);
			}

			await expect(
				corsair.storerocket.api.projects.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a failed GET on a 500, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 500);
			respond({ data: [project] });

			await expect(corsair.storerocket.api.projects.list({})).resolves.toEqual({
				data: [project],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a location create on a 502: the docs warn a retry can create a second location', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 502);

			await expect(
				corsair.storerocket.api.locations.create({
					projectId: 'PROJECT_ID',
					name: 'No retry',
					city: 'Seattle',
				}),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad token', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Unauthenticated.' }, 401);

			await expect(
				corsair.storerocket.api.projects.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '2' });
			respond({ data: [project] });

			const pending = corsair.storerocket.api.projects.list({});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toEqual({ data: [project] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
