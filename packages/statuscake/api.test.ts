import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { statuscake } from './index';

// Read-only live smoke. Runs only with STATUSCAKE_API_TOKEN set (the
// variable the StatusCake docs and SDKs use); everything else skips. No
// writes: creates and updates would change real monitoring.
const describeIfToken = process.env.STATUSCAKE_API_TOKEN
	? describe
	: describe.skip;

describeIfToken('statuscake live API', () => {
	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'statuscake', 'default');
		const corsair = createCorsair({
			plugins: [statuscake({ key: process.env.STATUSCAKE_API_TOKEN })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	// Every read goes through its output schema before any assertion, so a
	// field typed differently from the live answer fails here and not in a
	// caller's code.
	it('lists uptime checks through the output schema', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.statuscake.api.uptime.list({ page: 1 });
			expect(result.metadata.page).toBe(1);
			expect(Array.isArray(result.data)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists SSL checks through the output schema', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.statuscake.api.ssl.list({ page: 1 });
			expect(Array.isArray(result.data)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists uptime locations through the output schema', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.statuscake.api.locations.uptime({});
			expect(Array.isArray(result.data)).toBe(true);
			for (const location of result.data) {
				expect(typeof location.region_code).toBe('string');
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('lists contact groups through the output schema', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.statuscake.api.contactGroups.list({
				page: 1,
			});
			expect(Array.isArray(result.data)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});
});
