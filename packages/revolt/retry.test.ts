import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { revolt } from './index';
import {
	CHANNEL_ID,
	MESSAGE_LIST,
	RATE_LIMITED,
	UNAUTHORIZED,
} from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof revolt>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'revolt', 'default');
	const corsair = createCorsair({
		plugins: [revolt(options)],
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
		const { corsair, testDb } = await createClient({ key: 'rv-token' });
		try {
			respond(fetchMock, RATE_LIMITED, 429);
			respond(fetchMock, MESSAGE_LIST);

			const result = await withFakeTimers(
				corsair.revolt.api.messages.list({ channel_id: CHANNEL_ID }),
			);

			expect(result.messages).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rv-token' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, RATE_LIMITED, 429);
			}

			await expect(
				withFakeTimers(
					corsair.revolt.api.messages.list({ channel_id: CHANNEL_ID }),
				),
			).rejects.toThrow(/Revolt 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a send that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rv-token' });
		try {
			respond(
				fetchMock,
				{
					type: 'InternalError',
					location: 'crates/core/database/src/x.rs:1:1',
				},
				500,
			);

			await expect(
				withFakeTimers(
					corsair.revolt.api.messages.send({
						channel_id: CHANNEL_ID,
						content: 'hi',
					}),
				),
			).rejects.toThrow(/Revolt 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected token', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad' });
		try {
			respond(fetchMock, UNAUTHORIZED, 401);

			await expect(
				withFakeTimers(
					corsair.revolt.api.messages.list({ channel_id: CHANNEL_ID }),
				),
			).rejects.toThrow(/requires user authentication/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
