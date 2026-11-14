import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { kanbanize } from './index';
import { boards, invalidKey, minutelyLimit } from './test-fixtures';

const SUBDOMAIN = 'acme';

async function createClient(options: Parameters<typeof kanbanize>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'kanbanize', 'default');
	const corsair = createCorsair({
		plugins: [kanbanize(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// send a live request, so every call a test did not stub fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respond first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers can step
 * over the backoff instead of waiting for it.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 12 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(65_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a minutely limit and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			respond(minutelyLimit, 429);
			respond(boards);

			const result = await withFakeTimers(
				corsair.kanbanize.api.boards.list({}),
			);

			expect(result.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			respond(minutelyLimit, 429);
			respond(minutelyLimit, 429);
			respond(minutelyLimit, 429);
			respond(minutelyLimit, 429);

			const error = await withFakeTimers(
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				corsair.kanbanize.api.boards
					.list({})
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({
				status: 429,
				body: { error: { code: 'RL02' } },
			});
			// One attempt plus three retries.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			respond({ error: { code: 'X001', message: 'Server error' } }, 503);

			await expect(
				corsair.kanbanize.api.cards.create({
					title: 'A card',
					column_id: 1,
					lane_id: 2,
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a delete after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			respond({ error: { code: 'X001', message: 'Server error' } }, 500);

			await expect(
				corsair.kanbanize.api.boards.delete({ board_id: 1075 }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			respond({ error: { code: 'X001', message: 'Server error' } }, 500);
			respond(boards);

			const result = await withFakeTimers(
				corsair.kanbanize.api.boards.list({}),
			);

			expect(result.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an auth failure', async () => {
		const { corsair, testDb } = await createClient({
			key: 'bm-bad-key',
			subdomain: SUBDOMAIN,
		});
		try {
			respond(invalidKey, 401);

			await expect(corsair.kanbanize.api.boards.list({})).rejects.toMatchObject(
				{ status: 401, body: { error: { code: 'A001' } } },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('honors a Retry-After header instead of its fallback delay', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(
					JSON.stringify({ error: { code: 'RL02', message: 'Slow' } }),
					{
						status: 429,
						headers: { 'Content-Type': 'application/json', 'Retry-After': '2' },
					},
				),
			);
			respond(boards);

			const pending = corsair.kanbanize.api.boards.list({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(1_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_500);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('falls back to one second when the 429 carries no countdown', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			respond({ error: { code: 'RL02', message: 'Slow' } }, 429);
			respond(boards);

			const pending = corsair.kanbanize.api.boards.list({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(200);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a dropped connection on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(boards);

			const result = await withFakeTimers(
				corsair.kanbanize.api.boards.list({}),
			);

			expect(result.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a dropped connection on a write', async () => {
		const { corsair, testDb } = await createClient({
			key: 'bm-test-key',
			subdomain: SUBDOMAIN,
		});
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.kanbanize.api.cards.create({
					title: 'A card',
					column_id: 1,
					lane_id: 2,
				}),
			).rejects.toMatchObject({ transport: true, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
