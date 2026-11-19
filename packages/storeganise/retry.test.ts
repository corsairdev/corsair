import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { storeganise } from './index';
import { unit } from './test-fixtures';

/**
 * One retry layer: the transport does not retry (client.ts pins maxRetries:
 * 0) and error-handlers.ts decides the rest. Storeganise documents no
 * rate-limit contract, so a 429 fails immediately. Only reads are replayed
 * on 5xx: the one documented write sets rental custom fields, so a repeat
 * send has no documented idempotency contract.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'storeganise', 'default');
	const corsair = createCorsair({
		plugins: [
			storeganise({ key: 'sg-test-key', businessCode: 'spaceup' }),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200, headers: Record<string, string> = {}) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('fails fast on a 429 instead of replaying on guesswork', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: { type: 'TooManyRequests', message: 'Slow down' } }, 429, {
				'Retry-After': '1',
			});

			await expect(
				corsair.storeganise.api.units.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { type: 'InternalError', message: 'Something went wrong' } },
				503,
			);
			respond([unit]);

			await expect(corsair.storeganise.api.units.list({})).resolves.toEqual([
				unit,
			]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the documented write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { type: 'InternalError', message: 'Something went wrong' } },
				502,
			);

			await expect(
				corsair.storeganise.api.unitRentals.update({
					unitRentalId: '5d9f2c8bbf3e2c0017a4b1c3',
					customFields: { myAC_accessCode: '482913' },
				}),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { type: 'Unauthorized', message: 'Not authorized' } },
				401,
			);

			await expect(
				corsair.storeganise.api.units.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('backs off the exponential strategy between 503 replays with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { type: 'InternalError', message: 'Something went wrong' } },
				503,
			);
			respond([unit]);

			const pending = corsair.storeganise.api.units.list({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toEqual([unit]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
