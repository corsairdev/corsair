import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { paystack } from './index';
import { plan, transaction } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because initializes and refunds are not idempotent.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'paystack', 'default');
	const corsair = createCorsair({
		plugins: [paystack({ key: 'sk_test_paystack' })],
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
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
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
	it("retries a 429 through the transport's rate-limit handling", async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });
			respond({
				status: true,
				message: 'Transactions retrieved',
				data: [transaction],
				meta: {},
			});

			await expect(
				corsair.paystack.api.transactions.list({}),
			).resolves.toMatchObject({ data: [transaction] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong' }, 503);
			respond({
				status: true,
				message: 'Plans retrieved',
				data: [plan],
				meta: {},
			});

			await expect(corsair.paystack.api.plans.list({})).resolves.toMatchObject({
				data: [plan],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the initialize write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong' }, 502);

			await expect(
				corsair.paystack.api.transactions.initialize({
					amount: '10000',
					email: 'john.doe@example.com',
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
			respond({ status: false, message: 'Invalid key' }, 401);

			await expect(
				corsair.paystack.api.transactions.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails fast on a 200 whose body says status false', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: false, message: 'Plan not found' });

			await expect(
				corsair.paystack.api.plans.get({ idOrCode: 'PLN_missing' }),
			).rejects.toThrow('Plan not found');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
