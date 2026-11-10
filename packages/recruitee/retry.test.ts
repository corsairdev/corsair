import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { recruitee } from './index';
import { OFFER_PAGE, UNAUTHORIZED } from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof recruitee>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'recruitee', 'default');
	const corsair = createCorsair({
		plugins: [recruitee(options)],
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
		const { corsair, testDb } = await createClient({
			key: 'rc-key',
			company_id: '1111',
		});
		try {
			respond(
				fetchMock,
				{ errors: [{ code: 'rate_limited', message: 'Slow down' }] },
				429,
			);
			respond(fetchMock, OFFER_PAGE);

			const result = await withFakeTimers(
				corsair.recruitee.api.offers.list({}),
			);

			expect(result.offers).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'rc-key',
			company_id: '1111',
		});
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { errors: [{ code: 'rate_limited' }] }, 429);
			}

			await expect(
				withFakeTimers(corsair.recruitee.api.offers.list({})),
			).rejects.toThrow(/Recruitee 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay an offer create that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'rc-key',
			company_id: '1111',
		});
		try {
			respond(
				fetchMock,
				{ errors: [{ code: 'internal', message: 'Oops' }] },
				500,
			);

			await expect(
				withFakeTimers(
					corsair.recruitee.api.offers.create({ title: 'Backend Engineer' }),
				),
			).rejects.toThrow(/Recruitee 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'rc-key',
			company_id: '1111',
		});
		try {
			respond(fetchMock, { errors: [{ code: 'internal' }] }, 503);
			respond(fetchMock, OFFER_PAGE);

			const result = await withFakeTimers(
				corsair.recruitee.api.offers.list({}),
			);

			expect(result.offers).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a revoked token, which cannot be regenerated', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'revoked',
			company_id: '1111',
		});
		try {
			respond(fetchMock, UNAUTHORIZED, 401);

			await expect(
				withFakeTimers(corsair.recruitee.api.offers.list({})),
			).rejects.toThrow(/Unauthorized/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
