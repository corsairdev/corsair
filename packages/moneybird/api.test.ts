import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moneybird } from './index';

/**
 * Live smoke against read-only operations. Skipped unless a Moneybird API
 * token and the administration id are provided. Nothing here writes.
 *
 *   MONEYBIRD_API_KEY=... MONEYBIRD_ADMINISTRATION_ID=... pnpm test:live
 */
const apiKey = process.env.MONEYBIRD_API_KEY;
const administrationId = process.env.MONEYBIRD_ADMINISTRATION_ID;
const describeIfKey = apiKey && administrationId ? describe : describe.skip;

if (!apiKey || !administrationId) {
	const missing = [
		!apiKey && 'MONEYBIRD_API_KEY',
		!administrationId && 'MONEYBIRD_ADMINISTRATION_ID',
	]
		.filter(Boolean)
		.join(', ');
	console.warn(`Skipping Moneybird live tests: set ${missing}.`);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moneybird', 'default');
	const corsair = createCorsair({
		plugins: [moneybird({ key: apiKey, administrationId })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('moneybird live', () => {
	jest.setTimeout(30_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('parses the administrations through their output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moneybird.api.administrations.list({});
		expect(Array.isArray(result.administrations)).toBe(true);
		for (const entry of result.administrations) {
			expect(entry.id).toMatch(/^\d+$/);
		}
	});

	it('parses the first contact page through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moneybird.api.contacts.list({});
		expect(Array.isArray(result.items)).toBe(true);
		for (const entry of result.items) {
			expect(entry.id).toMatch(/^\d+$/);
		}
	});

	it('parses the first sales invoice page through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moneybird.api.salesInvoices.list({
			filter: 'period:this_year',
		});
		expect(Array.isArray(result.items)).toBe(true);
	});
});
