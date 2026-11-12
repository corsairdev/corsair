import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { referralrock } from './index';
import { MEMBER_SET, NO_AUTH, PROGRAM_ID } from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof referralrock>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'referralrock', 'default');
	const corsair = createCorsair({
		plugins: [referralrock(options)],
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
		const { corsair, testDb } = await createClient({ key: 'rr-key' });
		try {
			respond(fetchMock, { message: 'Too many requests' }, 429);
			respond(fetchMock, MEMBER_SET);

			const result = await withFakeTimers(
				corsair.referralrock.api.members.list({}),
			);

			expect(result.members).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rr-key' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { message: 'Too many' }, 429);
			}

			await expect(
				withFakeTimers(corsair.referralrock.api.members.list({})),
			).rejects.toThrow(/Referral Rock 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a member create that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rr-key' });
		try {
			respond(fetchMock, { message: 'Server error' }, 500);

			await expect(
				withFakeTimers(
					corsair.referralrock.api.members.create({
						program_id: PROGRAM_ID,
						first_name: 'Sam',
						email: 'sam@example.com',
					}),
				),
			).rejects.toThrow(/Referral Rock 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rr-key' });
		try {
			respond(fetchMock, { message: 'Server error' }, 502);
			respond(fetchMock, MEMBER_SET);

			const result = await withFakeTimers(
				corsair.referralrock.api.members.list({}),
			);

			expect(result.members).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected credential', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad' });
		try {
			respond(fetchMock, NO_AUTH, 401);

			await expect(
				withFakeTimers(corsair.referralrock.api.members.list({})),
			).rejects.toThrow(/Unauthorized/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
