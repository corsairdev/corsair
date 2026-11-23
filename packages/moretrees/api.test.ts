import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moretrees } from './index';

/**
 * Live smoke against read-only operations. Skipped unless a More Trees API
 * key and the account code are provided. Nothing here writes; trees.plant
 * spends credits and is never exercised live.
 *
 *   MORETREES_API_KEY=... MORETREES_ACCOUNT_CODE=... pnpm test:live
 */
// Defaults keep the endpoint inputs' `string` types; the suite runs only
// when both env vars are set (see describeIfKey below).
const apiKey = process.env.MORETREES_API_KEY ?? '';
const accountCode = process.env.MORETREES_ACCOUNT_CODE ?? '';
const describeIfKey = apiKey && accountCode ? describe : describe.skip;

if (!apiKey || !accountCode) {
	const missing = [
		!apiKey && 'MORETREES_API_KEY',
		!accountCode && 'MORETREES_ACCOUNT_CODE',
	]
		.filter(Boolean)
		.join(', ');
	console.warn(`Skipping More Trees live tests: set ${missing}.`);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moretrees', 'default');
	const corsair = createCorsair({
		plugins: [moretrees({ key: apiKey, accountCode })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('moretrees live', () => {
	jest.setTimeout(30_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('parses the account through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moretrees.api.account.get({
			accountCode,
		});
		expect(typeof result.credit_balance).toBe('number');
	});

	it('parses the forest through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moretrees.api.forest.get({
			forestSlugOrAccountCode: accountCode,
		});
		expect(
			typeof result.forest_name === 'string' || result.forest_name === null,
		).toBe(true);
	});

	it('parses the projects through their output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moretrees.api.projects.list({});
		expect(Array.isArray(result)).toBe(true);
	});
});
