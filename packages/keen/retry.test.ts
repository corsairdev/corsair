import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { keen } from './index';
import { collections, invalidKey, resourceNotFound } from './test-fixtures';

const API_KEY = 'abcdef0123456789abcdef0123456789';
const PROJECT_ID = '523b527836bf5a3216000006';

async function createClient(options: Parameters<typeof keen>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'keen', 'default');
	const corsair = createCorsair({
		plugins: [keen(options)],
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
 * over the documented minute instead of waiting for it.
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
	it('retries a 429 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond(
				{ message: 'Blocked for a minute', error_code: 'RateLimitError' },
				429,
			);
			respond(collections);

			const result = await withFakeTimers(
				corsair.keen.api.collections.list({}),
			);

			expect(result).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond({ message: 'Blocked', error_code: 'RateLimitError' }, 429);
			respond({ message: 'Blocked', error_code: 'RateLimitError' }, 429);
			respond({ message: 'Blocked', error_code: 'RateLimitError' }, 429);

			const error = await withFakeTimers(
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				corsair.keen.api.collections
					.list({})
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 429 });
			// One attempt plus two retries.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay an event batch after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond({ message: 'Server error', error_code: 'ServerError' }, 500);

			await expect(
				corsair.keen.api.events.recordMany({
					events: { purchases: [{ a: 1 }] },
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a saved query create after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond({ message: 'Server error', error_code: 'ServerError' }, 503);

			await expect(
				corsair.keen.api.savedQueries.create({
					queryName: 'weekly',
					refresh_rate: 0,
					query: { analysis_type: 'count', event_collection: 'purchases' },
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond({ message: 'Server error', error_code: 'ServerError' }, 500);
			respond(collections);

			const result = await withFakeTimers(
				corsair.keen.api.collections.list({}),
			);

			expect(result).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a query, which is a POST', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond({ message: 'Server error', error_code: 'ServerError' }, 500);

			await expect(
				corsair.keen.api.queries.run({
					analysis_type: 'count',
					event_collection: 'purchases',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		const { corsair, testDb } = await createClient({
			key: 'bad-key',
			projectId: PROJECT_ID,
		});
		try {
			respond(invalidKey('bad-key'), 401);

			const error = await corsair.keen.api.collections
				.list({})
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				.catch((caught: unknown) => caught);

			expect(error).toMatchObject({
				status: 401,
				body: { error_code: 'InvalidApiKeyError' },
			});
			expect(String(error)).not.toContain('bad-key');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an incomplete query', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond(
				{
					message: 'Your query did not finish',
					error_code: 'QueryIncompleteError',
				},
				504,
			);

			await expect(
				corsair.keen.api.queries.run({
					analysis_type: 'count',
					event_collection: 'purchases',
				}),
			).rejects.toMatchObject({
				status: 504,
				body: { error_code: 'QueryIncompleteError' },
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a missing project', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: 'nope',
		});
		try {
			respond(resourceNotFound, 404);

			await expect(corsair.keen.api.collections.list({})).rejects.toMatchObject(
				{ status: 404, body: { error_code: 'ResourceNotFoundError' } },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('honors a Retry-After header instead of its minute', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(
					JSON.stringify({ message: 'Blocked', error_code: 'RateLimitError' }),
					{
						status: 429,
						headers: { 'Content-Type': 'application/json', 'Retry-After': '2' },
					},
				),
			);
			respond(collections);

			const pending = corsair.keen.api.collections.list({});
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

	it('pins the no-header delay at the documented minute', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			respond({ message: 'Blocked', error_code: 'RateLimitError' }, 429);
			respond(collections);

			const pending = corsair.keen.api.collections.list({});
			// Flush the first request, then step just under the minute.
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(59_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(2_000);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a dropped connection on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(collections);

			const result = await withFakeTimers(
				corsair.keen.api.collections.list({}),
			);

			expect(result).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a dropped connection on a write', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			projectId: PROJECT_ID,
		});
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.keen.api.events.record({
					collection: 'purchases',
					event: { a: 1 },
				}),
			).rejects.toMatchObject({ transport: true, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
