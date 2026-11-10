import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { shippo } from './index';
import { address, paged, shipment } from './test-fixtures';

/**
 * The endpoints call the HTTP client with `maxRetries: 0`; only the bound client
 * retries, using this plugin's error handlers. Going through `createCorsair` is
 * what makes that layer run. The file is not named `integration.test.ts`
 * because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'shippo', 'default');
	const corsair = createCorsair({
		plugins: [shippo({ key: 'shippo_test_retry' })],
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
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.useFakeTimers();
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * The rate-limit handler waits a full minute when Shippo sends no Retry-After,
 * so timers have to be advanced rather than the test sat through.
 */
async function advance<T>(promise: Promise<T>): Promise<T> {
	const settled = promise.then(
		(value) => ({ ok: true as const, value }),
		// unknown: a rejection payload has no type; it is rethrown unchanged.
		(error: unknown) => ({ ok: false as const, error }),
	);
	await jest.advanceTimersByTimeAsync(400_000);
	const outcome = await settled;
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}

describe('Shippo retries through the bound client', () => {
	it('retries a read after a 429 and returns the good page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Throttled' }, 429);
			respond(paged([address]));

			const result = await advance(corsair.shippo.api.addresses.list({}));

			expect(result.results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honours a Retry-After header instead of the one-minute fallback', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Throttled' }, 429, { 'Retry-After': '2' });
			respond(shipment);

			const settled = corsair.shippo.api.shipments
				.get({ shipment_id: '1' })
				.then(
					(value) => value,
					// unknown: a rejection payload has no type.
					(error: unknown) => error,
				);

			// One second is not enough if the 2-second header was read.
			await jest.advanceTimersByTimeAsync(1000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1500);
			await settled;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the three retries the handler allows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt += 1) {
				respond({ detail: 'Throttled' }, 429);
			}

			await expect(
				advance(corsair.shippo.api.addresses.list({})),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a label purchase after a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Internal error' }, 500);

			await expect(
				corsair.shippo.api.transactions.create({ rate: 'rate-id' }),
			).rejects.toMatchObject({ status: 500 });
			// A 5xx on a buy may already have been applied at the carrier.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a batch purchase after a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Internal error' }, 500);

			await expect(
				corsair.shippo.api.batches.purchase({ batch_id: 'batch-id' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read after a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Internal error' }, 500);
			respond(shipment);

			const result = await advance(
				corsair.shippo.api.shipments.get({ shipment_id: '1' }),
			);

			expect(result.status).toBe('SUCCESS');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a 401 immediately, since a bad token stays bad', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Token does not exist' }, 401);

			await expect(corsair.shippo.api.addresses.list({})).rejects.toMatchObject(
				{ status: 401, code: 'INVALID_TOKEN' },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a 400 field error immediately', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ country: ['is required'] }, 400);

			await expect(
				corsair.shippo.api.addresses.create({ country: 'US' }),
			).rejects.toMatchObject({ status: 400, code: 'VALIDATION_ERROR' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
