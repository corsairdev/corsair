import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { radar } from './index';
import { QUOTA_EXCEEDED, UNAUTHORIZED, USER_PAGE } from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof radar>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'radar', 'default');
	const corsair = createCorsair({
		plugins: [radar(options)],
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
		const { corsair, testDb } = await createClient({ key: 'radar-key' });
		try {
			respond(
				fetchMock,
				{ meta: { code: 429, message: 'Too many requests' } },
				429,
			);
			respond(fetchMock, USER_PAGE);

			const result = await withFakeTimers(corsair.radar.api.users.list({}));

			expect(result.users).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'radar-key' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { meta: { code: 429, message: 'Too many' } }, 429);
			}

			await expect(
				withFakeTimers(corsair.radar.api.users.list({})),
			).rejects.toThrow(/Radar 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a spent quota, which looks retryable but is not', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'radar-key' });
		try {
			respond(fetchMock, QUOTA_EXCEEDED, 402);

			await expect(
				withFakeTimers(corsair.radar.api.users.list({})),
			).rejects.toThrow(/Usage exceeded/);
			// One attempt only: a quota never recovers inside a retry loop.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a track write that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'radar-key' });
		try {
			respond(fetchMock, { meta: { code: 500, message: 'Server error' } }, 500);

			await expect(
				withFakeTimers(
					corsair.radar.api.track.update({
						device_id: 'device-1',
						latitude: 40.7,
						longitude: -73.9,
						accuracy: 10,
					}),
				),
			).rejects.toThrow(/Radar 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'radar-key' });
		try {
			respond(fetchMock, { meta: { code: 503, message: 'Unavailable' } }, 503);
			respond(fetchMock, USER_PAGE);

			const result = await withFakeTimers(corsair.radar.api.users.list({}));

			expect(result.users).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad' });
		try {
			respond(fetchMock, UNAUTHORIZED, 401);

			await expect(
				withFakeTimers(corsair.radar.api.users.list({})),
			).rejects.toThrow(/Unauthorized/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
