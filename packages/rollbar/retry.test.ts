import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { rollbar } from './index';
import {
	BODY_REJECTED,
	ITEM_ID,
	ITEM_PAGE,
	RATE_LIMITED,
	TOKEN_REQUIRED,
} from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof rollbar>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'rollbar', 'default');
	const corsair = createCorsair({
		plugins: [rollbar(options)],
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
		const { corsair, testDb } = await createClient({ key: 'rb-token' });
		try {
			respond(fetchMock, RATE_LIMITED, 429);
			respond(fetchMock, ITEM_PAGE);

			const result = await withFakeTimers(corsair.rollbar.api.items.list({}));

			expect(result.items).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rb-token' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, RATE_LIMITED, 429);
			}

			await expect(
				withFakeTimers(corsair.rollbar.api.items.list({})),
			).rejects.toThrow(/Rollbar 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay an item update that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rb-token' });
		try {
			respond(fetchMock, { err: 1, message: 'internal error' }, 500);

			await expect(
				withFakeTimers(
					corsair.rollbar.api.items.update({
						item_id: ITEM_ID,
						status: 'resolved',
					}),
				),
			).rejects.toThrow(/Rollbar 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a body-level failure on a 200', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rb-token' });
		try {
			respond(fetchMock, BODY_REJECTED, 200);

			await expect(
				withFakeTimers(
					corsair.rollbar.api.items.update({
						item_id: ITEM_ID,
						status: 'resolved',
					}),
				),
			).rejects.toThrow(/invalid status/);
			// One attempt: a described failure has no status to retry on.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rb-token' });
		try {
			respond(fetchMock, { err: 1, message: 'unavailable' }, 503);
			respond(fetchMock, ITEM_PAGE);

			const result = await withFakeTimers(corsair.rollbar.api.items.list({}));

			expect(result.items).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a missing token', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad' });
		try {
			respond(fetchMock, TOKEN_REQUIRED, 401);

			await expect(
				withFakeTimers(corsair.rollbar.api.items.list({})),
			).rejects.toThrow(/access token required/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
