import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { loops } from './index';
import {
	contactResponse,
	rateLimitedResponse,
	sentResponse,
} from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with
 * `maxRetries: 0`; only the bound client retries, using this plugin's error
 * handlers. This file goes through `createCorsair` so that retry layer
 * actually runs. It is not named `integration.test.ts`, because CI skips
 * that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'loops', 'default');
	const corsair = createCorsair({
		plugins: [loops({ key: 'test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200): void {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the rows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimitedResponse, 429);
			respond([contactResponse]);

			const result = await corsair.loops.api.contacts.find({
				email: 'alex@company.com',
			});

			expect(result).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(rateLimitedResponse, 429);
			}

			await expect(corsair.loops.api.lists.list({})).rejects.toMatchObject({
				status: 429,
			});
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on events.send, which has no idempotency key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, message: 'boom' }, 500);

			await expect(
				corsair.loops.api.events.send({
					eventName: 'signup',
					email: 'alex@company.com',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on transactional.send when an idempotency key is set', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, message: 'boom' }, 500);
			respond(sentResponse);

			const result = await corsair.loops.api.transactional.send({
				email: 'alex@company.com',
				transactionalId: 'cll42l54f20i1la0lfooe3z12',
				idempotencyKey: '0e8e17e0-3e73-4c8b-b7c9-2a5a6d3f9c1d',
			});

			expect(result.success).toBe(true);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond([contactResponse]);

			const result = await corsair.loops.api.contacts.find({
				email: 'alex@company.com',
			});

			expect(result).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a dropped connection on events.send', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.loops.api.events.send({
					eventName: 'signup',
					email: 'alex@company.com',
				}),
			).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits about one second before the first no-header retry', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimitedResponse, 429);
			respond([contactResponse]);

			const pending = corsair.loops.api.contacts.find({
				email: 'alex@company.com',
			});

			// Loops sends no Retry-After, so the fallback is the exponential
			// strategy's first step, 1000ms.
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;
			expect(result).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
