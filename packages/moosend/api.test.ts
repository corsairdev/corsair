import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moosend } from './index';

/**
 * Live smoke against read-only operations. Skipped unless a Moosend API key
 * is provided. Nothing here writes.
 *
 *   MOOSEND_API_KEY=... pnpm test:live
 */
const apiKey = process.env.MOOSEND_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('Skipping Moosend live tests: set MOOSEND_API_KEY.');
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moosend', 'default');
	const corsair = createCorsair({
		plugins: [moosend({ key: apiKey })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('moosend live', () => {
	jest.setTimeout(30_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('parses the mailing lists through their output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moosend.api.lists.list({});
		expect(Array.isArray(result.mailingLists)).toBe(true);
		for (const list of result.mailingLists) {
			expect(list.ID === null || typeof list.ID === 'string').toBe(true);
		}
	});

	it('parses the paged lists through their output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moosend.api.lists.listPaged({
			page: 1,
			pageSize: 10,
		});
		expect(Array.isArray(result.mailingLists)).toBe(true);
	});
});
