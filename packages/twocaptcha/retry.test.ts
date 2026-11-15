import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { twocaptcha } from './index';
import {
	balance,
	noSlot,
	taskCreated,
	taskNotReady,
	taskSolved,
} from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with `maxRetries: 0`
 * so only `error-handlers.ts` decides what is retried.
 *
 * Creating a task is billable and is never replayed; the reads here queue their
 * responses rather than waiting on the real service.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'twocaptcha', 'default');
	const corsair = createCorsair({
		plugins: [twocaptcha({ key: 'a'.repeat(32) })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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

describe('retries through createCorsair', () => {
	it('retries a no-slot-available answer and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(noSlot);
			respond(balance);

			const result = await corsair.twocaptcha.api.account.balance({});

			expect(result.request).toBe(12.3456);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(noSlot);
			}

			await expect(
				corsair.twocaptcha.api.account.balance({}),
			).rejects.toMatchObject({ code: 'ERROR_NO_SLOT_AVAILABLE' });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not replay a task create on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 500);

			await expect(
				corsair.twocaptcha.api.tasks.create({
					type: 'RecaptchaV2TaskProxyless',
					task: { websiteURL: 'https://x.test', websiteKey: '0x4AAA' },
				}),
			).rejects.toBeDefined();
			// A replay could create a second billable task.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);
			respond(taskSolved);

			const result = await corsair.twocaptcha.api.tasks.result({
				task_id: '734920165',
			});

			expect(result.request).toBe('03AGdBq26_abcdefghijklmnop');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a wrong key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 0, request: 'ERROR_WRONG_USER_KEY' });

			await expect(
				corsair.twocaptcha.api.account.balance({}),
			).rejects.toMatchObject({ code: 'ERROR_WRONG_USER_KEY' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a task create normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(taskCreated);

			const result = await corsair.twocaptcha.api.tasks.create({
				type: 'RecaptchaV2TaskProxyless',
				task: { websiteURL: 'https://x.test', websiteKey: '0x4AAA' },
			});

			expect(result.request).toBe('734920165');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns the not-ready state rather than retrying it', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(taskNotReady);

			const result = await corsair.twocaptcha.api.tasks.result({
				task_id: '734920165',
			});

			// Not ready is a state, not a failure: the caller polls again.
			expect(result.status).toBe(0);
			expect(result.request).toBe('CAPCHA_NOT_READY');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
