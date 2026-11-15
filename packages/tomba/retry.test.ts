import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { tomba } from './index';
import { account, person, verification } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with `maxRetries: 0`
 * so only `error-handlers.ts` decides what is retried.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'tomba', 'default');
	const corsair = createCorsair({
		plugins: [tomba({ key: 'tb-test-key', apiSecret: 'tb-test-secret' })],
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
	it('retries a 429 on a lookup and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: { type: 'rate_limit', message: 'slow down' } }, 429, {
				'Retry-After': '1',
			});
			respond({ data: person });

			const result = await corsair.tomba.api.finder.email({
				domain: 'stripe.com',
				first_name: 'Jane',
			});

			expect(result.data.email).toBe('jane.doe@stripe.com');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ errors: { type: 'rate_limit' } }, 429);
			}

			await expect(corsair.tomba.api.account.get({})).rejects.toMatchObject({
				status: 429,
			});
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not retry a 402 empty balance, which no replay fixes', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					errors: { type: 'insufficient_credits', message: 'balance too low' },
				},
				402,
			);

			await expect(
				corsair.tomba.api.verifier.email({ email: 'jane@stripe.com' }),
			).rejects.toMatchObject({ status: 402 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 451 legal block', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: { type: 'legal_block', message: 'withheld' } }, 451);

			await expect(
				corsair.tomba.api.finder.enrich({ email: 'jane@stripe.com' }),
			).rejects.toMatchObject({ status: 451 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 500, which the docs say to retry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: { message: 'boom' } }, 500);
			respond({ data: account });

			const result = await corsair.tomba.api.account.get({});

			expect(result.data.confirmed).toBe(true);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a lookup normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ data: verification });

			const result = await corsair.tomba.api.verifier.email({
				email: 'jane.doe@stripe.com',
			});

			expect(result.data.email.status).toBe('valid');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: { type: 'rate_limit' } }, 429, { 'Retry-After': '2' });
			respond({ data: person });

			const pending = corsair.tomba.api.finder.email({
				domain: 'stripe.com',
				first_name: 'Jane',
			});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({
				data: { email: expect.any(String) },
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
			respond({ errors: { type: 'rate_limit' } }, 429);
			respond({ data: person });

			const pending = corsair.tomba.api.finder.email({
				domain: 'stripe.com',
				first_name: 'Jane',
			});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				data: { email: expect.any(String) },
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
