import 'dotenv/config';
import { makeOnedriveRequest } from './client';
import { download, downloadByPath } from './endpoints/items';
import type {
	DriveGetQuotaResponse,
	DriveGetRecentItemsResponse,
	DriveGetResponse,
	DriveGetRootResponse,
	DriveGetSharedItemsResponse,
	DriveListChangesResponse,
	DriveListResponse,
	FilesCreateFolderResponse,
	FilesCreateTextFileResponse,
	FilesFindFolderResponse,
	FilesListResponse,
	ItemsGetResponse,
	ItemsGetThumbnailsResponse,
	ItemsGetVersionsResponse,
	ItemsListFolderChildrenResponse,
	ItemsSearchResponse,
	ItemsUpdateMetadataResponse,
	PermissionsGetForItemResponse,
	SharepointGetSiteResponse,
	SharepointListSiteColumnsResponse,
	SharepointListSiteListsResponse,
	SharepointListSiteSubsitesResponse,
	SubscriptionsListResponse,
} from './endpoints/types';
import { OnedriveEndpointOutputSchemas } from './endpoints/types';
import type { OnedriveContext } from './index';

const TEST_TOKEN = process.env.ONEDRIVE_ACCESS_TOKEN?.trim() ?? '';
const hasCredentials = TEST_TOKEN.length > 0;
const describeIf = hasCredentials ? describe : describe.skip;

if (!hasCredentials) {
	console.warn('Skipping OneDrive API tests: ONEDRIVE_ACCESS_TOKEN not set');
}

let TEST_DRIVE_ID: string | undefined;
let TEST_ITEM_ID: string | undefined;
let TEST_SITE_ID: string | undefined;

