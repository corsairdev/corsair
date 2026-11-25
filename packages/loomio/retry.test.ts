import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { LoomioAPIError } from './client';
import { loomio } from './index';
import { captureError, refuseNetwork } from './test-errors';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'loomio', 'default');
	const corsair = createCorsair({
		plugins: [loomio()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.loomio.keys.issue_new_dek();
	await corsair.loomio.keys.set_api_key('loomio-test-key');
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(raw: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(raw), {
			status,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(refuseNetwork);
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Loomio retries through createCorsair', () => {
	it('retries a 429 and succeeds after the backoff', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'slow down' }, 429);
			respond({ groups: [], meta: { root: 'groups', total: 0 } });

			const pending = corsair.loomio.api.groups.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.groups).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('waits the full 1000ms no-header delay before the 429 retry', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			// Loomio sends no Retry-After, so the delay comes from the
			// exponential_backoff strategy alone: exactly 1s on the first retry.
			respond({ error: 'slow down' }, 429);
			respond({ groups: [], meta: { root: 'groups', total: 0 } });

			const pending = corsair.loomio.api.groups.list({});
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;

			expect(result.groups).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++)
				respond({ error: 'slow down' }, 429);

			const pending = captureError(corsair.loomio.api.groups.list({}));
			await jest.advanceTimersByTimeAsync(20_000);
			const error = await pending;

			expect(error).toBeInstanceOf(LoomioAPIError);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('never replays a discussion create on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'boom' }, 500);

			const error = await captureError(
				corsair.loomio.api.discussions.create({
					group_id: 12,
					title: 'Create once',
				}),
			);

			// The 5xx reached Loomio and the write is not idempotent, so
			// replaySafe is false and the DEFAULT handler refuses to retry.
			expect(error).toBeInstanceOf(LoomioAPIError);
			expect((error as LoomioAPIError).status).toBe(500);
			expect((error as LoomioAPIError).replaySafe).toBe(false);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read on a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'boom' }, 503);
			respond({ groups: [], meta: { root: 'groups', total: 0 } });

			const pending = corsair.loomio.api.groups.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.groups).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});
});
