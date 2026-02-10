import { createCorsair } from '../../core';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { googlesheets } from './index';
import dotenv from 'dotenv';
dotenv.config();	

async function createGoogleSheetsClient() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'googlesheets');

	const corsair = createCorsair({
		plugins: [
			googlesheets({
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
	
	await corsair.keys.googlesheets.issueNewDEK();
	await corsair.keys.googlesheets.setClientId(clientId);
	await corsair.keys.googlesheets.setClientSecret(clientSecret);

	await corsair.googlesheets.keys.issueNewDEK();
	await corsair.googlesheets.keys.setAccessToken(accessToken);
	await corsair.googlesheets.keys.setRefreshToken(refreshToken);

	return { corsair, testDb };
}

describe('Google Sheets plugin integration', () => {
	it('spreadsheets endpoints interact with API and DB', async () => {
		const setup = await createGoogleSheetsClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const createResponse = await corsair.googlesheets.api.spreadsheets.create({
			properties: {
				title: `Test Spreadsheet ${Date.now()}`,
			},
		});

		expect(createResponse).toBeDefined();
		expect(createResponse.spreadsheetId).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'googlesheets.spreadsheets.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		if (createResponse.spreadsheetId) {
			const spreadsheetId = createResponse.spreadsheetId;

			await corsair.googlesheets.api.spreadsheets.delete({
				spreadsheetId,
			});

			const deleteEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [
					{ field: 'event_type', value: 'googlesheets.spreadsheets.delete' },
				],
			});

			expect(deleteEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('sheets endpoints reach API', async () => {
		const setup = await createGoogleSheetsClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const createResponse = await corsair.googlesheets.api.spreadsheets.create({
			properties: {
				title: `Test Spreadsheet ${Date.now()}`,
			},
		});

		if (!createResponse.spreadsheetId) {
			testDb.cleanup();
			return;
		}

		const spreadsheetId = createResponse.spreadsheetId;

		const appendResponse = await corsair.googlesheets.api.sheets.appendRow({
			spreadsheetId,
			values: ['Test', 'Row', Date.now().toString()],
		});

		expect(appendResponse).toBeDefined();

		const appendEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'googlesheets.sheets.appendRow' }],
		});

		expect(appendEvents.length).toBeGreaterThan(0);

		const getRowsResponse = await corsair.googlesheets.api.sheets.getRows({
			spreadsheetId,
		});

		expect(getRowsResponse).toBeDefined();

		const getRowsEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'googlesheets.sheets.getRows' }],
		});

		expect(getRowsEvents.length).toBeGreaterThan(0);

		await corsair.googlesheets.api.spreadsheets.delete({
			spreadsheetId,
		});

		testDb.cleanup();
	});
});
