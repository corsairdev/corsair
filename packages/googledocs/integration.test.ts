import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googledocs } from './index';

async function createGoogleDocsClient() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'googledocs');

	const corsair = createCorsair({
		plugins: [googledocs({ authType: 'oauth_2' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.keys.googledocs.issue_new_dek();
	await corsair.keys.googledocs.set_client_id(clientId);
	await corsair.keys.googledocs.set_client_secret(clientSecret);

	await corsair.googledocs.keys.issue_new_dek();
	await corsair.googledocs.keys.set_access_token(accessToken);
	await corsair.googledocs.keys.set_refresh_token(refreshToken);

	return { corsair, testDb };
}

describe('Google Docs plugin integration', () => {
	it('documents endpoints interact with API and DB', async () => {
		const setup = await createGoogleDocsClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const searchResponse =
			await corsair.googledocs.api.documents.searchDocuments({ pageSize: 5 });

		expect(searchResponse).toBeDefined();

		const searchEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googledocs.documents.searchDocuments')
			.execute();

		expect(searchEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
