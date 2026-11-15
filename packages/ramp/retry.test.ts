import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ramp } from './index';
import { TRANSACTION_PAGE } from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof ramp>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'ramp', 'default');
	const corsair = createCorsair({
		plugins: [ramp(options)],
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
 * the wait instead of taking it. The rejection handler is attached before the
 * clock moves: otherwise the promise rejects mid-step with nothing listening,
 * and Node reports an unhandled rejection instead of the assertion the test
 * wants.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	tracked.catch(() => undefined);
	for (let step = 0; step < 20 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(60_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'ramp-test-token' });
		try {
			respond(
				fetchMock,
				{
					error_v2: {
						message: 'Too many requests',
						error_code: 'DEVELOPER_7029',
					},
				},
				429,
			);
			respond(fetchMock, TRANSACTION_PAGE);

			const result = await withFakeTimers(
				corsair.ramp.api.transactions.list({}),
			);

			expect(result.transactions).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'ramp-test-token' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(
					fetchMock,
					{
						error_v2: {
							message: 'Too many requests',
							error_code: 'DEVELOPER_7029',
						},
					},
					429,
				);
			}

			await expect(
				withFakeTimers(corsair.ramp.api.transactions.list({})),
			).rejects.toThrow(/Ramp 429/);
			// One original attempt plus the three the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write that failed with a gateway timeout', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'ramp-test-token' });
		try {
			respond(
				fetchMock,
				{
					error_v2: {
						message: 'Gateway Timeout',
						error_code: 'DEVELOPER_7199',
					},
				},
				504,
			);

			await expect(
				withFakeTimers(
					corsair.ramp.api.memos.create({
						transaction_id: 'fd14cd6a-846e-4994-9315-5a59e6bb465f',
						memo: 'hello',
					}),
				),
			).rejects.toThrow(/Ramp 504/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected token', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad-token' });
		try {
			respond(
				fetchMock,
				{
					error_v2: {
						message: 'Access token with given access_token not found',
						error_code: 'DEVELOPER_7002',
					},
				},
				404,
			);

			await expect(
				withFakeTimers(corsair.ramp.api.business.get({})),
			).rejects.toThrow(/DEVELOPER_7002/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('uses the 60 second cooldown when a 429 carries no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'ramp-test-token' });
		try {
			respond(
				fetchMock,
				{
					error_v2: {
						message: 'Too many requests',
						error_code: 'DEVELOPER_7029',
					},
				},
				429,
			);
			respond(fetchMock, TRANSACTION_PAGE);

			const pending = corsair.ramp.api.transactions.list({});
			pending.catch(() => undefined);
			// Less than the documented cooldown: the retry must not have fired.
			await jest.advanceTimersByTimeAsync(30_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// Past it, the retry goes out.
			await jest.advanceTimersByTimeAsync(60_000);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
