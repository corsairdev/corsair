import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mailerlite } from './index';
import { groupsListResponse } from './test-fixtures';
import { captureError } from './test-helpers';

/**
 * The endpoint tests call the HTTP client, which is built with `maxRetries: 0`
 * so only error-handlers.ts decides what is retried. This file goes through
 * `createCorsair` to prove that layer actually runs, and pins the exact
 * backoff delays with fake timers.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mailerlite', 'default');
	const corsair = createCorsair({
		plugins: [mailerlite({ key: 'ml-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown, // unknown: each test states its own body shape.
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
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('retries a 429 using its Retry-After', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			respond({ message: 'Too Many Attempts.' }, 429, { 'Retry-After': '2' });
			respond(groupsListResponse);

			const promise = corsair.mailerlite.api.groups.list({});
			await jest.advanceTimersByTimeAsync(2_000);
			const result = await promise;

			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the full fallback minute when the 429 carries no header', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			respond({ message: 'Too Many Attempts.' }, 429);
			respond(groupsListResponse);

			const promise = corsair.mailerlite.api.groups.list({});
			// One second short of the fallback: the retry must not have run yet.
			await jest.advanceTimersByTimeAsync(59_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);
			const result = await promise;

			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three rate-limit retries', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ message: 'Too Many Attempts.' }, 429);
			}

			const promise = corsair.mailerlite.api.groups.list({});
			const run = captureError(promise) as Promise<
				'resolved' | Error
			>;
			await jest.advanceTimersByTimeAsync(4 * 60_000);
			const outcome = await run;

			expect((outcome as Error).message).toContain('Too Many Attempts.');
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a 5xx on a campaign schedule, because a repeat could send twice', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			respond({ message: 'Server error' }, 500);

			const promise = corsair.mailerlite.api.campaigns.schedule({
				campaignId: '1',
				delivery: 'instant',
			});
			const run = captureError(promise) as Promise<'resolved' | Error>;
			await jest.advanceTimersByTimeAsync(30_000);
			const outcome = await run;

			expect((outcome as Error).message).toContain('Server error');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on the subscriber upsert, which upserts on email', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			respond({ message: 'Server error' }, 502);
			respond({ data: { id: '1', email: 'dummy@example.com', status: 'active' } });

			const promise = corsair.mailerlite.api.subscribers.upsert({
				email: 'dummy@example.com',
			});
			// exponential_backoff sleeps 1s before the first retry.
			await jest.advanceTimersByTimeAsync(1_000);
			const result = await promise;

			expect(result.data.email).toBe('dummy@example.com');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a transport failure on a read', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(groupsListResponse);

			const promise = corsair.mailerlite.api.groups.list({});
			await jest.advanceTimersByTimeAsync(1_000);
			const result = await promise;

			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
