import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { textcortex } from './index';
import { chatResponse, modelsResponse } from './test-fixtures';

/**
 * `endpoints.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer runs.
 *
 * Reads replay after a 5xx, paid generations never do: a repeated completion
 * can bill a second answer.
 */

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'textcortex', 'default');
	const corsair = createCorsair({
		plugins: [textcortex({ key: 'tc-test-key' })],
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
			respond({ message: 'Too many requests', status: 'fail' }, 429, {
				'Retry-After': '1',
			});
			respond(modelsResponse);

			const result = await corsair.textcortex.api.models.list({});

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
				respond({ message: 'Too many requests', status: 'fail' }, 429);
			}

			await expect(
				corsair.textcortex.api.models.list({}),
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
			respond({ message: 'Too many requests', status: 'fail' }, 429);
			respond(modelsResponse);

			// Fake timers start after the client exists, so the database setup
			// never runs on a fake clock.
			jest.useFakeTimers();
			const pending = corsair.textcortex.api.models.list({});

			await jest.advanceTimersByTimeAsync(0);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toMatchObject({ object: 'list' });
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
			respond({ message: 'Server error', status: 'fail' }, 500);
			respond(modelsResponse);

			const result = await corsair.textcortex.api.models.list({});

			expect(result.data[0]?.id).toBe('gpt-6-luna');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays a chat completion on 5xx, because it may have been billed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error', status: 'fail' }, 500);
			respond(chatResponse);

			await expect(
				corsair.textcortex.api.chat.completions({
					model: 'gpt-6-luna',
					messages: [{ role: 'user', content: 'Hello' }],
				}),
			).rejects.toMatchObject({ status: 500 });

			// Exactly one attempt: a second completion can bill a second answer.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
