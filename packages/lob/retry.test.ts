import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { lob } from './index';
import { balanceOk, postcardOk, rateLimited } from './test-fixtures';

/**
 * Two layers retry. Core's HTTP client retries a 429 three times (1 s, 2 s,
 * 4 s) inside one call; `error-handlers.ts` then decides whether the whole
 * call runs again. This file goes through `createCorsair` to prove both run.
 *
 * The mail sends dispatch physical pieces, so a 5xx replay is gated on the
 * Idempotency-Key: without one nothing is retried, with one the send may
 * replay because Lob returns the original piece.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'lob', 'default');
	const corsair = createCorsair({
		plugins: [lob({ key: 'test_fake_key_0000' })],
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

const postcardInput = {
	to: 'adr_210a8d4b0b76d77b',
	front: '<html>Front</html>',
	back: '<html>Back</html>',
	use_type: 'operational' as const,
};

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

describe('rate-limit retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429);
			respond(balanceOk);

			const result = await corsair.lob.api.account.getBalance({});

			expect(result.balance).toBe(42.5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('gives up after three core retries', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			// Core: 1 + 3 attempts. The handler does not run the call again.
			for (let i = 0; i < 4; i += 1) {
				respond(rateLimited, 429);
			}

			const settled = corsair.lob.api.account
				.getBalance({})
				.catch((caught: unknown) => caught);
			for (let i = 0; i < 10; i += 1) {
				await jest.advanceTimersByTimeAsync(5_000);
			}
			await expect(settled).resolves.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('waits 1 second before the first core retry', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			respond(rateLimited, 429);
			respond(balanceOk);

			const promise = corsair.lob.api.account.getBalance({});

			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			const result = await promise;
			expect(result.balance).toBe(42.5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});

describe('5xx replay safety', () => {
	it('does not replay a mail send that has no idempotency key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: {
						message: 'boom',
						status_code: 500,
						code: 'internal_server_error',
					},
				},
				500,
			);

			await expect(
				corsair.lob.api.postcards.send(postcardInput),
			).rejects.toMatchObject({ status: 500 });
			// Exactly one attempt: the piece may already be in production.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays an idempotency-keyed mail send on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: {
						message: 'boom',
						status_code: 500,
						code: 'internal_server_error',
					},
				},
				500,
			);
			respond(postcardOk);

			const result = await corsair.lob.api.postcards.send({
				...postcardInput,
				idempotency_key: 'order-42',
			});

			expect(result.id).toBe('psc_208e45e48d271294');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: {
						message: 'boom',
						status_code: 503,
						code: 'service_unavailable',
					},
				},
				503,
			);
			respond(balanceOk);

			const result = await corsair.lob.api.account.getBalance({});
			expect(result.balance).toBe(42.5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});

describe('transport-failure retries through createCorsair', () => {
	it('retries a dropped connection on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(balanceOk);

			const result = await corsair.lob.api.account.getBalance({});
			expect(result.balance).toBe(42.5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('gives up when the connection keeps dropping on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 1 retry, so 2 attempts in total.
			fetchMock.mockRejectedValue(new TypeError('fetch failed'));

			await expect(corsair.lob.api.account.getBalance({})).rejects.toThrow(
				'fetch failed',
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not retry a dropped connection on a keyless send', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.lob.api.postcards.send(postcardInput),
			).rejects.toThrow('fetch failed');
			// Exactly one attempt: Lob may have applied the send before the
			// connection dropped.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection on an idempotency-keyed send', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(postcardOk);

			const result = await corsair.lob.api.postcards.send({
				...postcardInput,
				idempotency_key: 'order-42',
			});
			expect(result.id).toBe('psc_208e45e48d271294');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
