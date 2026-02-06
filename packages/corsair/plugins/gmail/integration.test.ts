import { createCorsair } from '../../core';
import { gmail } from './index';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';

async function createGmailClient() {
	const clientId = process.env.GMAIL_CLIENT_ID;
	const clientSecret = process.env.GMAIL_CLIENT_SECRET;
	const accessToken = process.env.GMAIL_ACCESS_TOKEN;
	const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'gmail');

	const corsair = createCorsair({
		plugins: [
			gmail({
				authType: 'oauth_2',
				credentials: {
					clientId,
					clientSecret,
					accessToken,
					refreshToken,
				},
			}),
		],
		database: testDb.adapter,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('Gmail plugin integration', () => {
	it('messages endpoints interact with API and DB', async () => {
		const setup = await createGmailClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const list = await corsair.gmail.api.messages.list({
			userId: 'me',
			maxResults: 5,
		});

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'gmail.messages.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const messages = list.messages || [];

		if (messages.length > 0 && messages[0]?.id) {
			const id = messages[0].id;

			const got = await corsair.gmail.api.messages.get({
				userId: 'me',
				id,
				format: 'full',
			});

			expect(got).toBeDefined();

			const getEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'gmail.messages.get' }],
			});

			expect(getEvents.length).toBeGreaterThan(0);

			await corsair.gmail.api.messages.modify({
				userId: 'me',
				id,
				addLabelIds: [],
				removeLabelIds: [],
			});

			const modifyEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'gmail.messages.modify' }],
			});

			expect(modifyEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('labels endpoints reach API', async () => {
		const setup = await createGmailClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const labels = await corsair.gmail.api.labels.list({
			userId: 'me',
		});

		expect(labels).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'gmail.labels.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const firstLabel = labels.labels?.[0];

		if (firstLabel?.id) {
			const label = await corsair.gmail.api.labels.get({
				userId: 'me',
				id: firstLabel.id,
			});

			expect(label).toBeDefined();

			const getEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'gmail.labels.get' }],
			});

			expect(getEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});
});
