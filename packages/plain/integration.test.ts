import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { plain } from './index';

async function createPlainClient() {
	const apiKey = process.env.PLAIN_API_KEY;
	if (!apiKey) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'plain', 'default');

	const corsair = createCorsair({
		plugins: [plain({})],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.plain.keys.issue_new_dek();
	await corsair.plain.keys.set_api_key(apiKey);

	return { corsair, testDb };
}

describe('Plain plugin integration', () => {
	it('runs typed operations against a live key when configured', async () => {
		const setup = await createPlainClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		const users = await corsair.plain.api.graphql.run({
			query:
				'query GetUsers($first: Int) { users(first: $first) { edges { node { id fullName email } } } }',
			variables: { first: 1 },
			operationName: 'GetUsers',
		});

		expect(users.data).toBeDefined();

		const tiers = await corsair.plain.api.tiers.list({ first: 5 });
		expect(Array.isArray(tiers.tiers)).toBe(true);

		const customerGroups = await corsair.plain.api.customerGroups.list({
			first: 5,
		});
		expect(Array.isArray(customerGroups.customerGroups)).toBe(true);

		const threads = await corsair.plain.api.threads.query({ first: 5 });
		expect(Array.isArray(threads.threads)).toBe(true);

		const events = await orm.events.findMany({
			where: { event_type: 'plain.threads.query' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
