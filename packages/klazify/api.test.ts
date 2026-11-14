import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { KlazifyEndpointOutputSchemas } from './endpoints/types';
import { klazify } from './index';

/**
 * Live smoke test. Read-only: every endpoint only classifies, so this makes no
 * change at the provider.
 *
 * It cannot pass on Klazify's free plan. Every endpoint answers
 * `401 {"error":"Plan free no available"}` until the account is upgraded, and a
 * skip is reported rather than hidden so a run cannot be mistaken for a pass.
 */
const API_KEY = process.env.KLAZIFY_API_KEY;

if (!API_KEY) {
	console.warn('[klazify live] skipped, set KLAZIFY_API_KEY to run it');
}

const describeIfKey = API_KEY ? describe : describe.skip;

describeIfKey('Klazify live API', () => {
	let testDb: ReturnType<typeof createTestDatabase> | undefined;
	let corsair: ReturnType<typeof createCorsair>;

	beforeAll(async () => {
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'klazify', 'default');
		corsair = createCorsair({
			plugins: [klazify()],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.klazify.keys.issue_new_dek();
		await corsair.klazify.keys.set_api_key(API_KEY ?? '');
	});

	afterAll(() => testDb?.cleanup());

	// Every answer is passed through its published output schema, so a field
	// typed wrongly fails here rather than for a caller on a successful call.
	it('classifies a well-known site', async () => {
		const result = KlazifyEndpointOutputSchemas.categorizeAll.parse(
			await corsair.klazify.api.categorize.all({ url: 'https://apple.com' }),
		);

		expect(result.success).toBe(true);
		expect(Array.isArray(result.domain.categories)).toBe(true);
	});

	it('reads company data for a well-known site', async () => {
		const result = KlazifyEndpointOutputSchemas.companyGet.parse(
			await corsair.klazify.api.company.get({ url: 'https://apple.com' }),
		);

		expect(result.success).toBe(true);
	});

	it('lists the v1 category taxonomy', async () => {
		const result = KlazifyEndpointOutputSchemas.categoriesListV1.parse(
			await corsair.klazify.api.categories.listV1({}),
		);

		// The docs state 620 for v1.
		expect(result.count).toBe(620);
		expect(result.categories.length).toBeGreaterThan(0);
	});

	it('lists the v2 category taxonomy', async () => {
		const result = KlazifyEndpointOutputSchemas.categoriesListV2.parse(
			await corsair.klazify.api.categories.listV2({}),
		);

		// The docs state 1,091 for v2.
		expect(result.count).toBe(1091);
	});

	it('searches discovery and reports its paging counts', async () => {
		const result = KlazifyEndpointOutputSchemas.discoverySearch.parse(
			await corsair.klazify.api.discovery.search({
				filters: { category: 'Shopping' },
				page: 1,
			}),
		);

		expect(result.total_pages).toBeGreaterThan(0);
		expect(Array.isArray(result.results)).toBe(true);
	});
});
