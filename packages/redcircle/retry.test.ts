import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { redcircle } from './index';
import {
	INCIDENT,
	INVALID_KEY,
	QUOTA_EXCEEDED,
	SEARCH_PAGE,
} from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof redcircle>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'redcircle', 'default');
	const corsair = createCorsair({
		plugins: [redcircle(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/** Core sleeps with a plain setTimeout, so fake timers step over the wait. */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	tracked.catch(() => undefined);
	for (let step = 0; step < 20 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(10_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rc-key' });
		try {
			respond(fetchMock, { request_info: { success: false } }, 429);
			respond(fetchMock, SEARCH_PAGE);

			const result = await withFakeTimers(
				corsair.redcircle.api.search.products({ search_term: 'pens' }),
			);

			expect(result.search_results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rc-key' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { request_info: { success: false } }, 429);
			}

			await expect(
				withFakeTimers(
					corsair.redcircle.api.search.products({ search_term: 'pens' }),
				),
			).rejects.toThrow(/RedCircle 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a spent balance', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rc-key' });
		try {
			respond(fetchMock, QUOTA_EXCEEDED, 402);

			await expect(
				withFakeTimers(
					corsair.redcircle.api.search.products({ search_term: 'pens' }),
				),
			).rejects.toThrow(/run out of credits/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a parsing incident, which RedCircle says is not charged', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rc-key' });
		try {
			respond(fetchMock, { ...INCIDENT, retry_after: 5 }, 503);
			respond(fetchMock, SEARCH_PAGE);

			const pending = corsair.redcircle.api.search.products({
				search_term: 'pens',
			});
			pending.catch(() => undefined);
			// A supported delay still retries after the provider asks.
			await jest.advanceTimersByTimeAsync(5_000);
			const result = await pending;

			expect(result.search_results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad' });
		try {
			respond(fetchMock, INVALID_KEY, 401);

			await expect(
				withFakeTimers(
					corsair.redcircle.api.search.products({ search_term: 'pens' }),
				),
			).rejects.toThrow(/Supplied api_key is not valid/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
