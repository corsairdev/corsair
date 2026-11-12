import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { lemonsqueezy } from './index';
import { captureError } from './test-errors';
import { spyOnFetch } from './test-network';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'lemonsqueezy', 'default');
	const corsair = createCorsair({
		plugins: [lemonsqueezy()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.lemonsqueezy.keys.issue_new_dek();
	await corsair.lemonsqueezy.keys.set_api_key('ls-test-key');
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary provider JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/vnd.api+json', ...headers },
		}),
	);
}

const rateLimited = {
	jsonapi: { version: '1.0' },
	errors: [{ status: '429', title: 'Too Many Requests' }],
};

beforeEach(() => {
	fetchMock = spyOnFetch();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Lemon Squeezy retries through createCorsair', () => {
	it('retries a 429 and succeeds after the backoff', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429);
			respond({
				data: [],
				meta: { page: { currentPage: 1, lastPage: 1, perPage: 10 } },
			});

			const pending = corsair.lemonsqueezy.api.customers.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.data).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++) respond(rateLimited, 429);

			const pending = captureError(corsair.lemonsqueezy.api.customers.list({}));
			await jest.advanceTimersByTimeAsync(20_000);
			const error = await pending;

			expect(error).toBeInstanceOf(Error);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('never replays a refund on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ status: '500', title: 'Server Error' }] }, 500);

			const error = await captureError(
				corsair.lemonsqueezy.api.orders.refund({ orderId: '1', amount: 100 }),
			);

			expect(error).toBeInstanceOf(Error);
			// One attempt: a replay could refund twice.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does retry a read on a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ status: '503', title: 'Unavailable' }] }, 503);
			respond({
				data: [],
				meta: { page: { currentPage: 1, lastPage: 1, perPage: 10 } },
			});

			const pending = corsair.lemonsqueezy.api.customers.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.data).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('does not retry a validation failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					errors: [
						{
							status: '422',
							detail: 'The secret field is required.',
							source: { pointer: '/data/attributes/secret' },
						},
					],
				},
				422,
			);

			const error = await captureError(
				corsair.lemonsqueezy.api.webhooks.create({
					storeId: 1,
					url: 'https://example.com/hook',
					events: ['order_created'],
					secret: 'secret-value',
				}),
			);

			expect((error as Error).message).toContain('secret field is required');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
