import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { telnyx } from './index';
import { messageResponse, messagingProfilesList } from './test-fixtures';

/**
 * The client makes one attempt and the plugin's 429 handler retries, so a
 * 429 for an exhausted daily spend limit (40333) is not retried. This file
 * goes through `createCorsair` to prove that layer runs.
 *
 * Reads replay after a 5xx, writes never do: a repeated message send charges a
 * second message, and a repeated dial places a second call.
 */

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'telnyx', 'default');
	const corsair = createCorsair({
		plugins: [telnyx({ key: 'telnyx-test-key' })],
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
			respond({ errors: [{ title: 'Too many requests' }] }, 429, {
				'Retry-After': '1',
			});
			respond(messagingProfilesList);

			const result = await corsair.telnyx.api.messagingProfiles.list({});

			expect(result.data).toHaveLength(1);
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
				respond({ errors: [{ title: 'Too many requests' }] }, 429);
			}

			await expect(
				corsair.telnyx.api.messagingProfiles.list({}),
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
			respond({ errors: [{ title: 'Too many requests' }] }, 429);
			respond(messagingProfilesList);

			// Fake timers start after the client exists, so the database setup
			// never runs on a fake clock.
			jest.useFakeTimers();
			const pending = corsair.telnyx.api.messagingProfiles.list({});

			await jest.advanceTimersByTimeAsync(0);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toMatchObject({ data: expect.any(Array) });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	}, 30_000);
});

describe('spend-limit 429', () => {
	it('does not retry a 429 that reports the daily spend limit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ errors: [{ code: '40333', title: 'Daily spend limit reached' }] },
				429,
			);

			await expect(
				corsair.telnyx.api.messages.send({
					to: '+13125550002',
					from: '+13125550001',
					text: 'Hello',
				}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});

describe('server-error replay safety', () => {
	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ title: 'Server error' }] }, 500);
			respond(messageResponse);

			const result = await corsair.telnyx.api.messages.get({
				messageId: '40385f64-5717-4562-b3fc-2c963f66afa6',
			});

			expect(result.data.id).toBe('40385f64-5717-4562-b3fc-2c963f66afa6');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays a message send on 5xx, because it may have gone out', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ title: 'Server error' }] }, 500);

			await expect(
				corsair.telnyx.api.messages.send({
					to: '+13125550002',
					from: '+13125550001',
					text: 'Hello',
				}),
			).rejects.toMatchObject({ status: 500 });

			// Exactly one attempt: a second send charges a second message.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
