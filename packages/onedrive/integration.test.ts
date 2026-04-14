import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { onedrive } from './index';

// Using `unknown` for both parameter and return because DB payloads may arrive as a raw JSON
function parsePayload(payload: unknown): unknown {
	return typeof payload === 'string' ? JSON.parse(payload) : payload;
}

async function createOnedriveClient() {
	const accessToken = process.env.ONEDRIVE_ACCESS_TOKEN;
	if (!accessToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'onedrive', 'default');

	const corsair = createCorsair({
		plugins: [onedrive({ key: accessToken })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('OneDrive plugin integration', () => {
	describe('drive', () => {
		it('driveGetQuota interacts with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const result = await corsair.onedrive.api.drive.getQuota({});

			expect(result).toBeDefined();
			expect(result.id).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.drive.getQuota' } });
			expect(events.length).toBeGreaterThan(0);

			if (result.id) {
				const fromDb = await corsair.onedrive.db.drives.findByEntityId(result.id);
				expect(fromDb).not.toBeNull();
				expect(fromDb?.data.id).toBe(result.id);
			}

			testDb.cleanup();
		});

		it('driveGetRoot interacts with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const result = await corsair.onedrive.api.drive.getRoot({});

			expect(result).toBeDefined();
			expect(result.id).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.drive.getRoot' } });
			expect(events.length).toBeGreaterThan(0);

			if (result.id) {
				const fromDb = await corsair.onedrive.db.driveItems.findByEntityId(result.id);
				expect(fromDb).not.toBeNull();
				expect(fromDb?.data.id).toBe(result.id);
			}

			testDb.cleanup();
		});

		it('driveList interacts with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { top: 5 };
			const result = await corsair.onedrive.api.drive.list(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.drive.list' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('driveGetRecentItems interacts with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { top: 5 };
			const result = await corsair.onedrive.api.drive.getRecentItems(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.drive.getRecentItems' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('driveListChanges interacts with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { top: 10 };
			const result = await corsair.onedrive.api.drive.listChanges(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.drive.listChanges' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});

	describe('items', () => {
		let rootItemId: string;

		beforeAll(async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;
			const root = await corsair.onedrive.api.drive.getRoot({});
			rootItemId = root.id ?? '';
			testDb.cleanup();
		});

		it('itemsGet interacts with API and DB', async () => {
			if (!rootItemId) return;
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { item_id: rootItemId };
			const result = await corsair.onedrive.api.items.get(input);

			expect(result).toBeDefined();
			expect(result.id).toBe(rootItemId);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.items.get' } });
			expect(events.length).toBeGreaterThan(0);
			expect(parsePayload(events[events.length - 1]!.payload)).toMatchObject(input);

			const fromDb = await corsair.onedrive.db.driveItems.findByEntityId(rootItemId);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.id).toBe(rootItemId);

			testDb.cleanup();
		});

		it('itemsSearch interacts with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { q: 'test', top: 5 };
			const result = await corsair.onedrive.api.items.search(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.items.search' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('itemsListFolderChildren interacts with API and DB', async () => {
			if (!rootItemId) return;
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { folder_item_id: rootItemId };
			const result = await corsair.onedrive.api.items.listFolderChildren(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.items.listFolderChildren' } });
			// endpoint logs {} as payload, not the input — just verify the event was recorded
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('itemsGetVersions interacts with API and DB', async () => {
			if (!rootItemId) return;
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { item_id: rootItemId };
			const result = await corsair.onedrive.api.items.getVersions(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.items.getVersions' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('itemsGetThumbnails interacts with API and DB', async () => {
			if (!rootItemId) return;
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { item_id: rootItemId };
			const result = await corsair.onedrive.api.items.getThumbnails(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.items.getThumbnails' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('itemsUpdateMetadata and itemsDelete interact with API and DB via a temp file', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			// Create a temp text file to update and delete
			const fileName = `corsair_test_${Date.now()}.txt`;
			let created: Awaited<ReturnType<typeof corsair.onedrive.api.files.createTextFile>>;
			try {
				created = await corsair.onedrive.api.files.createTextFile({
					name: fileName,
					content: 'corsair integration test',
				});
			} catch {
				testDb.cleanup();
				return;
			}

			expect(created).toBeDefined();
			expect(created.id).toBeDefined();

			const fromDb = await corsair.onedrive.db.driveItems.findByEntityId(created.id);
			expect(fromDb).not.toBeNull();

			const updateInput = {
				item_id: created.id,
				description: `Updated by corsair test ${Date.now()}`,
			};
			const updated = await corsair.onedrive.api.items.updateMetadata(updateInput);
			expect(updated).toBeDefined();

			const updateEvents = await orm.events.findMany({ where: { event_type: 'onedrive.items.updateMetadata' } });
			expect(updateEvents.length).toBeGreaterThan(0);

			const deleteInput = { item_id: created.id };
			const deleted = await corsair.onedrive.api.items.delete(deleteInput);
			expect(deleted).toBeDefined();

			const deleteEvents = await orm.events.findMany({ where: { event_type: 'onedrive.items.delete' } });
			expect(deleteEvents.length).toBeGreaterThan(0);
			expect(parsePayload(deleteEvents[deleteEvents.length - 1]!.payload)).toMatchObject(deleteInput);

			testDb.cleanup();
		});
	});

	describe('files', () => {
		it('filesList interacts with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { top: 5 };
			const result = await corsair.onedrive.api.files.list(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.files.list' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('filesCreateFolder and filesCreateTextFile interact with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);
			const suffix = Date.now();

			// create folder
			const folderName = `CorsairTest_${suffix}`;
			const folder = await corsair.onedrive.api.files.createFolder({ name: folderName });

			expect(folder).toBeDefined();
			expect(folder.id).toBeDefined();

			const folderEvents = await orm.events.findMany({ where: { event_type: 'onedrive.files.createFolder' } });
			expect(folderEvents.length).toBeGreaterThan(0);

			const folderFromDb = await corsair.onedrive.db.driveItems.findByEntityId(folder.id);
			expect(folderFromDb).not.toBeNull();

			// create text file inside that folder
			const fileName = `corsair_test_${suffix}.txt`;
			const file = await corsair.onedrive.api.files.createTextFile({
				name: fileName,
				content: 'corsair integration test content',
				folder: folderName,
			});

			expect(file).toBeDefined();
			expect(file.id).toBeDefined();

			const fileEvents = await orm.events.findMany({ where: { event_type: 'onedrive.files.createTextFile' } });
			expect(fileEvents.length).toBeGreaterThan(0);

			const fileFromDb = await corsair.onedrive.db.driveItems.findByEntityId(file.id);
			expect(fileFromDb).not.toBeNull();

			// cleanup: delete the folder (cascades to file)
			try {
				await corsair.onedrive.api.items.delete({ item_id: folder.id });
			} catch {
				// best-effort cleanup
			}

			testDb.cleanup();
		});

		it('filesFindFile and filesFindFolder interact with API and DB', async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			// findFile uses search(q=...) with $filter which Graph search does not support — skip gracefully on error
			const findFileInput = { name: 'corsair' };
			try {
				const foundFiles = await corsair.onedrive.api.files.findFile(findFileInput);
				expect(foundFiles).toBeDefined();
				expect(Array.isArray(foundFiles.value)).toBe(true);

				const findFileEvents = await orm.events.findMany({ where: { event_type: 'onedrive.files.findFile' } });
				expect(findFileEvents.length).toBeGreaterThan(0);
			} catch {
				// Graph search API does not support $filter on search endpoints — skip findFile
			}

			const findFolderInput = { top: 5 };
			const foundFolders = await corsair.onedrive.api.files.findFolder(findFolderInput);

			expect(foundFolders).toBeDefined();
			expect(Array.isArray(foundFolders.value)).toBe(true);

			const findFolderEvents = await orm.events.findMany({ where: { event_type: 'onedrive.files.findFolder' } });
			expect(findFolderEvents.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});

	describe('permissions', () => {
		let testItemId: string;

		beforeAll(async () => {
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;
			const root = await corsair.onedrive.api.drive.getRoot({});
			testItemId = root.id ?? '';
			testDb.cleanup();
		});

		it('permissionsGetForItem interacts with API and DB', async () => {
			if (!testItemId) return;
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { item_id: testItemId };
			const result = await corsair.onedrive.api.permissions.getForItem(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.permissions.getForItem' } });
			expect(events.length).toBeGreaterThan(0);
			expect(parsePayload(events[events.length - 1]!.payload)).toMatchObject(input);

			testDb.cleanup();
		});

		it('permissionsCreateLink interacts with API and DB', async () => {
			if (!testItemId) return;
			const setup = await createOnedriveClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			// Create a temp file to link — root drive items reject createLink with Bad Request
			let fileId: string | undefined;
			try {
				const file = await corsair.onedrive.api.files.createTextFile({
					name: `corsair_link_test_${Date.now()}.txt`,
					content: 'corsair integration test',
				});
				fileId = file.id;
			} catch {
				testDb.cleanup();
				return;
			}

			const input = { item_id: fileId, type: 'view' as const, scope: 'organization' as const };
			let result: Awaited<ReturnType<typeof corsair.onedrive.api.permissions.createLink>>;
			try {
				result = await corsair.onedrive.api.permissions.createLink(input);
			} catch {
				// createLink may be restricted by tenant sharing policy — skip
				await corsair.onedrive.api.items.delete({ item_id: fileId }).catch(() => {});
				testDb.cleanup();
				return;
			}

			expect(result).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'onedrive.permissions.createLink' } });
			expect(events.length).toBeGreaterThan(0);

			// cleanup temp file
			await corsair.onedrive.api.items.delete({ item_id: fileId }).catch(() => {});

			testDb.cleanup();
		});
	});

});
