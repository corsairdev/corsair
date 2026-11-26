import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moretrees } from './index';
import { account, plantSelfResponse, projectsBody } from './test-fixtures';

/**
 * Core's request() retries a 429 itself (three times, honouring Retry-After);
 * the bound client then applies this plugin's error handlers (5xx and
 * transport replays for reads only). This file goes through `createCorsair`
 * so both layers run. It is not named `integration.test.ts`, because CI
 * skips that name.
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

function respond(
	body: unknown, // unknown: response bodies are arbitrary JSON or raw text.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
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
			// One attempt plus core's three 429 retries; the handler adds none.
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
			respond(projectsBody);

			const result = await corsair.moretrees.api.projects.list({});

			expect(result.data).toHaveLength(2);
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

	it('replays a read after a 503 and succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 503, error: 'Service Unavailable' }, 503);
			respond(account);

			const result = await corsair.moretrees.api.account.get({});

			expect(result.account_code).toBe('AC1C2C');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a plant after a transport failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.moretrees.api.trees.plant({
					plant_for_others: false,
					quantity: 1,
				}),
			).rejects.toThrow('fetch failed');
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
