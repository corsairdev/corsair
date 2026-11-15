import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { splitwise } from './index';
import { currentUser, expense, expenseCreated } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with `maxRetries: 0`
 * so only `error-handlers.ts` decides what is retried. This file goes through
 * `createCorsair` to prove that layer actually runs: it is the only place a 429
 * can be retried at all.
 *
 * Reads are replayed and writes are not: `create_expense` is not idempotent, so
 * a replay after an unknown outcome would add a second expense.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'splitwise', 'default');
	const corsair = createCorsair({
		plugins: [splitwise({ key: 'sw-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
// unknown: response bodies are arbitrary JSON and each test passes its own.
function respond(
	body: unknown, // unknown: each test passes its own JSON.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('rate-limit retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '1' });
			respond(currentUser);

			const result = await corsair.splitwise.api.users.getCurrentUser({});

			expect(result.user.id).toBe(270896089);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 3 retries, so 4 attempts in total.
			for (let i = 0; i < 4; i += 1) {
				respond({}, 429);
			}

			await expect(
				corsair.splitwise.api.users.getCurrentUser({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not replay a write on a 5xx, which may have applied', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 500);

			await expect(
				corsair.splitwise.api.expenses.create({
					description: 'Brunch',
					cost: 25,
					users: [{ user_id: 270896089, paid_share: 25, owed_share: 25 }],
				}),
			).rejects.toMatchObject({ status: 500 });
			// One attempt: a replay could book the expense twice.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);
			respond({ expense });

			const result = await corsair.splitwise.api.expenses.get({
				expense_id: 51023,
			});

			expect(result.expense.id).toBe(51023);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401, which is the same request failing twice', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Invalid API Request: you are not logged in' }, 401);

			await expect(
				corsair.splitwise.api.users.getCurrentUser({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a write normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(expenseCreated);

			const result = await corsair.splitwise.api.expenses.create({
				description: 'Brunch',
				cost: 25,
				users: [{ user_id: 270896089, paid_share: 25, owed_share: 25 }],
			});

			expect(result.expenses).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '2' });
			respond(currentUser);

			const pending = corsair.splitwise.api.users.getCurrentUser({});
			// Nothing resolves before the two-second delay has passed.
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({ user: { id: 270896089 } });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the handler delay when there is no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429);
			respond(currentUser);

			const pending = corsair.splitwise.api.users.getCurrentUser({});
			// The handler has no documented window, so it uses the exponential
			// backoff strategy: the first retry is one second.
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({ user: { id: 270896089 } });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
