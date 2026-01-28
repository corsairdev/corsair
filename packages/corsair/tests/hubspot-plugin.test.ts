import { createCorsair } from '../core';
import { hubspot } from '../plugins/hubspot';
import { createTestDatabase } from './setup-db';
import { createIntegrationAndAccount } from './plugins-test-utils';

async function createHubspotClient() {
	const token = process.env.HUBSPOT_ACCESS_TOKEN;
	const contactId = process.env.TEST_HUBSPOT_CONTACT_ID;
	const companyId = process.env.TEST_HUBSPOT_COMPANY_ID;
	const dealId = process.env.TEST_HUBSPOT_DEAL_ID;
	const ticketId = process.env.TEST_HUBSPOT_TICKET_ID;
	if (!token) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'hubspot');

	const corsair = createCorsair({
		plugins: [
			hubspot({
				authType: 'oauth_2' as any,
				credentials: {
					token,
				} as any,
			}),
		],
		database: testDb.adapter,
	});

	return { corsair, testDb, contactId, companyId, dealId, ticketId };
}

describe('HubSpot plugin integration', () => {
	it('contacts endpoints interact with API and DB when contactId is available', async () => {
		const setup = await createHubspotClient();
		if (!setup || !setup.contactId) {
			return;
		}

		const { corsair, testDb, contactId } = setup;

		const contact = await corsair.hubspot.api.contacts.get({
			contactId,
		} as any);

		expect(contact).toBeDefined();

		const getEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.contacts.get' }],
		});

		expect(getEvents.length).toBeGreaterThan(0);

		const many = await corsair.hubspot.api.contacts.getMany({
			limit: 5,
		} as any);

		expect(many).toBeDefined();

		const manyEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'hubspot.contacts.getMany' }],
		});

		expect(manyEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});

