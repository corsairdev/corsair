import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mopinion } from './index';

/**
 * Live smoke against read-only operations. Skipped unless a Mopinion public
 * key and signature token are provided. Nothing here writes; the v3 data API
 * is read-only anyway.
 *
 *   MOPINION_PUBLIC_KEY=... MOPINION_SIGNATURE_TOKEN=... pnpm test:live
 */
const publicKey = process.env.MOPINION_PUBLIC_KEY;
const signatureToken = process.env.MOPINION_SIGNATURE_TOKEN;
const describeIfKey = publicKey && signatureToken ? describe : describe.skip;

if (!publicKey || !signatureToken) {
	const missing = [
		!publicKey && 'MOPINION_PUBLIC_KEY',
		!signatureToken && 'MOPINION_SIGNATURE_TOKEN',
	]
		.filter(Boolean)
		.join(', ');
	console.warn(`Skipping Mopinion live tests: set ${missing}.`);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mopinion', 'default');
	const corsair = createCorsair({
		plugins: [mopinion({ publicKey, signatureToken })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('mopinion live', () => {
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
		const result = await corsair.mopinion.api.account.get({});
		expect(result._meta?.code).toBe(200);
	});

	it('parses the deployments through their output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mopinion.api.deployments.list({});
		expect(Array.isArray(result.data ?? [])).toBe(true);
	});
});
