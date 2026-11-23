import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moco } from './index';

/**
 * Live smoke against read-only operations. Skipped unless a Moco API key and
 * the account subdomain are provided. Nothing here writes.
 *
 *   MOCO_API_KEY=... MOCO_SUBDOMAIN=... pnpm test:live
 */
const apiKey = process.env.MOCO_API_KEY;
const subdomain = process.env.MOCO_SUBDOMAIN;
const describeIfKey = apiKey && subdomain ? describe : describe.skip;

if (!apiKey || !subdomain) {
	const missing = [!apiKey && 'MOCO_API_KEY', !subdomain && 'MOCO_SUBDOMAIN']
		.filter(Boolean)
		.join(', ');
	console.warn(`Skipping Moco live tests: set ${missing}.`);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moco', 'default');
	const corsair = createCorsair({
		plugins: [moco({ key: apiKey, subdomain })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('moco live', () => {
	jest.setTimeout(30_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('verifies the key through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moco.api.session.verify({});
		expect(typeof result.id).toBe('number');
		expect(typeof result.uuid).toBe('string');
	});

	it('parses the profile through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moco.api.profile.get({});
		expect(typeof result.id === 'number' || result.id === null).toBe(true);
	});

	it('parses the first user page through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.moco.api.users.list({});
		expect(Array.isArray(result.items)).toBe(true);
		expect(
			result.next_page === null || typeof result.next_page === 'number',
		).toBe(true);
	});
});
