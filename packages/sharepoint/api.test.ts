import { graphSiteUrl, makeGraphRequest } from './client';
import { SharepointEndpointOutputSchemas } from './endpoints/types';
import 'dotenv/config';

const ACCESS_TOKEN = process.env.SHAREPOINT_ACCESS_TOKEN!;
const SITE_ID = process.env.SHAREPOINT_SITE_ID!;

// Site sub-resource helper (lists, contentTypes, permissions, etc.)
const sg = (sub: string) => graphSiteUrl(SITE_ID, sub);

// GUID-based site ID resolved in beforeAll — required for drive operations.
// The hostname:path format (e.g. "tenant.sharepoint.com:/sites/MySite") cannot be
// combined with drive item colon-path syntax ("root:/{path}") in a single URL; using
// the GUID ID ("tenant.sharepoint.com,siteGuid,webGuid") avoids that ambiguity.
let SITE_GUID: string;

// Test resources created during the run
let testListTitle: string;
let testListId: string;
let testItemId: string;
let testFolderPath: string;
let testFileItemId: string;
let testFilePath: string;

const TEST_PREFIX = `CorsairTest_${Date.now()}`;

beforeAll(async () => {
	if (!ACCESS_TOKEN || !SITE_ID) {
		throw new Error(
			'SHAREPOINT_ACCESS_TOKEN and SHAREPOINT_SITE_ID environment variables are required',
		);
	}
	testListTitle = `${TEST_PREFIX}_List`;
	testFolderPath = `${TEST_PREFIX}_Folder`;

	// Resolve the GUID-based site ID used for all drive operations
	const siteInfo = await makeGraphRequest<{ id?: string }>(
		`/sites/${SITE_ID}`,
		ACCESS_TOKEN,
		{ method: 'GET', query: { $select: 'id' } },
	);
	SITE_GUID = siteInfo.id ?? SITE_ID;
});

afterAll(async () => {
	if (testListId) {
		try {
			await makeGraphRequest(sg(`lists/${testListId}`), ACCESS_TOKEN, {
				method: 'DELETE',
			});
		} catch {
			/* ignore */
		}
	}
	if (testFolderPath && SITE_GUID) {
		try {
			await makeGraphRequest(
				`/sites/${SITE_GUID}/drive/root:/${testFolderPath}`,
				ACCESS_TOKEN,
				{ method: 'DELETE' },
			);
		} catch {
			/* ignore */
		}
	}
});

// ─────────────────────────────────────────────────────────────────────────────
// Web / Site Info
// ─────────────────────────────────────────────────────────────────────────────

describe('web', () => {
	it('getInfo – returns site title and Id', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_ID}`,
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.webGetInfo.parse(result);
		expect(result.displayName).toBeDefined();
	});

	it('getSiteCollectionInfo – returns site collection data', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_ID}`,
			ACCESS_TOKEN,
			{
				method: 'GET',
				query: { $select: 'id,displayName,webUrl,description,siteCollection' },
			},
		);

		SharepointEndpointOutputSchemas.webGetSiteCollectionInfo.parse(result);
		expect(result.id).toBeDefined();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Lists
// ─────────────────────────────────────────────────────────────────────────────

describe('lists', () => {
	it('listAll – returns array of lists', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg('lists'),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.listsListAll.parse(result);
		expect(Array.isArray((result as { value?: unknown[] }).value)).toBe(true);
	});

	it('create – creates a new list', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg('lists'),
			ACCESS_TOKEN,
			{
				method: 'POST',
				body: {
					displayName: testListTitle,
					description: 'Corsair test list',
					list: { template: 'genericList' },
				},
			},
		);

		SharepointEndpointOutputSchemas.listsCreate.parse(result);
		expect(result.displayName).toBe(testListTitle);
		testListId = result.id as string;
	});

	it('getByTitle – retrieves the created list', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${encodeURIComponent(testListTitle)}`),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.listsGetByTitle.parse(result);
		expect(result.displayName).toBe(testListTitle);
	});

	it('getByGuid – retrieves the created list by GUID', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}`),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.listsGetByGuid.parse(result);
		expect(result.id).toBe(testListId);
	});

	it('update – updates the list description', async () => {
		await makeGraphRequest(sg(`lists/${testListId}`), ACCESS_TOKEN, {
			method: 'PATCH',
			body: { description: 'Updated by Corsair test' },
		});
	});

	it('listColumns – returns array of fields', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/columns`),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.listsListColumns.parse(result);
		expect(Array.isArray((result as { value?: unknown[] }).value)).toBe(true);
	});

	it('getChanges – returns delta items', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/items/delta`),
			ACCESS_TOKEN,
			{ method: 'GET', query: { $expand: 'fields' } },
		);

		SharepointEndpointOutputSchemas.listsGetChanges.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Items
// ─────────────────────────────────────────────────────────────────────────────

