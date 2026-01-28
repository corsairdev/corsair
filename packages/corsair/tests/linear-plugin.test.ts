import { createCorsair } from '../core';
import { linear } from '../plugins/linear';
import { createTestDatabase } from './setup-db';
import { createIntegrationAndAccount } from './plugins-test-utils';

async function createLinearClient() {
	const apiKey = process.env.LINEAR_API_KEY;
	if (!apiKey) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'linear');

	const corsair = createCorsair({
		plugins: [
			linear({
				authType: 'api_key' as any,
				credentials: {
					apiKey,
				} as any,
			}),
		],
		database: testDb.adapter,
	});

	return { corsair, testDb };
}

describe('Linear plugin integration', () => {
	it('issues endpoints interact with API and DB', async () => {
		const setup = await createLinearClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const list = await corsair.linear.api.issues.list({
			first: 10,
		});

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.issues.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('teams endpoints interact with API', async () => {
		const setup = await createLinearClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const teams = await corsair.linear.api.teams.list({
			first: 10,
		});

		expect(teams).toBeDefined();

		testDb.cleanup();
	});
});

