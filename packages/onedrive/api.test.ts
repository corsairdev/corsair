import 'dotenv/config';
import { makeOnedriveRequest } from './client';
import { OnedriveEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.ONEDRIVE_ACCESS_TOKEN!;
let TEST_DRIVE_ID: string | undefined;
let TEST_ITEM_ID: string | undefined;
let TEST_SITE_ID: string | undefined;

beforeAll(async () => {
	const driveResult = await makeOnedriveRequest<{ id: string }>(
		'me/drive',
		TEST_TOKEN,
		{ method: 'GET' },
	);
	TEST_DRIVE_ID = driveResult.id;

	const rootResult = await makeOnedriveRequest<{
		value: Array<{ id: string }>;
	}>('me/drive/root/children', TEST_TOKEN, {
		method: 'GET',
		query: { $top: 1 },
	});
	TEST_ITEM_ID = rootResult.value?.[0]?.id;

	try {
		const sitesResult = await makeOnedriveRequest<{
			value: Array<{ id: string }>;
		}>('sites', TEST_TOKEN, { method: 'GET', query: { search: '*', $top: 1 } });
		TEST_SITE_ID = sitesResult.value?.[0]?.id;
	} catch {
		// SharePoint may not be available for all users
	}
});

describe('OneDrive API Type Tests', () => {
	describe('drive', () => {
		it('driveGetQuota returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveGetQuota.parse(response);
		});

		it('driveGetRoot returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive/root',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveGetRoot.parse(response);
		});

		it('driveGetRecentItems returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive/recent',
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.driveGetRecentItems.parse(response);
		});

		it('driveGetSharedItems returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive/sharedWithMe',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveGetSharedItems.parse(response);
		});

		it('driveList returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drives',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveList.parse(response);
		});

		it('driveListChanges returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive/root/delta',
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.driveListChanges.parse(response);
		});

		it('driveGet returns correct type', async () => {
			if (!TEST_DRIVE_ID) {
				return console.warn('Skipping driveGet — no drive ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`drives/${TEST_DRIVE_ID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveGet.parse(response);
		});
	});

	describe('items', () => {
		let createdFolderId: string | undefined;

		it('itemsListFolderChildren returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive/root/children',
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.itemsListFolderChildren.parse(response);
		});

		it('itemsSearch returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				`me/drive/root/search(q='test')`,
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.itemsSearch.parse(response);
		});

		it('filesCreateFolder returns correct type', async () => {
			const response = await makeOnedriveRequest<{
				id: string;
				name: string;
				webUrl?: string;
			}>('me/drive/root/children', TEST_TOKEN, {
				method: 'POST',
				body: {
					name: `test-folder-${Date.now()}`,
					folder: {},
					'@microsoft.graph.conflictBehavior': 'rename',
				},
			});
			OnedriveEndpointOutputSchemas.filesCreateFolder.parse(response);
			createdFolderId = response.id;
		});

		it('itemsGet returns correct type', async () => {
			const itemId = createdFolderId ?? TEST_ITEM_ID;
			if (!itemId) {
				return console.warn('Skipping itemsGet — no item ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`me/drive/items/${itemId}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.itemsGet.parse(response);
		});

		it('itemsUpdateMetadata returns correct type', async () => {
			const itemId = createdFolderId ?? TEST_ITEM_ID;
			if (!itemId) {
				return console.warn('Skipping itemsUpdateMetadata — no item ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`me/drive/items/${itemId}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: { description: 'Updated by api.test.ts' },
				},
			);
			OnedriveEndpointOutputSchemas.itemsUpdateMetadata.parse(response);
		});

		it('itemsGetVersions returns correct type', async () => {
			if (!TEST_ITEM_ID) {
				return console.warn('Skipping itemsGetVersions — no item ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`me/drive/items/${TEST_ITEM_ID}/versions`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.itemsGetVersions.parse(response);
		});

		it('itemsGetThumbnails returns correct type', async () => {
			if (!TEST_ITEM_ID) {
				return console.warn('Skipping itemsGetThumbnails — no item ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`me/drive/items/${TEST_ITEM_ID}/thumbnails`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.itemsGetThumbnails.parse(response);
		});

		it('itemsDelete returns correct type', async () => {
			if (!createdFolderId) {
				return console.warn('Skipping itemsDelete — no created folder ID');
			}
			await makeOnedriveRequest<void>(
				`me/drive/items/${createdFolderId}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			const result = OnedriveEndpointOutputSchemas.itemsDelete.parse({
				message: `Item ${createdFolderId} deleted successfully`,
			});
			expect(result.message).toBeTruthy();
		});
	});

	describe('files', () => {
		let createdFolderId: string | undefined;
		let createdFileId: string | undefined;

		it('filesList returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive/root/children',
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 10 } },
			);
			OnedriveEndpointOutputSchemas.filesList.parse(response);
		});

		it('filesFindFolder returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'me/drive/root/children',
				TEST_TOKEN,
				{ method: 'GET', query: { $filter: 'folder ne null', $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.filesFindFolder.parse(response);
		});

		it('filesCreateFolder returns correct type', async () => {
			const response = await makeOnedriveRequest<{
				id: string;
				name: string;
				webUrl?: string;
			}>('me/drive/root/children', TEST_TOKEN, {
				method: 'POST',
				body: {
					name: `api-test-folder-${Date.now()}`,
					folder: {},
					'@microsoft.graph.conflictBehavior': 'rename',
				},
			});
			OnedriveEndpointOutputSchemas.filesCreateFolder.parse(response);
			createdFolderId = response.id;
		});

		it('filesCreateTextFile returns correct type', async () => {
			const fileName = `api-test-file-${Date.now()}.txt`;
			const response = await makeOnedriveRequest<{
				id: string;
				name: string;
				size?: number;
				file?: Record<string, unknown>;
			}>(`me/drive/root:/${fileName}:/content`, TEST_TOKEN, {
				method: 'PUT',
				// any/unknown for file content string treated as body
				body: 'Hello from api.test.ts' as unknown as Record<string, unknown>,
			});
			OnedriveEndpointOutputSchemas.filesCreateTextFile.parse(response);
			createdFileId = response.id;
		});

		it('filesFindFile returns correct type', async () => {
			const response = await makeOnedriveRequest<{
				value: Array<Record<string, unknown>>;
				'@odata.context'?: string;
			}>(`me/drive/root/search(q='api-test')`, TEST_TOKEN, {
				method: 'GET',
				query: { $filter: 'file ne null', $top: 5 },
			});
			OnedriveEndpointOutputSchemas.filesFindFile.parse({
				value: response.value ?? [],
				odata_context: response['@odata.context'],
			});
		});

		it('cleanup: delete created items', async () => {
			const idsToDelete = [createdFolderId, createdFileId].filter(
				Boolean,
			) as string[];
			for (const id of idsToDelete) {
				try {
					await makeOnedriveRequest<void>(`me/drive/items/${id}`, TEST_TOKEN, {
						method: 'DELETE',
					});
				} catch (error) {
					console.warn(`Failed to delete test item ${id}:`, error);
				}
			}
		});
	});

	describe('permissions', () => {
		it('permissionsGetForItem returns correct type', async () => {
			if (!TEST_ITEM_ID) {
				return console.warn('Skipping permissionsGetForItem — no item ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`me/drive/items/${TEST_ITEM_ID}/permissions`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.permissionsGetForItem.parse(response);
		});
	});

	describe('sharepoint', () => {
		it('sharepointGetSite returns correct type', async () => {
			if (!TEST_SITE_ID) {
				return console.warn('Skipping sharepointGetSite — no site ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`sites/${TEST_SITE_ID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.sharepointGetSite.parse(response);
		});

		it('sharepointListSiteLists returns correct type', async () => {
			if (!TEST_SITE_ID) {
				return console.warn('Skipping sharepointListSiteLists — no site ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`sites/${TEST_SITE_ID}/lists`,
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.sharepointListSiteLists.parse(response);
		});

		it('sharepointListSiteColumns returns correct type', async () => {
			if (!TEST_SITE_ID) {
				return console.warn('Skipping sharepointListSiteColumns — no site ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`sites/${TEST_SITE_ID}/columns`,
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.sharepointListSiteColumns.parse(response);
		});

		it('sharepointListSiteSubsites returns correct type', async () => {
			if (!TEST_SITE_ID) {
				return console.warn('Skipping sharepointListSiteSubsites — no site ID');
			}
			const response = await makeOnedriveRequest<unknown>(
				`sites/${TEST_SITE_ID}/sites`,
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.sharepointListSiteSubsites.parse(response);
		});
	});

	describe('subscriptions', () => {
		it('subscriptionsList returns correct type', async () => {
			const response = await makeOnedriveRequest<unknown>(
				'subscriptions',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.subscriptionsList.parse(response);
		});
	});
});
