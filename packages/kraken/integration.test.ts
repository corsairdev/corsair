import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { kraken } from './index';

// Live end-to-end test — skipped unless both KRAKEN_API_KEY and
// KRAKEN_API_SECRET are set. Exercises the plugin exactly as a consuming
// app would: through createCorsair(), not by calling endpoint functions
// directly.
async function createKrakenClient() {
	const apiKey = process.env.KRAKEN_API_KEY;
	const apiSecret = process.env.KRAKEN_API_SECRET;
	if (!apiKey || !apiSecret) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'kraken');

	const corsair = createCorsair({
		plugins: [kraken({ authType: 'api_key', key: apiKey, apiSecret })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

const TEST_IMAGE_URL =
	'https://raw.githubusercontent.com/kraken-io/kraken-php/master/tests/fixtures/tapir.png';

describe('Kraken plugin integration', () => {
	it('account.checkStatus reports quota through the bound plugin API', async () => {
		const setup = await createKrakenClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		try {
			const status = await corsair.kraken.api.account.checkStatus(undefined);
			expect(status.success).toBe(true);
			expect(typeof status.quota_remaining).toBe('number');
		} finally {
			testDb.cleanup();
		}
	});

	it('image.sandboxUpload optimizes without consuming quota', async () => {
		const setup = await createKrakenClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		try {
			const before = await corsair.kraken.api.account.checkStatus(undefined);

			const result = await corsair.kraken.api.image.sandboxUpload({
				url: TEST_IMAGE_URL,
				wait: true,
			});

			expect(result.success).toBe(true);

			const after = await corsair.kraken.api.account.checkStatus(undefined);
			expect(after.quota_remaining).toBe(before.quota_remaining);
		} finally {
			testDb.cleanup();
		}
	});
});
