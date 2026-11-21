import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { hotspotsystem } from './index';

/**
 * The page reads call `fetch` directly so they can read the `Link` header, and
 * the two other reads go through `corsair/http`; either way only the bound
 * client retries, using this plugin's error handlers. This file goes through
 * `createCorsair` so that retry layer actually runs. It is not named
 * `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'hotspotsystem', 'default');
	const corsair = createCorsair({
		plugins: [hotspotsystem({ key: 'sn_test' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** A response as HotspotSystem sends it. */
// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(
	body: unknown,
	{
		status = 200,
		headers = {},
	}: { status?: number; headers?: Record<string, string> } = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

const page = {
	metadata: { total_count: 1 },
	items: [{ id: '1', name: 'Location 1' }],
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 500 on a page read and returns the rows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Internal Server Error' }, { status: 500 });
			respond(page);

			const result = await corsair.hotspotsystem.api.locations.list({});

			expect(result.items).toHaveLength(1);
			expect(result.items[0]?.name).toBe('Location 1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 500 on the single reads that go through corsair/http', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Internal Server Error' }, { status: 500 });
			respond({ ping: 'pong' });

			const result = await corsair.hotspotsystem.api.ping.check({});

			expect(result.ping).toBe('pong');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after two retries and rethrows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 3; i += 1) {
				respond({ error: 'Internal Server Error' }, { status: 500 });
			}

			await expect(
				corsair.hotspotsystem.api.locations.list({}),
			).rejects.toMatchObject({ status: 500 });
			// One attempt plus the two SERVER_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Invalid authentication!' }, { status: 401 });

			await expect(corsair.hotspotsystem.api.me.get({})).rejects.toMatchObject({
				status: 401,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a refused input, because no request is sent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// `offset` is a non-negative integer, so this fails before the request.
			await expect(
				corsair.hotspotsystem.api.locations.list({ offset: -1 }),
			).rejects.toBeDefined();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
