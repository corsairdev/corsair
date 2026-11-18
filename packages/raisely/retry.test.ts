import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { raisely } from './index';
import { CAMPAIGN_PAGE, FORBIDDEN, VALIDATION_ERROR } from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof raisely>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'raisely', 'default');
	const corsair = createCorsair({
		plugins: [raisely(options)],
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
		const { corsair, testDb } = await createClient({ key: 'raisely-key' });
		try {
			respond(fetchMock, { detail: 'Too many requests', status: 429 }, 429);
			respond(fetchMock, CAMPAIGN_PAGE);

			const result = await withFakeTimers(
				corsair.raisely.api.campaigns.list({}),
			);

			expect(result.campaigns).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'raisely-key' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { detail: 'Too many requests', status: 429 }, 429);
			}

			await expect(
				withFakeTimers(corsair.raisely.api.campaigns.list({})),
			).rejects.toThrow(/Raisely 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a donation create that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'raisely-key' });
		try {
			respond(fetchMock, { detail: 'Server error', status: 500 }, 500);

			await expect(
				withFakeTimers(
					corsair.raisely.api.donations.create({
						amount: 2500,
						currency: 'USD',
						email: 'jordan@example.com',
						method: 'CREDIT_CARD',
						type: 'ONLINE',
					}),
				),
			).rejects.toThrow(/Raisely 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'raisely-key' });
		try {
			respond(fetchMock, { detail: 'Server error', status: 502 }, 502);
			respond(fetchMock, CAMPAIGN_PAGE);

			const result = await withFakeTimers(
				corsair.raisely.api.campaigns.list({}),
			);

			expect(result.campaigns).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a forbidden token', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond(fetchMock, FORBIDDEN, 403);

			await expect(
				withFakeTimers(corsair.raisely.api.campaigns.list({})),
			).rejects.toThrow(/You are not authorized/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a validation rejection', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'raisely-key' });
		try {
			respond(fetchMock, VALIDATION_ERROR, 422);

			await expect(
				withFakeTimers(
					corsair.raisely.api.donations.create({
						amount: 2500,
						currency: 'USD',
						email: 'jordan@example.com',
						method: 'CREDIT_CARD',
						type: 'ONLINE',
					}),
				),
			).rejects.toThrow(/amount is required/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
