import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { googledrive } from './index';

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
	await createIntegrationAndAccount(testDb.db, 'googledrive');

	const corsair = createCorsair({
		plugins: [
			googledrive({
				authType: 'oauth_2',
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.keys.googledrive.issue_new_dek();
	await corsair.keys.googledrive.set_client_id(clientId);
	await corsair.keys.googledrive.set_client_secret(clientSecret);

	await corsair.googledrive.keys.issue_new_dek();
	await corsair.googledrive.keys.set_access_token(accessToken);
	await corsair.googledrive.keys.set_refresh_token(refreshToken);

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

		const listEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googledrive.files.list')
			.execute();

		expect(listEvents.length).toBeGreaterThan(0);

		const createResponse = await corsair.googledrive.api.files.createFromText({
			name: `test-file-${Date.now()}.txt`,
			content: 'Test file content',
		});

		expect(createResponse).toBeDefined();
		expect(createResponse.id).toBeDefined();

		const createEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googledrive.files.createFromText')
			.execute();

		expect(createEvents.length).toBeGreaterThan(0);

		if (createResponse.id) {
			const fileId = createResponse.id;

			const getResponse = await corsair.googledrive.api.files.get({
				fileId,
			});

			expect(getResponse).toBeDefined();

			const getEvents = await testDb.db
				.selectFrom('corsair_events')
				.where('event_type', '=', 'googledrive.files.get')
				.execute();

			expect(getEvents.length).toBeGreaterThan(0);

			await corsair.googledrive.api.files.delete({
				fileId,
			});

			const deleteEvents = await testDb.db
				.selectFrom('corsair_events')
				.where('event_type', '=', 'googledrive.files.delete')
				.execute();

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

		const createEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googledrive.folders.create')
			.execute();

		expect(createEvents.length).toBeGreaterThan(0);

		if (createResponse.id) {
			const folderId = createResponse.id;

			const getResponse = await corsair.googledrive.api.folders.get({
				folderId,
			});

			expect(getResponse).toBeDefined();

			const getEvents = await testDb.db
				.selectFrom('corsair_events')
				.where('event_type', '=', 'googledrive.folders.get')
				.execute();

			expect(getEvents.length).toBeGreaterThan(0);

			await corsair.googledrive.api.folders.delete({
				folderId,
			});

			const deleteEvents = await testDb.db
				.selectFrom('corsair_events')
				.where('event_type', '=', 'googledrive.folders.delete')
				.execute();

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

		const searchResponse = await corsair.googledrive.api.search.filesAndFolders(
			{
				q: "mimeType='text/plain'",
				pageSize: 5,
			},
		);

		expect(searchResponse).toBeDefined();

		const searchEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googledrive.search.filesAndFolders')
			.execute();

		expect(searchEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
