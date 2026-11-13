import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { shopify } from './index';
import { productPage, shop, throttledBody } from './test-fixtures';

/**
 * Endpoints call the HTTP client with `maxRetries: 0`; only the bound client
 * retries, using this plugin's error handlers. Going through `createCorsair` is
 * what makes that layer run. The file is not named `integration.test.ts`
 * because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'shopify', 'default');
	const corsair = createCorsair({
		plugins: [
			shopify({
				key: 'shpat_retry_token',
				shopDomain: 'corsair-test.myshopify.com',
			}),
		],
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
 * Core sleeps with plain setTimeout, so the wait is advanced rather than sat
 * through. The throttle delay is derived from the body, not a fixed constant.
 */
async function advance<T>(promise: Promise<T>): Promise<T> {
	const settled = promise.then(
		(value) => ({ ok: true as const, value }),
		// unknown: a rejection payload has no type; it is rethrown unchanged.
		(error: unknown) => ({ ok: false as const, error }),
	);
	await jest.advanceTimersByTimeAsync(60_000);
	const outcome = await settled;
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}

describe('Shopify retries through the bound client', () => {
	it('retries a read after a THROTTLED body and returns the page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// Throttling is HTTP 200 with a body code, not a 429.
			respond(throttledBody);
			respond({ data: productPage });

			const result = await advance(corsair.shopify.api.products.list({}));

			expect(result.products.edges).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the delay the throttle status implies, not a fixed constant', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// 100 requested, 50 available, restore rate 50/s: 1 second.
			respond(throttledBody);
			respond({ data: { shop } });

			const settled = corsair.shopify.api.shop.get({}).then(
				(value) => value,
				// unknown: a rejection payload has no type.
				(error: unknown) => error,
			);

			// Still the first attempt before the delay elapses.
			await jest.advanceTimersByTimeAsync(500);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(700);
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
				respond(throttledBody);
			}

			await expect(
				advance(corsair.shopify.api.products.list({})),
			).rejects.toMatchObject({ status: 429, code: 'THROTTLED' });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a product delete after a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Internal error' }, 500);

			await expect(
				corsair.shopify.api.products.delete({
					id: 'gid://shopify/Product/1',
				}),
			).rejects.toMatchObject({ status: 500 });
			// The delete may already have been applied.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay an order cancel after a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Internal error' }, 500);

			await expect(
				corsair.shopify.api.orders.cancel({ id: 'gid://shopify/Order/1' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read after a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Internal error' }, 500);
			respond({ data: { shop } });

			const result = await advance(corsair.shopify.api.shop.get({}));

			expect(result.shop.name).toBe('Corsair Test');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a rejected mutation immediately, since the same input fails again', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({
				data: {
					productCreate: {
						product: null,
						userErrors: [{ field: ['title'], message: 'Title is invalid' }],
					},
				},
			});

			await expect(
				corsair.shopify.api.products.create({ title: 'x' }),
			).rejects.toThrow(/Title is invalid/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails an auth failure immediately, since a bad token stays bad', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 401);

			await expect(corsair.shopify.api.products.list({})).rejects.toMatchObject(
				{ status: 401 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
