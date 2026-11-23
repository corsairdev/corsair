import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mocean } from './index';

/**
 * Live smoke against the read-only operations. Skipped unless a Mocean API
 * token is provided via MOCEAN_API_KEY. Nothing here writes: sms.send,
 * verify.request and number lookups all charge the account.
 */
const apiKey = process.env.MOCEAN_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'Skipping Mocean live tests: set MOCEAN_API_KEY (dashboard, API settings).',
	);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mocean', 'default');
	const corsair = createCorsair({
		plugins: [mocean({ key: apiKey })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('mocean live', () => {
	jest.setTimeout(30_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('parses the account balance through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mocean.api.account.balance({});
		expect(typeof result.value).toBe('number');
		expect(result.status).toBe(0);
	});

	it('parses the pricing list through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mocean.api.account.pricing({});
		expect(Array.isArray(result.destinations)).toBe(true);
		for (const destination of result.destinations) {
			// Mocean documents price as a string, e.g. "0.0100".
			expect(
				typeof destination.price === 'string' || destination.price === null,
			).toBe(true);
		}
	});
});
