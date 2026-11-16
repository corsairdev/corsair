import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { teltel } from './index';
import {
	balanceResponse,
	numbersListResponse,
	smsSendResponse,
} from './test-fixtures';

/**
 * Core's request() retries a 429 three times, and the plugin's 429 handler
 * does not add more. This file goes through `createCorsair` to prove both
 * layers together.
 *
 * Reads replay after a 5xx, writes never do: a repeated send charges a second
 * message.
 */

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'teltel', 'default');
	const corsair = createCorsair({
		plugins: [teltel({ key: 'teltel-test-key' })],
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
			respond(
				{ errors: [{ code: '42900', title: 'Too many requests' }] },
				429,
				{ 'Retry-After': '1' },
			);
			respond(balanceResponse);

			const result = await corsair.teltel.api.account.balance({});

			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// Core retries a 429 three times, so 4 attempts in total.
			for (let i = 0; i < 4; i += 1) {
				respond({ errors: [{ code: '42900', title: 'Too many' }] }, 429);
			}

			await expect(
				corsair.teltel.api.account.balance({}),
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
			respond({ errors: [{ code: '42900', title: 'Too many' }] }, 429);
			respond(balanceResponse);

			// Fake timers start after the client exists, so the database setup
			// never runs on a fake clock.
			jest.useFakeTimers();
			const pending = corsair.teltel.api.account.balance({});

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

describe('server-error replay safety', () => {
	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ code: '50000', title: 'Server error' }] }, 500);
			respond(numbersListResponse);

			const result = await corsair.teltel.api.numbers.list({});

			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays an SMS send on 5xx, because it may have gone out', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ code: '50000', title: 'Server error' }] }, 500);
			respond(smsSendResponse);

			await expect(
				corsair.teltel.api.sms.send({
					from: '37126118199',
					to: '37126118198',
					message: 'Hello',
				}),
			).rejects.toMatchObject({ status: 500 });

			// Exactly one attempt: a second send charges a second message.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
