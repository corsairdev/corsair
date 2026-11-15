import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { taggun } from './index';
import {
	CAMPAIGN_IDS,
	INVALID_KEY,
	RATE_LIMITED,
	SIMPLE_RECEIPT,
} from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof taggun>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'taggun', 'default');
	const corsair = createCorsair({
		plugins: [taggun(options)],
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

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers step over
 * the wait instead of taking it. A five-second step covers the longest built-in
 * backoff (1s, 2s, 4s) with room to spare.
 *
 * The rejection handler is attached before the clock moves: otherwise the
 * promise rejects mid-step with nothing listening, and Node reports an unhandled
 * rejection instead of the assertion the test wants.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	tracked.catch(() => undefined);
	for (let step = 0; step < 12 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(5000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'taggun-test-key' });
		try {
			respond(fetchMock, RATE_LIMITED, 429);
			respond(fetchMock, CAMPAIGN_IDS);

			const result = await withFakeTimers(
				corsair.taggun.api.campaigns.list({}),
			);

			expect(result).toEqual(CAMPAIGN_IDS);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'taggun-test-key' });
		try {
			// A GET gets three retries, so four answers are consumed before it
			// throws: the first attempt plus three replays.
			for (let attempt = 0; attempt < 4; attempt++) {
				respond(fetchMock, RATE_LIMITED, 429);
			}

			await expect(
				withFakeTimers(corsair.taggun.api.campaigns.list({})),
			).rejects.toThrow(/rate limit/i);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('honours the Retry-After delay before retrying', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'taggun-test-key' });
		try {
			respond(fetchMock, RATE_LIMITED, 429, { 'Retry-After': '9' });
			respond(fetchMock, CAMPAIGN_IDS);

			const run = corsair.taggun.api.campaigns.list({});
			const tracked = run.finally(() => undefined);
			tracked.catch(() => undefined);

			// Just under the header's nine seconds: still one attempt so far.
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(8000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(2000);
			await expect(tracked).resolves.toEqual(CAMPAIGN_IDS);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('uses the fallback window when a 429 carries no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'taggun-test-key' });
		try {
			respond(fetchMock, RATE_LIMITED, 429);
			respond(fetchMock, CAMPAIGN_IDS);

			const run = corsair.taggun.api.campaigns.list({});
			const tracked = run.finally(() => undefined);
			tracked.catch(() => undefined);

			await Promise.resolve();
			// The fallback is one second, not the four the built-in exponential
			// strategy would reach by its third attempt.
			await jest.advanceTimersByTimeAsync(1200);
			await expect(tracked).resolves.toEqual(CAMPAIGN_IDS);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited scan, which the provider dropped unprocessed', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'taggun-test-key' });
		try {
			respond(fetchMock, RATE_LIMITED, 429);
			respond(fetchMock, SIMPLE_RECEIPT);

			const result = await withFakeTimers(
				corsair.taggun.api.simple.url({
					url: 'https://files.example.com/receipt.png',
				}),
			);

			expect(result.totalAmount?.data).toBe(14.42);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a scan on a 5xx, which may already have been billed', async () => {
		const { corsair, testDb } = await createClient({ key: 'taggun-test-key' });
		try {
			respond(fetchMock, { message: 'Internal Server Error' }, 500);

			await expect(
				corsair.taggun.api.simple.url({
					url: 'https://files.example.com/receipt.png',
				}),
			).rejects.toThrow();
			// One attempt: a second would be a second scan on the account.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'wrong-key' });
		try {
			respond(fetchMock, INVALID_KEY, 403);

			await expect(corsair.taggun.api.campaigns.list({})).rejects.toThrow(
				/Invalid authentication credentials/,
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
