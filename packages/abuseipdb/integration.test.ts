import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { abuseipdb } from './index';

async function createAbuseIPDBClient(options: Parameters<typeof abuseipdb>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'abuseipdb', 'default');

	const corsair = createCorsair({
		plugins: [abuseipdb(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});

	return { corsair, testDb };
}

describe('AbuseIPDB plugin integration', () => {
	it('fails fast with AuthMissingError when no key is configured anywhere', async () => {
		const { corsair, testDb } = await createAbuseIPDBClient({});

		try {
			await expect(
				corsair.abuseipdb.api.check.ip({ ipAddress: '118.25.6.39' }),
			).rejects.toThrow(/auth-missing/);
		} finally {
			testDb.cleanup();
		}
	});

	it('exposes the full nested endpoint tree', async () => {
		const { corsair, testDb } = await createAbuseIPDBClient({
			key: 'test-key',
		});

		try {
			const api = corsair.abuseipdb.api;
			// check.ip / reports.list / blacklist.get / report.ip /
			// block.check / address.clear
			expect(api.check.ip).toBeDefined();
			expect(api.reports.list).toBeDefined();
			expect(api.blacklist.get).toBeDefined();
			expect(api.report.ip).toBeDefined();
			expect(api.block.check).toBeDefined();
			expect(api.address.clear).toBeDefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('loads the plugin factory with the correct id and auth type', () => {
		const plugin = abuseipdb({});
		expect(plugin.id).toBe('abuseipdb');
		expect(plugin.authConfig).toHaveProperty('api_key');
		// Pull-based API — no webhooks.
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});
});