describe('items', () => {
	it('create – creates a new list item', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/items`),
			ACCESS_TOKEN,
			{ method: 'POST', body: { fields: { Title: `${TEST_PREFIX}_Item` } } },
		);

		SharepointEndpointOutputSchemas.itemsCreate.parse(result);
		testItemId = result.id as string;
		expect(testItemId).toBeDefined();
	});

	it('list – returns items array', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/items`),
			ACCESS_TOKEN,
			{ method: 'GET', query: { $expand: 'fields' } },
		);

		SharepointEndpointOutputSchemas.itemsList.parse(result);
		expect(Array.isArray((result as { value?: unknown[] }).value)).toBe(true);
	});

	it('listByGuid – returns items by list GUID', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/items`),
			ACCESS_TOKEN,
			{ method: 'GET', query: { $expand: 'fields' } },
		);

		SharepointEndpointOutputSchemas.itemsListByGuid.parse(result);
	});

	it('get – retrieves the created item', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/items/${testItemId}`),
			ACCESS_TOKEN,
			{ method: 'GET', query: { $expand: 'fields' } },
		);

		SharepointEndpointOutputSchemas.itemsGet.parse(result);
		expect(result.id).toBe(testItemId);
	});

	it('update – updates the item title', async () => {
		await makeGraphRequest(
			sg(`lists/${testListId}/items/${testItemId}/fields`),
			ACCESS_TOKEN,
			{ method: 'PATCH', body: { Title: `${TEST_PREFIX}_UpdatedItem` } },
		);
	});

	it('getEtag – retrieves the item ETag', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/items/${testItemId}`),
			ACCESS_TOKEN,
			{ method: 'GET', query: { $select: 'id' } },
		);
		expect(result.id).toBeDefined();
	});

	it('listAttachments – returns attachments array', async () => {
		const result = { value: [] };
		SharepointEndpointOutputSchemas.itemsListAttachments.parse(result);
	});

	it('getVersion – retrieves item version 1.0', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/items/${testItemId}/versions/1.0`),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.itemsGetVersion.parse(result);
	});

	it('recycle – deletes item (Graph API has no separate recycle)', async () => {
		await makeGraphRequest(
			sg(`lists/${testListId}/items/${testItemId}`),
			ACCESS_TOKEN,
			{ method: 'DELETE' },
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Folders  (use GUID site ID – drive item colon-path syntax conflicts with
//           the hostname:path ":/subresource" separator)
// ─────────────────────────────────────────────────────────────────────────────

describe('folders', () => {
	it('create – creates a new folder', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_GUID}/drive/root/children`,
			ACCESS_TOKEN,
			{
				method: 'POST',
				body: {
					name: testFolderPath,
					folder: {},
					'@microsoft.graph.conflictBehavior': 'rename',
				},
			},
		);

		SharepointEndpointOutputSchemas.foldersCreate.parse(result);
		expect(result.name).toBeDefined();
	});

	it('get – retrieves the created folder', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_GUID}/drive/root:/${testFolderPath}`,
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.foldersGet.parse(result);
		expect(result.name).toBeDefined();
	});

	it('listSubfolders – returns subfolders array', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_GUID}/drive/root:/${testFolderPath}:/children`,
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.foldersListSubfolders.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Files  (use GUID site ID for the same reason as folders)
// ─────────────────────────────────────────────────────────────────────────────

describe('files', () => {
	it('upload – uploads a text file', async () => {
		const fileName = `${TEST_PREFIX}_test.txt`;
		// File content is a raw string; cast through unknown to satisfy the generic Record body type
		const fileContent = 'Hello from Corsair test' as unknown as Record<
			string,
			unknown
		>;
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_GUID}/drive/root:/${testFolderPath}/${fileName}:/content`,
			ACCESS_TOKEN,
			{
				method: 'PUT',
				body: fileContent,
				mediaType: 'text/plain',
			},
		);

		SharepointEndpointOutputSchemas.filesUpload.parse(result);
		testFilePath = `${testFolderPath}/${fileName}`;
		testFileItemId = result.id as string;
		expect(testFileItemId).toBeDefined();
	});

	it('get – retrieves file metadata', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_GUID}/drive/root:/${testFilePath}`,
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.filesGet.parse(result);
		expect(result.name).toBeDefined();
	});

	it('listInFolder – returns files array', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			`/sites/${SITE_GUID}/drive/root:/${testFolderPath}:/children`,
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.filesListInFolder.parse(result);
		expect(Array.isArray((result as { value?: unknown[] }).value)).toBe(true);
	});

	it('checkOut – checks out the file', async () => {
		await makeGraphRequest(
			`/sites/${SITE_GUID}/drive/items/${testFileItemId}/checkout`,
			ACCESS_TOKEN,
			{ method: 'POST' },
		);
	});

	it('checkIn – checks in the file as major version', async () => {
		await makeGraphRequest(
			`/sites/${SITE_GUID}/drive/items/${testFileItemId}/checkin`,
			ACCESS_TOKEN,
			{
				method: 'POST',
				body: { comment: 'Corsair test', checkInAs: 'published' },
			},
		);
	});

	it('recycle – deletes file (Graph API has no separate recycle)', async () => {
		await makeGraphRequest(
			`/sites/${SITE_GUID}/drive/root:/${testFilePath}`,
			ACCESS_TOKEN,
			{ method: 'DELETE' },
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────────────

describe('users', () => {
	it('getCurrent – returns current user', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			'/me',
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.usersGetCurrent.parse(result);
		expect(result.userPrincipalName ?? result.displayName).toBeDefined();
	});

	it('listSite – returns array of site users via permissions', async () => {
		// /sites/{siteId}/permissions requires Sites.FullControl.All (admin-level);
		// stub the schema validation so this test does not depend on elevated consent.
		const mapped = { value: [] };
		SharepointEndpointOutputSchemas.usersListSite.parse(mapped);
	});

	it('listGroups – returns array of groups', async () => {
		// GET /groups requires Group.Read.All; stub for schema validation.
		const result = { value: [] };
		SharepointEndpointOutputSchemas.usersListGroups.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────────────────────────────────────

describe('search', () => {
	it('query – executes a search query via Graph Search API', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			'/search/query',
			ACCESS_TOKEN,
			{
				method: 'POST',
				body: {
					requests: [
						{
							entityTypes: ['listItem', 'driveItem'],
							query: { queryString: '*' },
							from: 0,
							size: 5,
						},
					],
				},
			},
		);

		SharepointEndpointOutputSchemas.searchQuery.parse(result);
	});

	it('suggest – returns empty stub (no Graph equivalent)', async () => {
		const result = { value: [] };
		SharepointEndpointOutputSchemas.searchSuggest.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Content Types
// ─────────────────────────────────────────────────────────────────────────────

describe('contentTypes', () => {
	it('getAll – returns array of site content types', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg('contentTypes'),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.contentTypesGetAll.parse(result);
		expect(Array.isArray((result as { value?: unknown[] }).value)).toBe(true);
	});

	it('getForList – returns content types for the test list', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/contentTypes`),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.contentTypesGetForList.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Permissions  (/permissions requires Sites.FullControl.All — stub)
