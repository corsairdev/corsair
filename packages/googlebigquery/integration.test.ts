import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googlebigquery } from './index';

async function createGoogleBigqueryClient() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
	const projectId = process.env.GOOGLE_BIGQUERY_TEST_PROJECT_ID;
	if (
		!clientId ||
		!clientSecret ||
		!accessToken ||
		!refreshToken ||
		!projectId
	) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'googlebigquery');

	const corsair = createCorsair({
		plugins: [
			googlebigquery({
				authType: 'oauth_2',
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.keys.googlebigquery.issue_new_dek();
	await corsair.keys.googlebigquery.set_client_id(clientId);
	await corsair.keys.googlebigquery.set_client_secret(clientSecret);

	await corsair.googlebigquery.keys.issue_new_dek();
	await corsair.googlebigquery.keys.set_access_token(accessToken);
	await corsair.googlebigquery.keys.set_refresh_token(refreshToken);

	return { corsair, testDb, projectId };
}

describe('Google BigQuery plugin integration', () => {
	it('datasets endpoints interact with API and DB', async () => {
		const setup = await createGoogleBigqueryClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;
		const datasetId = `corsair_test_${Date.now()}`;

		const createResponse = await corsair.googlebigquery.api.datasets.create({
			projectId,
			datasetReference: { projectId, datasetId },
		});

		expect(createResponse).toBeDefined();
		expect(createResponse.datasetReference.datasetId).toBe(datasetId);

		const createEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googlebigquery.datasets.create')
			.execute();
		expect(createEvents.length).toBeGreaterThan(0);

		const getResponse = await corsair.googlebigquery.api.datasets.get({
			projectId,
			datasetId,
		});
		expect(getResponse.datasetReference.datasetId).toBe(datasetId);

		await corsair.googlebigquery.api.datasets.delete({
			projectId,
			datasetId,
			deleteContents: true,
		});

		const deleteEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googlebigquery.datasets.delete')
			.execute();
		expect(deleteEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('queries.query reaches the API', async () => {
		const setup = await createGoogleBigqueryClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, projectId } = setup;

		const response = await corsair.googlebigquery.api.queries.query({
			projectId,
			query: 'SELECT 1 AS value',
			useLegacySql: false,
			dryRun: true,
		});

		expect(response).toBeDefined();

		const queryEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googlebigquery.queries.query')
			.execute();
		expect(queryEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
