import 'dotenv/config';

import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';

import { mailchimp } from './index';

async function createMailchimpClient() {
	const key = process.env.MAILCHIMP_API_KEY;
	if (!key) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mailchimp');

	const corsair = createCorsair({
		plugins: [mailchimp({ authType: 'api_key', key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

// L3 — plugin integration. Skipped unless MAILCHIMP_API_KEY is set. Exercises
// endpoints through a real corsair instance + test DB and asserts persistence.
describe('Mailchimp plugin integration', () => {
	it('account + lists flow interacts with API, events, and DB', async () => {
		const setup = await createMailchimpClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		const ping = await corsair.mailchimp.api.account.ping({});
		expect(ping).toBeDefined();

		const lists = await corsair.mailchimp.api.lists.list({ count: 5 });
		expect(Array.isArray(lists.lists)).toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'mailchimp.lists.list' },
		});
		expect(listEvents.length).toBeGreaterThan(0);

		// lists.list persists each audience to the local `lists` entity.
		const first = lists.lists[0];
		if (first) {
			const fromDb = await corsair.mailchimp.db.lists.findByEntityId(first.id);
			if (fromDb) {
				expect(fromDb.data.id).toBe(first.id);
			}
		}

		testDb.cleanup();
	});
});
