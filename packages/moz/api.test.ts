import { createCorsair } from 'corsair';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { MozEndpointOutputSchemas as Outputs } from './endpoints/types';
import { moz } from './index';

/**
 * Live smoke against free operations only. Skipped unless a Moz API token is
 * provided. quota.lookup, metadata.locale.list and the free example of
 * data.site.metrics.fetch (moz.com with a domain scope) consume no rows;
 * nothing here writes because the Moz data API has no write operations.
 *
 *   MOZ_API_KEY=... pnpm test:live
 */
const apiKey = process.env.MOZ_API_KEY ?? '';
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('Skipping Moz live tests: set MOZ_API_KEY.');
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moz', 'default');
	const corsair = createCorsair({
		plugins: [moz({ key: apiKey })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('moz live', () => {
	jest.setTimeout(30_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('reads the quota through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const raw = await corsair.moz.api.quota.lookup({
			path: 'api.limits.data.rows',
		});
		const result = Outputs.quotaLookup.parse(raw);
		expect(result.quota.allotted).toBeGreaterThan(0);
	});

	it('lists google locales through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const raw = await corsair.moz.api.locales.list({ engine: 'google' });
		const result = Outputs.localesList.parse(raw);
		expect(result.engine).toBe('google');
		expect(result.locales.length).toBeGreaterThan(0);
	});

	// The documented free example: costs no rows when sent exactly as-is.
	it('fetches moz.com metrics through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const raw = await corsair.moz.api.metrics.fetch({
			site_query: { query: 'moz.com', scope: 'domain' },
		});
		const result = Outputs.metricsFetch.parse(raw);
		expect(typeof result.site_metrics.domain_authority).toBe('number');
	});
});