describeIf('OneDrive API Type Tests', () => {
	beforeAll(async () => {
		const driveResult = await makeOnedriveRequest<DriveGetQuotaResponse>(
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
		TEST_ITEM_ID = rootResult.value[0]?.id;

		try {
			const sitesResult = await makeOnedriveRequest<{
				value: Array<{ id: string }>;
			}>('sites', TEST_TOKEN, {
				method: 'GET',
				query: { search: '*', $top: 1 },
			});
			TEST_SITE_ID = sitesResult.value[0]?.id;
		} catch {
			// SharePoint may not be available for all users
		}
	});
	describe('drive', () => {
		it('driveGetQuota returns correct type', async () => {
			const response = await makeOnedriveRequest<DriveGetQuotaResponse>(
				'me/drive',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveGetQuota.parse(response);
		});

		it('driveGetRoot returns correct type', async () => {
			const response = await makeOnedriveRequest<DriveGetRootResponse>(
				'me/drive/root',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveGetRoot.parse(response);
		});

		it('driveGetRecentItems returns correct type', async () => {
			const response = await makeOnedriveRequest<DriveGetRecentItemsResponse>(
				'me/drive/recent',
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.driveGetRecentItems.parse(response);
		});

		it('driveGetSharedItems returns correct type', async () => {
			const response = await makeOnedriveRequest<DriveGetSharedItemsResponse>(
				'me/drive/sharedWithMe',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveGetSharedItems.parse(response);
		});

		it('driveList returns correct type', async () => {
			const response = await makeOnedriveRequest<DriveListResponse>(
				'me/drives',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.driveList.parse(response);
		});

		it('driveListChanges returns correct type', async () => {
			const response = await makeOnedriveRequest<DriveListChangesResponse>(
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
			const response = await makeOnedriveRequest<DriveGetResponse>(
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
			const response =
				await makeOnedriveRequest<ItemsListFolderChildrenResponse>(
					'me/drive/root/children',
					TEST_TOKEN,
					{ method: 'GET', query: { $top: 5 } },
				);
			OnedriveEndpointOutputSchemas.itemsListFolderChildren.parse(response);
		});

		it('itemsSearch returns correct type', async () => {
			const response = await makeOnedriveRequest<ItemsSearchResponse>(
				`me/drive/root/search(q='test')`,
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.itemsSearch.parse(response);
		});

		it('filesCreateFolder returns correct type', async () => {
			const response = await makeOnedriveRequest<FilesCreateFolderResponse>(
				'me/drive/root/children',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: `test-folder-${Date.now()}`,
						folder: {},
						'@microsoft.graph.conflictBehavior': 'rename',
					},
				},
			);
			OnedriveEndpointOutputSchemas.filesCreateFolder.parse(response);
			createdFolderId = response.id;
		});

		it('itemsGet returns correct type', async () => {
			const itemId = createdFolderId ?? TEST_ITEM_ID;
			if (!itemId) {
				return console.warn('Skipping itemsGet — no item ID');
			}
			const response = await makeOnedriveRequest<ItemsGetResponse>(
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
			const response = await makeOnedriveRequest<ItemsUpdateMetadataResponse>(
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
			const response = await makeOnedriveRequest<ItemsGetVersionsResponse>(
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
			const response = await makeOnedriveRequest<ItemsGetThumbnailsResponse>(
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
			const response = await makeOnedriveRequest<FilesListResponse>(
				'me/drive/root/children',
				TEST_TOKEN,
				{ method: 'GET', query: { $top: 10 } },
			);
			OnedriveEndpointOutputSchemas.filesList.parse(response);
		});

		it('filesFindFolder returns correct type', async () => {
			const response = await makeOnedriveRequest<FilesFindFolderResponse>(
				'me/drive/root/children',
				TEST_TOKEN,
				{ method: 'GET', query: { $filter: 'folder ne null', $top: 5 } },
			);
			OnedriveEndpointOutputSchemas.filesFindFolder.parse(response);
		});

		it('filesCreateFolder returns correct type', async () => {
			const response = await makeOnedriveRequest<FilesCreateFolderResponse>(
				'me/drive/root/children',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: `api-test-folder-${Date.now()}`,
						folder: {},
						'@microsoft.graph.conflictBehavior': 'rename',
					},
				},
			);
			OnedriveEndpointOutputSchemas.filesCreateFolder.parse(response);
			createdFolderId = response.id;
		});

		it('filesCreateTextFile returns correct type', async () => {
			const fileName = `api-test-file-${Date.now()}.txt`;
			const response = await makeOnedriveRequest<FilesCreateTextFileResponse>(
				`me/drive/root:/${fileName}:/content`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { content: 'Hello from api.test.ts' },
				},
			);
			OnedriveEndpointOutputSchemas.filesCreateTextFile.parse(response);
			createdFileId = response.id;
		});

		it('filesFindFile returns correct type', async () => {
			const response = await makeOnedriveRequest<
				ItemsSearchResponse & { '@odata.context'?: string }
			>(`me/drive/root/search(q='api-test')`, TEST_TOKEN, {
				method: 'GET',
				query: { $filter: 'file ne null', $top: 5 },
			});
			OnedriveEndpointOutputSchemas.filesFindFile.parse({
				value: response.value,
				odata_context: response['@odata.context'],
			});
		});

		it('cleanup: delete created items', async () => {
			const idsToDelete = [createdFolderId, createdFileId].filter(
				(id): id is string => id !== undefined,
			);
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

	// Through the endpoints an agent calls: a file with bytes that aren't UTF-8
	// must come back exactly, and a CSV must come back as text.
	describe('downloads', () => {
		it('items.download and items.downloadByPath return a binary file byte for byte and a CSV as text', async () => {
			const pdf = new Uint8Array([
				0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0xff, 0xfe, 0x00,
				0x80, 0xc3, 0x28,
			]);
			const csv = 'id,name\n1,Zoë\n';
			const stamp = Date.now();
			const upload = async (name: string, body: Uint8Array) => {
				const response = await fetch(
					`https://graph.microsoft.com/v1.0/me/drive/root:/${name}:/content`,
					{
						method: 'PUT',
						headers: {
							Authorization: `Bearer ${TEST_TOKEN}`,
							'Content-Type': 'application/octet-stream',
						},
						body,
					},
				);
				expect(response.ok).toBe(true);
				return ((await response.json()) as { id: string }).id;
			};
			const pdfName = `corsair-download-test-${stamp}.pdf`;
			const csvName = `corsair-download-test-${stamp}.csv`;
			const pdfId = await upload(pdfName, pdf);
			const csvId = await upload(csvName, new TextEncoder().encode(csv));
			try {
				// unknown: the endpoints read only ctx.key, not a full plugin context.
				const ctx = { key: TEST_TOKEN } as unknown as OnedriveContext;
				const byId = await download(ctx, {
					item_id: pdfId,
					file_name: pdfName,
				});
				expect(OnedriveEndpointOutputSchemas.itemsDownload.parse(byId)).toEqual(
					byId,
				);
				expect(byId.byteLength).toBe(pdf.byteLength);
				expect(Buffer.from(byId.contentBase64 ?? '', 'base64')).toEqual(
					Buffer.from(pdf),
				);
				const byPath = await downloadByPath(ctx, {
					item_path: pdfName,
					file_name: pdfName,
				});
				expect(Buffer.from(byPath.contentBase64 ?? '', 'base64')).toEqual(
					Buffer.from(pdf),
				);
				// OneDrive serves a CSV as application/octet-stream; its name makes it text.
				const gotCsv = await download(ctx, {
					item_id: csvId,
					file_name: csvName,
				});
				expect(gotCsv.text).toBe(csv);
			} finally {
				for (const id of [pdfId, csvId]) {
					await makeOnedriveRequest(`me/drive/items/${id}`, TEST_TOKEN, {
						method: 'DELETE',
					}).catch(() => undefined);
				}
			}
		});
	});

	describe('permissions', () => {
		it('permissionsGetForItem returns correct type', async () => {
			if (!TEST_ITEM_ID) {
				return console.warn('Skipping permissionsGetForItem — no item ID');
			}
			const response = await makeOnedriveRequest<PermissionsGetForItemResponse>(
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
			const response = await makeOnedriveRequest<SharepointGetSiteResponse>(
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
			const response =
				await makeOnedriveRequest<SharepointListSiteListsResponse>(
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
			const response =
				await makeOnedriveRequest<SharepointListSiteColumnsResponse>(
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
			const response =
				await makeOnedriveRequest<SharepointListSiteSubsitesResponse>(
					`sites/${TEST_SITE_ID}/sites`,
					TEST_TOKEN,
					{ method: 'GET', query: { $top: 5 } },
				);
			OnedriveEndpointOutputSchemas.sharepointListSiteSubsites.parse(response);
		});
	});

	describe('subscriptions', () => {
		it('subscriptionsList returns correct type', async () => {
			const response = await makeOnedriveRequest<SubscriptionsListResponse>(
				'subscriptions',
				TEST_TOKEN,
				{ method: 'GET' },
			);
			OnedriveEndpointOutputSchemas.subscriptionsList.parse(response);
		});
	});
});
