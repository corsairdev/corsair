import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { spondyr } from './index';
import {
	sendAccepted,
	statusSubmitted,
	transactionTypeList,
} from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with `maxRetries: 0`
 * so only `error-handlers.ts` decides what is retried. This file goes through
 * `createCorsair` to prove that layer actually runs.
 *
 * Reads are replayed and writes are not: `POST /Spondyr` generates and may
 * deliver correspondence, so a replay after an unknown outcome could send the
 * document twice.
 */
const APPLICATION_TOKEN = 'sp-test-token';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'spondyr', 'default');
	const corsair = createCorsair({
		plugins: [
			spondyr({ key: 'sp-test-key', applicationToken: APPLICATION_TOKEN }),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown, // unknown: each test passes its own JSON.
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
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '1' });
			respond(transactionTypeList);

			const result = await corsair.spondyr.api.transactionTypes.list({});

			expect(result.Data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({}, 429);
			}

			await expect(
				corsair.spondyr.api.transactionTypes.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not replay a write on a 5xx, which may have delivered', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 500);

			await expect(
				corsair.spondyr.api.correspondence.send({
					event_type: 'OrderPlaced',
					data: {},
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);
			respond(statusSubmitted);

			const result = await corsair.spondyr.api.correspondence.status({
				reference_id: 'c1a2b3-reference',
			});

			expect(result.StatusCode).toBe('MATCH');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad-credential 400', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					APIStatus: 'ERROR',
					ErrorMessage: 'API Key is invalid! Application Token is invalid!',
				},
				400,
			);

			await expect(
				corsair.spondyr.api.transactionTypes.list({}),
			).rejects.toMatchObject({ status: 400 });
			// A wrong key fails again; the retry would only cost an attempt.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a write normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(sendAccepted);

			const result = await corsair.spondyr.api.correspondence.send({
				event_type: 'OrderPlaced',
				data: { OrderNumber: 12345 },
			});

			expect(result.ReferenceID).toBe('c1a2b3-reference');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '2' });
			respond(transactionTypeList);

			const pending = corsair.spondyr.api.transactionTypes.list({});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({
				Data: [expect.anything()],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the strategy delay when there is no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429);
			respond(transactionTypeList);

			const pending = corsair.spondyr.api.transactionTypes.list({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				Data: [expect.anything()],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
