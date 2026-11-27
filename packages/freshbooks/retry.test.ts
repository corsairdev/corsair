import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { freshbooks } from './index';
import { clientsListResponse } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer actually runs.
 *
 * Writes are never replayed on a 5xx: FreshBooks has no idempotency keys, so
 * a failed create may still have gone through. Reads are.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'freshbooks', 'default');
	const corsair = createCorsair({
		plugins: [freshbooks({ key: 'fb-test-access-token' })],
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
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '1' });
			respond(clientsListResponse);

			const result = await corsair.freshbooks.api.clients.list({
				accountId: 'LJArJ4',
				page: 1,
			});

			expect(result.clients).toHaveLength(1);
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
				respond({ message: 'Too many requests' }, 429);
			}

			await expect(
				corsair.freshbooks.api.clients.list({ accountId: 'LJArJ4' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('retries a 409 invoice collision, which the docs say succeeds on retry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ response: { errors: [{ errno: 409, message: 'collided' }] } }, 409);
			respond({
				response: { result: { invoice: { id: 1 } } },
			});

			const result = await corsair.freshbooks.api.invoices.create({
				accountId: 'LJArJ4',
				invoice: { customerid: 960771 },
			});

			expect(result.invoice.id).toBe(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 500 invoice create, which may have gone through', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 500);

			await expect(
				corsair.freshbooks.api.invoices.create({
					accountId: 'LJArJ4',
					invoice: { customerid: 960771 },
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 500 clients.list after the read budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 2 retries, so 3 attempts, then the read is
			// replayable: one more 500 and a success would need 5 responses.
			for (let i = 0; i < 3; i += 1) {
				respond({ message: 'Server error' }, 500);
			}

			await expect(
				corsair.freshbooks.api.clients.list({ accountId: 'LJArJ4' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('waits for the Retry-After header before the retry', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '2' });
			respond(clientsListResponse);

			const pending = corsair.freshbooks.api.clients.list({
				accountId: 'LJArJ4',
			});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toHaveProperty('clients');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the backoff delay when there is no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429);
			respond(clientsListResponse);

			const pending = corsair.freshbooks.api.clients.list({
				accountId: 'LJArJ4',
			});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toHaveProperty('clients');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
