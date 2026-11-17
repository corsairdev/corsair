import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { taxjar } from './index';
import { categories, order, orderIds } from './test-fixtures';

/**
 * `endpoints.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer runs.
 *
 * Reads replay after a 5xx, writes never do: a repeated order transaction
 * double-counts the sale in tax reporting.
 */

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'taxjar', 'default');
	const corsair = createCorsair({
		plugins: [taxjar({ key: 'taxjar-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
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
			respond(
				{ detail: 'Too many requests', status: 429, error: 'Too Many' },
				429,
				{ 'Retry-After': '1' },
			);
			respond(categories);

			const result = await corsair.taxjar.api.categories.list({});

			expect(result.categories).toHaveLength(2);
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
				respond(
					{ detail: 'Too many requests', status: 429, error: 'Too Many' },
					429,
				);
			}

			await expect(
				corsair.taxjar.api.categories.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});

describe('fake-timer delay pinning', () => {
	it('backs off when a 429 carries no Retry-After', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ detail: 'Too many requests', status: 429, error: 'Too Many' },
				429,
			);
			respond(categories);

			// Fake timers start after the client exists, so the database setup
			// never runs on a fake clock.
			jest.useFakeTimers();
			const pending = corsair.taxjar.api.categories.list({});

			await jest.advanceTimersByTimeAsync(0);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toMatchObject({
				categories: expect.any(Array),
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	}, 30_000);
});

describe('server-error replay safety', () => {
	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Server error', status: 500, error: 'Error' }, 500);
			respond(orderIds);

			const result = await corsair.taxjar.api.orders.list({});

			expect(result.orders).toEqual(['123', '456']);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays an order create on 5xx, because it may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Server error', status: 500, error: 'Error' }, 500);
			respond(order);

			await expect(
				corsair.taxjar.api.orders.create({
					transaction_id: '123',
					transaction_date: '2015/05/14',
					to_country: 'US',
					shipping: 1.5,
				}),
			).rejects.toMatchObject({ status: 500 });

			// Exactly one attempt: a second order transaction double-counts the
			// sale in tax reporting.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
