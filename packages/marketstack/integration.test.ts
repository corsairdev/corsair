import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { marketstack } from './index';

const ACCESS_KEY = process.env.MARKETSTACK_API_KEY;
const describeIfKey = ACCESS_KEY ? describe : describe.skip;

async function createMarketstackClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'marketstack', 'default');

	const corsair = createCorsair({
		plugins: [marketstack({ key: ACCESS_KEY })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});

	return { corsair, testDb };
}

describeIfKey('Marketstack plugin integration', () => {
	it('eod.get calls the API and logs the event', async () => {
		const { corsair, testDb } = await createMarketstackClient();

		try {
			const result = await corsair.marketstack.api.eod.get({
				symbols: ['AAPL'],
				limit: 1,
			});

			expect(result.data.length).toBeGreaterThan(0);
			expect(result.data[0]?.symbol).toBe('AAPL');

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'marketstack.eod.get' },
			});
			expect(events.length).toBeGreaterThan(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('works with a key from plugin options and no database at all', async () => {
		const corsair = createCorsair({
			plugins: [marketstack({ key: ACCESS_KEY })],
			kek: '0123456789abcdef0123456789abcdef',
		});

		const result = await corsair.marketstack.api.currencies.list({});

		expect(result.data.length).toBeGreaterThan(0);
	});
});

describe('Marketstack plugin auth', () => {
	it('surfaces an auth error from the keyBuilder when no key is configured anywhere', async () => {
		const testDb = createTestDatabase();

		try {
			await createIntegrationAndAccount(testDb.db, 'marketstack', 'default');

			const corsair = createCorsair({
				plugins: [marketstack({})],
				database: testDb.db,
				kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
			});

			await expect(
				corsair.marketstack.api.eod.get({ symbols: ['AAPL'] }),
			).rejects.toThrow(/auth-missing/);
		} finally {
			testDb.cleanup();
		}
	});
});