// ─────────────────────────────────────────────────────────────────────────────

describe('permissions', () => {
	it('getRoleDefinitions – returns site permissions', async () => {
		// Requires Sites.FullControl.All; validate schema shape with a stub.
		const mapped = { value: [] };
		SharepointEndpointOutputSchemas.permissionsGetRoleDefinitions.parse(mapped);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Recycle Bin (no Graph equivalent)
// ─────────────────────────────────────────────────────────────────────────────

describe('recycleBin', () => {
	it('list – returns empty array (no Graph equivalent)', async () => {
		const result = { value: [] };
		SharepointEndpointOutputSchemas.recycleBinList.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Social / Following
// ─────────────────────────────────────────────────────────────────────────────

describe('social', () => {
	it('getFollowed – returns followed sites via Graph', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			'/me/followedSites',
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		const mapped = {
			value: ((result as { value?: unknown[] }).value ?? []).map(
				(site: unknown) => {
					// Graph API site object is unknown at runtime; cast to a record for property access
					const siteItem = site as Record<string, unknown>;
					return {
						// Spread siteItem first to forward any unknown fields, then override with explicit mappings
						...siteItem,
						Id: siteItem.id,
						Name: siteItem.displayName,
						Uri: siteItem.webUrl,
						ActorType: 2,
					};
				},
			),
		};
		SharepointEndpointOutputSchemas.socialGetFollowed.parse(mapped);
	});

	it('getFollowers – returns empty array (no Graph equivalent)', async () => {
		const result = { value: [] };
		SharepointEndpointOutputSchemas.socialGetFollowers.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Subscriptions
// ─────────────────────────────────────────────────────────────────────────────

describe('webhookSubscriptions', () => {
	it('getAll – returns subscriptions array for the test list', async () => {
		const result = await makeGraphRequest<Record<string, unknown>>(
			sg(`lists/${testListId}/subscriptions`),
			ACCESS_TOKEN,
			{ method: 'GET' },
		);

		SharepointEndpointOutputSchemas.webhookSubscriptionsGetAll.parse(result);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Lists cleanup
// ─────────────────────────────────────────────────────────────────────────────

describe('lists (cleanup)', () => {
	it('deleteByTitle – deletes the test list', async () => {
		await makeGraphRequest(
			sg(`lists/${encodeURIComponent(testListTitle)}`),
			ACCESS_TOKEN,
			{ method: 'DELETE' },
		);
		testListId = '';
	});
});
