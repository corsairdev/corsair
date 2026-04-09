import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { sharepoint } from './index';
import { resolveSiteGuid } from './client';

// Using `unknown` for both parameter and return because DB payloads may arrive as a raw JSON
function parsePayload(payload: unknown): unknown {
	return typeof payload === 'string' ? JSON.parse(payload) : payload;
}

async function createSharepointClient() {
	const accessToken = process.env.SHAREPOINT_ACCESS_TOKEN;
	const siteId = process.env.SHAREPOINT_SITE_ID;
	if (!accessToken || !siteId) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'sharepoint', 'default');

	const corsair = createCorsair({
		plugins: [sharepoint({ key: accessToken, siteId })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	// Resolve to GUID format ("tenant,siteGuid,webGuid") — required for list/item endpoints
	// that construct URLs as /sites/{siteId}/lists without the :/ colon-path notation.
	const siteGuid = await resolveSiteGuid(siteId, accessToken);

	// Issue account DEK and store site_id so endpoints can resolve it via ctx.keys.get_site_id()
	await corsair.sharepoint.keys.issue_new_dek();
	await corsair.sharepoint.keys.set_site_id(siteGuid);

	return { corsair, testDb, siteId: siteGuid };
}

describe('SharePoint plugin integration', () => {
	describe('lists', () => {
		it('listsListAll interacts with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const result = await corsair.sharepoint.api.lists.listAll({});

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'sharepoint.lists.listAll' } });
			expect(events.length).toBeGreaterThan(0);

			if (result.value && result.value.length > 0) {
				const first = result.value[0]!;
				if (first.id) {
					const fromDb = await corsair.sharepoint.db.lists.findByEntityId(first.id);
					expect(fromDb).not.toBeNull();
					expect(fromDb?.data.id).toBe(first.id);
				}
			}

			testDb.cleanup();
		});

		it('listsCreate, listsGetByTitle, listsUpdate, listsDelete interact with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			const createInput = {
				title: `CorsairTest_${Date.now()}`,
				description: 'Created by corsair integration test',
			};

			const created = await corsair.sharepoint.api.lists.create(createInput);

			expect(created).toBeDefined();

			const createEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.lists.create' } });
			expect(createEvents.length).toBeGreaterThan(0);
			expect(parsePayload(createEvents[createEvents.length - 1]!.payload)).toMatchObject(createInput);

			const getInput = { list_title: createInput.title };
			const fetched = await corsair.sharepoint.api.lists.getByTitle(getInput);

			expect(fetched).toBeDefined();

			const getEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.lists.getByTitle' } });
			expect(getEvents.length).toBeGreaterThan(0);
			expect(parsePayload(getEvents[getEvents.length - 1]!.payload)).toMatchObject(getInput);

			const updateInput = { list_title: createInput.title, description: `Updated by corsair test ${Date.now()}` };
			const updated = await corsair.sharepoint.api.lists.update(updateInput);

			expect(updated).toBeDefined();

			const updateEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.lists.update' } });
			expect(updateEvents.length).toBeGreaterThan(0);

			// cleanup: delete by title
			try {
				await corsair.sharepoint.api.lists.deleteByTitle({ list_title: createInput.title });
			} catch {
				// best-effort cleanup
			}

			testDb.cleanup();
		});

		it('listsListColumns interacts with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const lists = await corsair.sharepoint.api.lists.listAll({});
			const listTitle = lists.value?.[0]?.displayName;
			if (!listTitle) {
				testDb.cleanup();
				return;
			}

			const input = { list_title: listTitle };
			const result = await corsair.sharepoint.api.lists.listColumns(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'sharepoint.lists.listColumns' } });
			expect(events.length).toBeGreaterThan(0);
			expect(parsePayload(events[events.length - 1]!.payload)).toMatchObject(input);

			testDb.cleanup();
		});
	});

	describe('items', () => {
		let listTitle: string;

		beforeAll(async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;
			const lists = await corsair.sharepoint.api.lists.listAll({});
			listTitle = lists.value?.find(l => !l.list?.hidden)?.displayName ?? '';
			testDb.cleanup();
		});

		it('itemsList and itemsGet interact with API and DB', async () => {
			if (!listTitle) return;
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const listInput = { list_title: listTitle, top: 5 };
			const list = await corsair.sharepoint.api.items.list(listInput);

			expect(list).toBeDefined();
			expect(Array.isArray(list.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const listEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.items.list' } });
			expect(listEvents.length).toBeGreaterThan(0);
			expect(parsePayload(listEvents[listEvents.length - 1]!.payload)).toMatchObject(listInput);

			if (list.value && list.value.length > 0) {
				const first = list.value[0]!;
				const itemId = Number(first.id);
				if (itemId) {
					const getInput = { list_title: listTitle, item_id: itemId };
					const got = await corsair.sharepoint.api.items.get(getInput);

					expect(got).toBeDefined();
					expect(got.id).toBe(first.id);

					const getEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.items.get' } });
					expect(getEvents.length).toBeGreaterThan(0);
					expect(parsePayload(getEvents[getEvents.length - 1]!.payload)).toMatchObject(getInput);

					if (first.id) {
						const fromDb = await corsair.sharepoint.db.items.findByEntityId(first.id);
						expect(fromDb).not.toBeNull();
						expect(fromDb?.data.id).toBe(first.id);
					}
				}
			}

			testDb.cleanup();
		});

		it('itemsCreate, itemsUpdate, itemsDelete interact with API and DB', async () => {
			if (!listTitle) return;
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			const createInput = {
				list_title: listTitle,
				fields: { Title: `CorsairTest_${Date.now()}` },
			};

			let created: Awaited<ReturnType<typeof corsair.sharepoint.api.items.create>>;
			try {
				created = await corsair.sharepoint.api.items.create(createInput);
			} catch {
				// List may not support item creation — skip
				testDb.cleanup();
				return;
			}

			expect(created).toBeDefined();

			const createEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.items.create' } });
			expect(createEvents.length).toBeGreaterThan(0);

			const createdId = Number(created.id);
			if (createdId) {
				const fromDb = await corsair.sharepoint.db.items.findByEntityId(created.id!);
				expect(fromDb).not.toBeNull();

				const updateInput = {
					list_title: listTitle,
					item_id: createdId,
					fields: { Title: `CorsairUpdated_${Date.now()}` },
				};
				const updated = await corsair.sharepoint.api.items.update(updateInput);
				expect(updated).toBeDefined();

				const updateEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.items.update' } });
				expect(updateEvents.length).toBeGreaterThan(0);

				const deleteInput = { list_title: listTitle, item_id: createdId };
				const deleted = await corsair.sharepoint.api.items.delete(deleteInput);
				expect(deleted).toBeDefined();

				const deleteEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.items.delete' } });
				expect(deleteEvents.length).toBeGreaterThan(0);
				expect(parsePayload(deleteEvents[deleteEvents.length - 1]!.payload)).toMatchObject(deleteInput);
			}

			testDb.cleanup();
		});
	});

	describe('folders', () => {
		it('foldersCreate, foldersGet, foldersListSubfolders, foldersDelete interact with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			const folderName = `CorsairTest_${Date.now()}`;
			const createInput = { server_relative_url: folderName };

			let created: Awaited<ReturnType<typeof corsair.sharepoint.api.folders.create>>;
			try {
				created = await corsair.sharepoint.api.folders.create(createInput);
			} catch {
				// May require specific permissions — skip
				testDb.cleanup();
				return;
			}

			expect(created).toBeDefined();

			const createEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.folders.create' } });
			expect(createEvents.length).toBeGreaterThan(0);

			if (created.id) {
				const fromDb = await corsair.sharepoint.db.folders.findByEntityId(created.id);
				expect(fromDb).not.toBeNull();
			}

			const getInput = { server_relative_url: folderName };
			const fetched = await corsair.sharepoint.api.folders.get(getInput);
			expect(fetched).toBeDefined();

			const getEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.folders.get' } });
			expect(getEvents.length).toBeGreaterThan(0);

			const listSubInput = { server_relative_url: folderName };
			const subfolders = await corsair.sharepoint.api.folders.listSubfolders(listSubInput);
			expect(subfolders).toBeDefined();

			const deleteInput = { server_relative_url: folderName };
			const deleted = await corsair.sharepoint.api.folders.delete(deleteInput);
			expect(deleted).toBeDefined();

			const deleteEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.folders.delete' } });
			expect(deleteEvents.length).toBeGreaterThan(0);

			testDb.cleanup();
		});

		it('foldersGetAll interacts with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const result = await corsair.sharepoint.api.folders.getAll({});

			expect(result).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'sharepoint.folders.getAll' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});

	describe('files', () => {
		it('filesListInFolder and filesGet interact with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			// Use the first available folder so the path is non-empty
			// (the endpoint requires a non-empty folder_server_relative_url)
			const allFolders = await corsair.sharepoint.api.folders.getAll({});
			const folderName = allFolders.value?.[0]?.name;
			if (!folderName) {
				testDb.cleanup();
				return;
			}

			const listInput = { folder_server_relative_url: folderName };
			const list = await corsair.sharepoint.api.files.listInFolder(listInput);

			expect(list).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const listEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.files.listInFolder' } });
			expect(listEvents.length).toBeGreaterThan(0);
			expect(parsePayload(listEvents[listEvents.length - 1]!.payload)).toMatchObject(listInput);

			if (list.value && list.value.length > 0) {
				const first = list.value[0]!;
				if (first.name && first.webUrl) {
					// files.get uses the server-relative URL path within the drive
					const getInput = { server_relative_url: `${folderName}/${first.name}` };
					try {
						const got = await corsair.sharepoint.api.files.get(getInput);
						expect(got).toBeDefined();

						const getEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.files.get' } });
						expect(getEvents.length).toBeGreaterThan(0);

						if (first.id) {
							const fromDb = await corsair.sharepoint.db.files.findByEntityId(first.id);
							expect(fromDb).not.toBeNull();
						}
					} catch {
						// file may not be accessible via path lookup — skip filesGet
					}
				}
			}

			testDb.cleanup();
		});
	});

	describe('users', () => {
		it('usersGetCurrent and usersListSite interact with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			// /me requires delegated user context — skip gracefully with app-only tokens
			try {
				const current = await corsair.sharepoint.api.users.getCurrent({});
				expect(current).toBeDefined();

				const currentEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.users.getCurrent' } });
				expect(currentEvents.length).toBeGreaterThan(0);

				if (current.id) {
					const fromDb = await corsair.sharepoint.db.users.findByEntityId(String(current.id));
					expect(fromDb).not.toBeNull();
				}
			} catch {
				// app-only token does not support /me — skip usersGetCurrent
			}

			// listSite uses site permissions which may also require elevated access
			try {
				const siteUsers = await corsair.sharepoint.api.users.listSite({});
				expect(siteUsers).toBeDefined();

				const listEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.users.listSite' } });
				expect(listEvents.length).toBeGreaterThan(0);
			} catch {
				// insufficient permissions for site user listing — skip usersListSite
			}

			testDb.cleanup();
		});
	});

	describe('search', () => {
		it('searchQuery interacts with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { query_text: 'test', row_limit: 5 };
			const result = await corsair.sharepoint.api.search.query(input);

			expect(result).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'sharepoint.search.query' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});

	describe('web', () => {
		it('webGetInfo and webGetSiteCollectionInfo interact with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const webInfo = await corsair.sharepoint.api.web.getInfo({});

			expect(webInfo).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const infoEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.web.getInfo' } });
			expect(infoEvents.length).toBeGreaterThan(0);

			const siteInfo = await corsair.sharepoint.api.web.getSiteCollectionInfo({});

			expect(siteInfo).toBeDefined();

			const siteEvents = await orm.events.findMany({ where: { event_type: 'sharepoint.web.getSiteCollectionInfo' } });
			expect(siteEvents.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});

	describe('recycleBin', () => {
		it('recycleBinList interacts with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const result = await corsair.sharepoint.api.recycleBin.list({});

			expect(result).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'sharepoint.recycleBin.list' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});

	describe('permissions', () => {
		it('permissionsGetRoleDefinitions interacts with API and DB', async () => {
			const setup = await createSharepointClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			// /sites/{id}/permissions requires Sites.FullControl.All or admin consent — skip if Forbidden
			let result: Awaited<ReturnType<typeof corsair.sharepoint.api.permissions.getRoleDefinitions>>;
			try {
				result = await corsair.sharepoint.api.permissions.getRoleDefinitions({});
			} catch {
				testDb.cleanup();
				return;
			}

			expect(result).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({ where: { event_type: 'sharepoint.permissions.getRoleDefinitions' } });
			expect(events.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});
});
