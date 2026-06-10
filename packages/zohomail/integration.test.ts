import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { ZohoRegion } from './client';
import { zohomail } from './index';

async function createZohoMailClient() {
	const clientId = process.env.ZOHO_CLIENT_ID;
	const clientSecret = process.env.ZOHO_CLIENT_SECRET;
	const accessToken = process.env.ZOHO_ACCESS_TOKEN;
	const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		return null;
	}

	const region = (process.env.ZOHO_REGION as ZohoRegion | undefined) ?? 'us';

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zohomail');

	const corsair = createCorsair({
		plugins: [
			zohomail({
				authType: 'oauth_2',
				region,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.keys.zohomail.issue_new_dek();
	await corsair.keys.zohomail.set_client_id(clientId);
	await corsair.keys.zohomail.set_client_secret(clientSecret);

	await corsair.zohomail.keys.issue_new_dek();
	await corsair.zohomail.keys.set_access_token(accessToken);
	await corsair.zohomail.keys.set_refresh_token(refreshToken);

	return { corsair, testDb };
}

describe('Zoho Mail plugin integration', () => {
	it('folders + messages endpoints interact with API and DB', async () => {
		const setup = await createZohoMailClient();
		if (!setup) {
			// No live Zoho credentials configured — skip without failing.
			return;
		}

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		// folders.list also exercises automatic accountId resolution.
		const folders = await corsair.zohomail.api.folders.list({});
		expect(folders).toBeDefined();

		const listFolderEvents = await orm.events.findMany({
			where: { event_type: 'zohomail.folders.list' },
		});
		expect(listFolderEvents.length).toBeGreaterThan(0);

		const folderId =
			process.env.ZOHO_FOLDER_ID ?? folders.folders?.[0]?.folderId;

		if (folderId) {
			const list = await corsair.zohomail.api.messages.list({
				folderId,
				limit: 5,
			});
			expect(list).toBeDefined();

			const listEvents = await orm.events.findMany({
				where: { event_type: 'zohomail.messages.list' },
			});
			expect(listEvents.length).toBeGreaterThan(0);

			const messages = list.messages || [];
			const messageId = messages[0]?.messageId;

			if (messageId) {
				const got = await corsair.zohomail.api.messages.get({
					folderId,
					messageId,
				});
				expect(got).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'zohomail.messages.get' },
				});
				expect(getEvents.length).toBeGreaterThan(0);
			}
		}

		testDb.cleanup();
	});

	it('creates, renames, and deletes a folder', async () => {
		const setup = await createZohoMailClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const created = await corsair.zohomail.api.folders.create({
			folderName: `corsair-test-${Date.now()}`,
		});
		expect(created).toBeDefined();

		const folderId = created.folderId;
		if (folderId) {
			await corsair.zohomail.api.folders.update({
				folderId,
				mode: 'rename',
				folderName: `corsair-test-renamed-${Date.now()}`,
			});

			await corsair.zohomail.api.folders.delete({ folderId });
		}

		testDb.cleanup();
	});
});
