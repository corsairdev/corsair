import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { repairshopr } from './index';
import { AUTH_ERROR, CUSTOMER_PAGE, VALIDATION_ERROR } from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof repairshopr>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'repairshopr', 'default');
	const corsair = createCorsair({
		plugins: [repairshopr(options)],
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
 * the wait. The rejection handler is attached before the clock moves, or the
 * promise rejects mid-step with nothing listening.
 */
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
			key: 'repairshopr-key',
			subdomain: 'acme',
		});
		try {
			respond(fetchMock, { error: 'Too many requests' }, 429);
			respond(fetchMock, CUSTOMER_PAGE);

			const result = await withFakeTimers(
				corsair.repairshopr.api.customers.list({}),
			);

			expect(result.customers).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'repairshopr-key',
			subdomain: 'acme',
		});
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { error: 'Too many requests' }, 429);
			}

			await expect(
				withFakeTimers(corsair.repairshopr.api.customers.list({})),
			).rejects.toThrow(/RepairShopr 429/);
			// One original attempt plus the three the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'repairshopr-key',
			subdomain: 'acme',
		});
		try {
			respond(fetchMock, { error: 'Server error' }, 500);

			await expect(
				withFakeTimers(
					corsair.repairshopr.api.tickets.create({
						customer_id: 1,
						subject: 'Laptop will not boot',
					}),
				),
			).rejects.toThrow(/RepairShopr 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'repairshopr-key',
			subdomain: 'acme',
		});
		try {
			respond(fetchMock, { error: 'Server error' }, 503);
			respond(fetchMock, CUSTOMER_PAGE);

			const result = await withFakeTimers(
				corsair.repairshopr.api.customers.list({}),
			);

			expect(result.customers).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an account that cannot be authenticated', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'bad-key',
			subdomain: 'acme',
		});
		try {
			respond(fetchMock, AUTH_ERROR, 401);

			await expect(
				withFakeTimers(corsair.repairshopr.api.customers.list({})),
			).rejects.toThrow(/Failed to authenticate account/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a validation rejection', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'repairshopr-key',
			subdomain: 'acme',
		});
		try {
			respond(fetchMock, VALIDATION_ERROR, 422);

			await expect(
				withFakeTimers(
					corsair.repairshopr.api.customers.create({
						email: 'it is not an email',
					}),
				),
			).rejects.toThrow(/Email is not an email/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
