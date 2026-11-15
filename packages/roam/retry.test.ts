import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { roam } from './index';
import { CHAT_ID, CHAT_PAGE, INVALID_TOKEN_TEXT } from './test-fixtures';
import { respond, respondAsText, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof roam>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'roam', 'default');
	const corsair = createCorsair({
		plugins: [roam(options)],
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
		const { corsair, testDb } = await createClient({ key: 'roam-token' });
		try {
			respondAsText(fetchMock, { ok: false, error: 'rate_limited' }, 429);
			respond(fetchMock, CHAT_PAGE);

			const result = await withFakeTimers(corsair.roam.api.chat.list({}));

			expect(result.chats).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'roam-token' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respondAsText(fetchMock, { ok: false, error: 'rate_limited' }, 429);
			}

			await expect(
				withFakeTimers(corsair.roam.api.chat.list({})),
			).rejects.toThrow(/Roam 429/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a post that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'roam-token' });
		try {
			respondAsText(fetchMock, { ok: false, error: 'internal_error' }, 500);

			await expect(
				withFakeTimers(
					corsair.roam.api.chat.post({
						chat_id: CHAT_ID,
						text: 'Standup in five',
					}),
				),
			).rejects.toThrow(/Roam 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'roam-token' });
		try {
			respondAsText(fetchMock, { ok: false, error: 'internal_error' }, 503);
			respond(fetchMock, CHAT_PAGE);

			const result = await withFakeTimers(corsair.roam.api.chat.list({}));

			expect(result.chats).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid token', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad-token' });
		try {
			respondAsText(fetchMock, INVALID_TOKEN_TEXT, 401);

			await expect(
				withFakeTimers(corsair.roam.api.chat.list({})),
			).rejects.toThrow(/invalid_token/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
