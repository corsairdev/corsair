import { createCorsair } from '../../core';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { googledrive } from './index';
import dotenv from 'dotenv';
dotenv.config();

async function createGoogleDriveClient() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'googledrive');

	const corsair = createCorsair({
		plugins: [
			googledrive({
				authType: 'oauth_2',
			}),
		],
		database: testDb.adapter,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.keys.googledrive.issueNewDEK();
	await corsair.keys.googledrive.setClientId(clientId);
	await corsair.keys.googledrive.setClientSecret(clientSecret);

	await corsair.googledrive.keys.issueNewDEK();
	await corsair.googledrive.keys.setAccessToken(accessToken);
	await corsair.googledrive.keys.setRefreshToken(refreshToken);

	return { corsair, testDb };
}

describe('Google Drive plugin integration', () => {
	it('files endpoints interact with API and DB', async () => {
		const setup = await createGoogleDriveClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const listResponse = await corsair.googledrive.api.files.list({
			pageSize: 5,
		});

		expect(listResponse).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'googledrive.files.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const createResponse = await corsair.googledrive.api.files.createFromText({
			name: `test-file-${Date.now()}.txt`,
			content: 'Test file content',
		});

		expect(createResponse).toBeDefined();
		expect(createResponse.id).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'googledrive.files.createFromText' },
			],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		if (createResponse.id) {
			const fileId = createResponse.id;

			const getResponse = await corsair.googledrive.api.files.get({
				fileId,
			});

			expect(getResponse).toBeDefined();

			const getEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'googledrive.files.get' }],
			});

			expect(getEvents.length).toBeGreaterThan(0);

			await corsair.googledrive.api.files.delete({
				fileId,
			});

			const deleteEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'googledrive.files.delete' }],
			});

			expect(deleteEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('folders endpoints reach API', async () => {
		const setup = await createGoogleDriveClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const createResponse = await corsair.googledrive.api.folders.create({
			name: `test-folder-${Date.now()}`,
		});

		expect(createResponse).toBeDefined();
		expect(createResponse.id).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'googledrive.folders.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		if (createResponse.id) {
			const folderId = createResponse.id;

			const getResponse = await corsair.googledrive.api.folders.get({
				folderId,
			});

			expect(getResponse).toBeDefined();

			const getEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'googledrive.folders.get' }],
			});

			expect(getEvents.length).toBeGreaterThan(0);

			await corsair.googledrive.api.folders.delete({
				folderId,
			});

			const deleteEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'googledrive.folders.delete' }],
			});

			expect(deleteEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('search endpoints reach API', async () => {
		const setup = await createGoogleDriveClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const searchResponse = await corsair.googledrive.api.search.filesAndFolders({
			q: "mimeType='text/plain'",
			pageSize: 5,
		});

		expect(searchResponse).toBeDefined();

		const searchEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [
				{ field: 'event_type', value: 'googledrive.search.filesAndFolders' },
			],
		});

		expect(searchEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
