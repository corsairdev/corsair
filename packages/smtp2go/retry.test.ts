import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { smtp2go } from './index';
import { statsCycleOk } from './test-fixtures';

/**
 * `endpoints.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer actually runs.
 *
 * The 429 retried here is stats.cycle, a read. A send is not retried on a
 * 5xx, because email delivery is not idempotent and a replay could send the
 * message twice.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'smtp2go', 'default');
	const corsair = createCorsair({
		plugins: [smtp2go({ key: 'api-testkey000000000000000000000001' })],
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

describe('rate-limit retries through createCorsair', () => {
	it('retries a 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The live 429 carries an empty body; a Retry-After header keeps the
			// test's real sleep to one second (the headerless case is pinned
			// with fake timers below).
			respond('', 429, { 'Retry-After': '1' });
			respond(statsCycleOk);

			const result = await corsair.smtp2go.api.stats.cycle({});

			expect(result.data.cycle_used).toBe(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('gives up after the single-retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 1 retry, so 2 attempts in total.
			respond('', 429, { 'Retry-After': '1' });
			respond('', 429, { 'Retry-After': '1' });

			await expect(corsair.smtp2go.api.stats.cycle({})).rejects.toMatchObject({
				status: 429,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('waits out the no-header fallback delay with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond('', 429);
			respond(statsCycleOk);

			const pending = corsair.smtp2go.api.stats.cycle({});
			await jest.advanceTimersByTimeAsync(59_999);
			// Still inside the documented one-minute IP throttle window.
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toMatchObject({
				data: { cycle_used: 1 },
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'boom' }, 502);
			respond(statsCycleOk);

			const result = await corsair.smtp2go.api.stats.cycle({});
			expect(result.data.cycle_max).toBe(10000);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not replay a send on a 5xx, because delivery is not idempotent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'boom' }, 502);

			await expect(
				corsair.smtp2go.api.email.send({
					sender: 'a@example.com',
					to: ['b@example.com'],
					text_body: 'once only',
				}),
			).rejects.toMatchObject({ status: 502 });
			// Exactly one attempt: a second send could deliver a duplicate email.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400 validation failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					request_id: 'x',
					data: {
						error: 'An error occurred processing the json data you sent.',
						error_code: 'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD',
					},
				},
				400,
			);

			await expect(corsair.smtp2go.api.stats.cycle({})).rejects.toMatchObject({
				status: 400,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
