import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moretrees } from './index';
import { account, plantSelfResponse, projects } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moretrees', 'default');
	const corsair = createCorsair({
		plugins: [moretrees({ key: 'mt-test-key', accountCode: 'AC1C2C' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown, // unknown: response bodies are arbitrary JSON.
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
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the good page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'throttled' }, 429, { 'Retry-After': '1' });
			respond(account);

			const result = await corsair.moretrees.api.account.get({
				accountCode: 'AC1C2C',
			});

			expect(result.account_name).toBe('Beachy BV');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows the throttle', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ error: 'throttled' }, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.moretrees.api.account.get({ accountCode: 'AC1C2C' }),
			).rejects.toMatchObject({ status: 429 });
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400 malformed request', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Bad Request' }, 400);

			await expect(
				corsair.moretrees.api.account.get({ accountCode: 'AC1C2C' }),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a transport failure and succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(projects);

			const result = await corsair.moretrees.api.projects.list({});

			expect(result).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a plant after a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'upstream unavailable' }, 503);

			await expect(
				corsair.moretrees.api.trees.plant({
					payment_account_code: 'AC1C2C',
					plant_for_others: false,
					quantity: 1,
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('parses the plant response through its output schema', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(plantSelfResponse, 201);

			const result = await corsair.moretrees.api.trees.plant({
				payment_account_code: 'AC1C2C',
				plant_for_others: false,
				quantity: 2,
			});

			expect(result.credits_used).toBe(2);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
