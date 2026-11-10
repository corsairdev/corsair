import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { desktime } from './index';
import { COMPANY_BODY, INVALID_KEY_ERROR, PING_BODY } from './test-fixtures';

async function createClient(options: Parameters<typeof desktime>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'desktime', 'default');
	const corsair = createCorsair({
		plugins: [desktime(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/**
 * Queues one JSON response. `body` is unknown because each fixture is a plain
 * object of arbitrary shape; the output schema under test is what validates it,
 * so a per-call-site type would add ceremony without adding a check.
 */
function respondJson(
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
	// A call no test queued a response for must fail here, never reach the
	// network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch: queue a response for every request');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

describe('retry behaviour', () => {
	it('retries a 429 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson({ error: { code: 429, description: 'Too many' } }, 429);
			respondJson(COMPANY_BODY);

			const pending = corsair.desktime.api.company.get({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(61_000);
			const result = await pending;

			expect(result.name).toBe('corsair test company');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honours a Retry-After header on a 429', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson({ error: { code: 429, description: 'Too many' } }, 429, {
				'Retry-After': '2',
			});
			respondJson(COMPANY_BODY);

			const pending = corsair.desktime.api.company.get({});
			await Promise.resolve();
			await Promise.resolve();
			// Under the requested wait nothing has retried yet.
			await jest.advanceTimersByTimeAsync(1_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_500);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson({ error: { code: 429, description: 'Too many' } }, 429);
			respondJson({ error: { code: 429, description: 'Too many' } }, 429);
			respondJson({ error: { code: 429, description: 'Too many' } }, 429);

			const pending = corsair.desktime.api.company
				.get({})
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the field it checks.
				.catch((caught: unknown) => caught);
			for (let step = 0; step < 4; step++) {
				await Promise.resolve();
				await jest.advanceTimersByTimeAsync(61_000);
			}
			const error = await pending;

			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx, which is safe because every call is a GET', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson({ error: { code: 500, description: 'Server error' } }, 500);
			respondJson(PING_BODY);

			const pending = corsair.desktime.api.ping.get({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(5_000);
			const result = await pending;

			expect(result.pong).toBe('1794135987');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respondJson(INVALID_KEY_ERROR, 401);

			await expect(corsair.desktime.api.company.get({})).rejects.toMatchObject({
				status: 401,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('pins the no-header delay at one minute', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson({ error: { code: 429, description: 'Too many' } }, 429);
			respondJson(COMPANY_BODY);

			const pending = corsair.desktime.api.company.get({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(59_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(2_000);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
