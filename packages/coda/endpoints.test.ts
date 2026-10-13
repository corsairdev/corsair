import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	Account,
	Analytics,
	Automations,
	Categories,
	Columns,
	Controls,
	Docs,
	Domains,
	Folders,
	Formulas,
	PackAssets,
	PackCategories,
	PackConnections,
	PackFeaturedDocs,
	PackInvitations,
	PackListings,
	PackLogs,
	PackMakers,
	PackPermissions,
	PackReleases,
	Packs,
	PackVersions,
	Pages,
	Permissions,
	Rows,
	Tables,
	Workspaces,
} from './endpoints';
import { CodaEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { CodaContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

function entityClient() {
	return {
		findByEntityId: jest.fn(),
		existsByEntityId: jest.fn(),
		findIdByEntityId: jest.fn(),
		findById: jest.fn(),
		findManyByEntityIds: jest.fn(),
		list: jest.fn(),
		search: jest.fn(),
		upsertByEntityId: jest.fn(),
		deleteById: jest.fn(),
		deleteByEntityId: jest.fn(),
		count: jest.fn(),
	};
}

const db = {
	documents: entityClient(),
	pages: entityClient(),
	tables: entityClient(),
	columns: entityClient(),
	rows: entityClient(),
	folders: entityClient(),
	formulas: entityClient(),
	controls: entityClient(),
	packs: entityClient(),
};

// Safe: the handlers only read `key` and `db` from the context, and logEventFromContext is mocked.
// A narrower type is not practical because CodaContext also requires the database adapter, tenant and options wiring of a full Corsair instance.
const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account-id',
	options: { authType: 'api_key' },
	keys: {
		get_dek: jest.fn(),
		issue_new_dek: jest.fn(),
		get_api_key: jest.fn(),
		get_webhook_signature: jest.fn(),
		set_api_key: jest.fn(),
		set_webhook_signature: jest.fn(),
	},
	endpoints: {},
	db,
} as CodaContext;

const fetchMock = jest.spyOn(globalThis, 'fetch');

function respondWith(status: number, body: object) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function sentRequest() {
	const [url, init] = fetchMock.mock.calls[0] ?? [];
	const body =
		typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body;
	const auth = new Headers(init?.headers).get('Authorization');
	return { url: String(url), method: init?.method, auth, body };
}

function failure(pending: Promise<object>): Promise<Error> {
	return pending.then(
		() => Promise.reject(new Error('expected the request to fail')),
		(error: Error) => error,
	);
}

describe('Coda endpoints', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		jest.clearAllMocks();
		jest.mocked(logEventFromContext).mockReset();
	});

	it('account.whoami sends GET /whoami', async () => {
		const expected = {
			name: 'John Doe',
			loginId: 'user@example.com',
			type: 'user',
			scoped: false,
			tokenName: 'My API token',
			href: 'https://docs.superhuman.com/apis/v1beta/whoami',
			workspace: {
				id: 'ws-1Ab234',
				type: 'workspace',
				browserLink: 'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
			},
		};
		respondWith(200, expected);

		const result = await Account.whoami(ctx, {});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/whoami',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.accountWhoami.parse(result)).toEqual(
			expected,
		);
	});

	it('account.resolveBrowserLink sends GET /resolveBrowserLink', async () => {
		const expected = {
			type: 'apiLink',
			href: 'https://docs.superhuman.com/apis/v1/resolveBrowserLink?url=https%3A%2F%2Fdocs.superhuman.com%2Fd%2F_dAbCDeFGH%2FLaunch-Status_sumnO',
			resource: {
				id: 'canvas-IjkLmnO',
				href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
				type: 'aclMetadata',
			},
		};
		respondWith(200, expected);

		const result = await Account.resolveBrowserLink(ctx, {
			url: 'https://docs.superhuman.com/d/_dAbCDeFGH/Launch-Status_sumnO',
			degradeGracefully: true,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/resolveBrowserLink?url=https%3A%2F%2Fdocs.superhuman.com%2Fd%2F_dAbCDeFGH%2FLaunch-Status_sumnO&degradeGracefully=true',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.accountResolveBrowserLink.parse(result),
		).toEqual(expected);
	});

	it('account.getMutationStatus sends GET /mutationStatus/{requestId}', async () => {
		const expected = {
			completed: true,
		};
		respondWith(200, expected);

		const result = await Account.getMutationStatus(ctx, {
			requestId: 'abc-123-def-456',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/mutationStatus/abc-123-def-456',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.accountGetMutationStatus.parse(result),
		).toEqual(expected);
	});

	it('categories.list sends GET /categories', async () => {
		const expected = {
			items: [
				{
					name: 'Project Management',
				},
			],
		};
		respondWith(200, expected);

		const result = await Categories.list(ctx, {});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/categories',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.categoriesList.parse(result)).toEqual(
			expected,
		);
	});

	it('docs.list sends GET /docs', async () => {
		const expected = {
			items: [
				{
					id: 'AbCDeFGH',
					type: 'doc',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH',
					browserLink: 'https://docs.superhuman.com/d/_dAbCDeFGH',
					name: 'Product Launch Hub',
					owner: 'user@example.com',
					ownerName: 'Some User',
					createdAt: '2018-04-11T00:18:57.946Z',
					updatedAt: '2018-04-11T00:18:57.946Z',
					workspace: {
						id: 'ws-1Ab234',
						type: 'workspace',
						browserLink:
							'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
					},
					folder: {
						id: 'fl-1Ab234',
						type: 'folder',
						browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
					},
					workspaceId: 'ws-1Ab234',
					folderId: 'fl-1Ab234',
				},
			],
		};
		respondWith(200, expected);

		const result = await Docs.list(ctx, {
			isOwner: true,
			isPublished: true,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs?isOwner=true&isPublished=true',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.documents.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.docsList.parse(result)).toEqual(expected);
	});

	it('docs.get sends GET /docs/{docId}', async () => {
		const expected = {
			id: 'AbCDeFGH',
			type: 'doc',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH',
			browserLink: 'https://docs.superhuman.com/d/_dAbCDeFGH',
			name: 'Product Launch Hub',
			owner: 'user@example.com',
			ownerName: 'Some User',
			createdAt: '2018-04-11T00:18:57.946Z',
			updatedAt: '2018-04-11T00:18:57.946Z',
			workspace: {
				id: 'ws-1Ab234',
				type: 'workspace',
				browserLink: 'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
			},
			folder: {
				id: 'fl-1Ab234',
				type: 'folder',
				browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
			},
			workspaceId: 'ws-1Ab234',
			folderId: 'fl-1Ab234',
		};
		respondWith(200, expected);

		const result = await Docs.get(ctx, {
			docId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.documents.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.docsGet.parse(result)).toEqual(expected);
	});

	it('docs.create sends POST /docs', async () => {
		const expected = {
			id: 'AbCDeFGH',
			type: 'doc',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH',
			browserLink: 'https://docs.superhuman.com/d/_dAbCDeFGH',
			name: 'Product Launch Hub',
			owner: 'user@example.com',
			ownerName: 'Some User',
			createdAt: '2018-04-11T00:18:57.946Z',
			updatedAt: '2018-04-11T00:18:57.946Z',
			workspace: {
				id: 'ws-1Ab234',
				type: 'workspace',
				browserLink: 'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
			},
			folder: {
				id: 'fl-1Ab234',
				type: 'folder',
				browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
			},
			workspaceId: 'ws-1Ab234',
			folderId: 'fl-1Ab234',
		};
		respondWith(201, expected);

		const result = await Docs.create(ctx, {
			title: 'Project Tracker',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				title: 'Project Tracker',
			},
		});
		expect(result).toEqual(expected);
		expect(db.documents.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.docsCreate.parse(result)).toEqual(
			expected,
		);
	});

	it('docs.copy sends POST /docs', async () => {
		const expected = {
			id: 'AbCDeFGH',
			type: 'doc',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH',
			browserLink: 'https://docs.superhuman.com/d/_dAbCDeFGH',
			name: 'Product Launch Hub',
			owner: 'user@example.com',
			ownerName: 'Some User',
			createdAt: '2018-04-11T00:18:57.946Z',
			updatedAt: '2018-04-11T00:18:57.946Z',
			workspace: {
				id: 'ws-1Ab234',
				type: 'workspace',
				browserLink: 'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
			},
			folder: {
				id: 'fl-1Ab234',
				type: 'folder',
				browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
			},
			workspaceId: 'ws-1Ab234',
			folderId: 'fl-1Ab234',
		};
		respondWith(201, expected);

		const result = await Docs.copy(ctx, {
			sourceDoc: 'iJKlm_noPq',
			title: 'Project Tracker',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				sourceDoc: 'iJKlm_noPq',
				title: 'Project Tracker',
			},
		});
		expect(result).toEqual(expected);
		expect(db.documents.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.docsCopy.parse(result)).toEqual(expected);
	});

	it('docs.update sends PATCH /docs/{docId}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Docs.update(ctx, {
			docId: 'AbCDeFGH',
			title: 'Project Tracker',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH',
			method: 'PATCH',
			auth: 'Bearer test-api-key',
			body: {
				title: 'Project Tracker',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.docsUpdate.parse(result)).toEqual(
			expected,
		);
	});

	it('docs.delete sends DELETE /docs/{docId}', async () => {
		const expected = {};
		respondWith(202, expected);

		const result = await Docs.delete(ctx, {
			docId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.docsDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('docs.publish sends PUT /docs/{docId}/publish', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
		};
		respondWith(202, expected);

		const result = await Docs.publish(ctx, {
			docId: 'AbCDeFGH',
			slug: 'my-doc',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/publish',
			method: 'PUT',
			auth: 'Bearer test-api-key',
			body: {
				slug: 'my-doc',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.docsPublish.parse(result)).toEqual(
			expected,
		);
	});

	it('docs.unpublish sends DELETE /docs/{docId}/publish', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Docs.unpublish(ctx, {
			docId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/publish',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.docsUnpublish.parse(result)).toEqual(
			expected,
		);
	});

	it('permissions.list sends GET /docs/{docId}/acl/permissions', async () => {
		const expected = {
			items: [
				{
					principal: {
						email: 'example@domain.com',
						type: 'email',
					},
					id: 'value',
					access: 'readonly',
				},
			],
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/acl?limit=20',
		};
		respondWith(200, expected);

		const result = await Permissions.list(ctx, {
			docId: 'AbCDeFGH',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/acl/permissions?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.permissionsList.parse(result)).toEqual(
			expected,
		);
	});

	it('permissions.add sends POST /docs/{docId}/acl/permissions', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Permissions.add(ctx, {
			docId: 'AbCDeFGH',
			access: 'readonly',
			principal: {
				email: 'example@domain.com',
				type: 'email',
			},
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/acl/permissions',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				access: 'readonly',
				principal: {
					email: 'example@domain.com',
					type: 'email',
				},
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.permissionsAdd.parse(result)).toEqual(
			expected,
		);
	});

	it('permissions.delete sends DELETE /docs/{docId}/acl/permissions/{permissionId}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Permissions.delete(ctx, {
			docId: 'AbCDeFGH',
			permissionId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/acl/permissions/AbCDeFGH',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.permissionsDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('permissions.searchPrincipals sends GET /docs/{docId}/acl/principals/search', async () => {
		const expected = {
			users: [
				{
					name: 'John Doe',
					loginId: 'user@example.com',
					type: 'user',
				},
			],
			groups: [
				{
					groupId: 'grp-6SM9xrKcqW',
					groupName: 'Marketing team',
					type: 'group',
				},
			],
		};
		respondWith(200, expected);

		const result = await Permissions.searchPrincipals(ctx, {
			docId: 'AbCDeFGH',
			query: 'Supercalifragilisticexpialidocious',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/acl/principals/search?query=Supercalifragilisticexpialidocious',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.permissionsSearchPrincipals.parse(result),
		).toEqual(expected);
	});

	it('permissions.getSharingMetadata sends GET /docs/{docId}/acl/metadata', async () => {
		const expected = {
			canShare: true,
			canShareWithWorkspace: true,
			canShareWithOrg: true,
			canCopy: true,
		};
		respondWith(200, expected);

		const result = await Permissions.getSharingMetadata(ctx, {
			docId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/acl/metadata',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.permissionsGetSharingMetadata.parse(result),
		).toEqual(expected);
	});

	it('permissions.getAclSettings sends GET /docs/{docId}/acl/settings', async () => {
		const expected = {
			allowEditorsToChangePermissions: true,
			allowCopying: true,
			allowViewersToRequestEditing: true,
		};
		respondWith(200, expected);

		const result = await Permissions.getAclSettings(ctx, {
			docId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/acl/settings',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.permissionsGetAclSettings.parse(result),
		).toEqual(expected);
	});

	it('permissions.updateAclSettings sends PATCH /docs/{docId}/acl/settings', async () => {
		const expected = {
			allowEditorsToChangePermissions: true,
			allowCopying: true,
			allowViewersToRequestEditing: true,
		};
		respondWith(200, expected);

		const result = await Permissions.updateAclSettings(ctx, {
			docId: 'AbCDeFGH',
			allowEditorsToChangePermissions: true,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/acl/settings',
			method: 'PATCH',
			auth: 'Bearer test-api-key',
			body: {
				allowEditorsToChangePermissions: true,
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.permissionsUpdateAclSettings.parse(result),
		).toEqual(expected);
	});

	it('pages.list sends GET /docs/{docId}/pages', async () => {
		const expected = {
			items: [
				{
					id: 'canvas-IjkLmnO',
					type: 'page',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
					name: 'Launch Status',
					isHidden: true,
					isEffectivelyHidden: true,
					browserLink:
						'https://docs.superhuman.com/d/_dAbCDeFGH/Launch-Status_sumnO',
					children: [
						{
							id: 'canvas-IjkLmnO',
							type: 'page',
							browserLink:
								'https://docs.superhuman.com/d/_dAbCDeFGH/Launch-Status_sumnO',
							href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
							name: 'Launch Status',
						},
					],
					contentType: 'canvas',
				},
			],
		};
		respondWith(200, expected);

		const result = await Pages.list(ctx, {
			docId: 'AbCDeFGH',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.pages.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.pagesList.parse(result)).toEqual(expected);
	});

	it('pages.get sends GET /docs/{docId}/pages/{pageIdOrName}', async () => {
		const expected = {
			id: 'canvas-IjkLmnO',
			type: 'page',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
			name: 'Launch Status',
			isHidden: true,
			isEffectivelyHidden: true,
			browserLink:
				'https://docs.superhuman.com/d/_dAbCDeFGH/Launch-Status_sumnO',
			children: [
				{
					id: 'canvas-IjkLmnO',
					type: 'page',
					browserLink:
						'https://docs.superhuman.com/d/_dAbCDeFGH/Launch-Status_sumnO',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
					name: 'Launch Status',
				},
			],
			contentType: 'canvas',
		};
		respondWith(200, expected);

		const result = await Pages.get(ctx, {
			docId: 'AbCDeFGH',
			pageIdOrName: 'canvas-IjkLmnO',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.pages.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.pagesGet.parse(result)).toEqual(expected);
	});

	it('pages.create sends POST /docs/{docId}/pages', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			id: 'canvas-tuVwxYz',
		};
		respondWith(202, expected);

		const result = await Pages.create(ctx, {
			docId: 'AbCDeFGH',
			name: 'Launch Status',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				name: 'Launch Status',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.pagesCreate.parse(result)).toEqual(
			expected,
		);
	});

	it('pages.update sends PUT /docs/{docId}/pages/{pageIdOrName}', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			id: 'canvas-tuVwxYz',
		};
		respondWith(202, expected);

		const result = await Pages.update(ctx, {
			docId: 'AbCDeFGH',
			pageIdOrName: 'canvas-IjkLmnO',
			name: 'Launch Status',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
			method: 'PUT',
			auth: 'Bearer test-api-key',
			body: {
				name: 'Launch Status',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.pagesUpdate.parse(result)).toEqual(
			expected,
		);
	});

	it('pages.delete sends DELETE /docs/{docId}/pages/{pageIdOrName}', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			id: 'canvas-tuVwxYz',
		};
		respondWith(202, expected);

		const result = await Pages.delete(ctx, {
			docId: 'AbCDeFGH',
			pageIdOrName: 'canvas-IjkLmnO',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.pagesDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('pages.listContent sends GET /docs/{docId}/pages/{pageIdOrName}/content', async () => {
		const expected = {
			items: [
				{
					id: 'cl-2ZUJuRhNuN',
					type: 'line',
				},
			],
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO/content?limit=20',
		};
		respondWith(200, expected);

		const result = await Pages.listContent(ctx, {
			docId: 'AbCDeFGH',
			pageIdOrName: 'canvas-IjkLmnO',
			limit: 50,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO/content?limit=50&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.pagesListContent.parse(result)).toEqual(
			expected,
		);
	});

	it('pages.deleteContent sends DELETE /docs/{docId}/pages/{pageIdOrName}/content', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			id: 'canvas-tuVwxYz',
		};
		respondWith(202, expected);

		const result = await Pages.deleteContent(ctx, {
			docId: 'AbCDeFGH',
			pageIdOrName: 'canvas-IjkLmnO',
			elementIds: ['cl-lzqh0Q0poT', 'cl-abc123def'],
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO/content',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: {
				elementIds: ['cl-lzqh0Q0poT', 'cl-abc123def'],
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.pagesDeleteContent.parse(result)).toEqual(
			expected,
		);
	});

	it('pages.beginExport sends POST /docs/{docId}/pages/{pageIdOrName}/export', async () => {
		const expected = {
			id: 'AbCDeFGH',
			status: 'complete',
			href: 'https://docs.superhuman.com/apis/v1/docs/somedoc/pages/somepage/export/some-request-id',
		};
		respondWith(202, expected);

		const result = await Pages.beginExport(ctx, {
			docId: 'AbCDeFGH',
			pageIdOrName: 'canvas-IjkLmnO',
			outputFormat: 'html',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO/export',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				outputFormat: 'html',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.pagesBeginExport.parse(result)).toEqual(
			expected,
		);
	});

	it('pages.getExportStatus sends GET /docs/{docId}/pages/{pageIdOrName}/export/{requestId}', async () => {
		const expected = {
			id: 'AbCDeFGH',
			status: 'complete',
			href: 'https://docs.superhuman.com/apis/v1/docs/somedoc/pages/somepage/export/some-request-id',
		};
		respondWith(200, expected);

		const result = await Pages.getExportStatus(ctx, {
			docId: 'AbCDeFGH',
			pageIdOrName: 'canvas-IjkLmnO',
			requestId: 'abc-123-def-456',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO/export/abc-123-def-456',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.pagesGetExportStatus.parse(result),
		).toEqual(expected);
	});

	it('tables.list sends GET /docs/{docId}/tables', async () => {
		const expected = {
			items: [
				{
					id: 'grid-pqRst-U',
					type: 'table',
					tableType: 'table',
					browserLink:
						'https://docs.superhuman.com/d/_dAbCDeFGH/#Teams-and-Tasks_tpqRst-U',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U',
					name: 'Tasks',
				},
			],
		};
		respondWith(200, expected);

		const result = await Tables.list(ctx, {
			docId: 'AbCDeFGH',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.tables.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.tablesList.parse(result)).toEqual(
			expected,
		);
	});

	it('tables.list keeps the detail fields a previous tables.get stored', async () => {
		const reference = {
			id: 'grid-pqRst-U',
			type: 'table',
			tableType: 'table',
			browserLink: 'https://coda.io/d/_dAbCDeFGH/#Tasks_tpqRst-U',
			href: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U',
			name: 'Tasks',
		};
		db.tables.findByEntityId.mockResolvedValueOnce({
			data: { ...reference, rowCount: 12, layout: 'default' },
		});
		respondWith(200, { items: [{ ...reference, name: 'Tasks renamed' }] });

		await Tables.list(ctx, { docId: 'AbCDeFGH' });

		expect(db.tables.upsertByEntityId.mock.calls).toEqual([
			[
				'grid-pqRst-U',
				{
					...reference,
					name: 'Tasks renamed',
					rowCount: 12,
					layout: 'default',
				},
			],
		]);
	});

	it('tables.get sends GET /docs/{docId}/tables/{tableIdOrName}', async () => {
		const expected = {
			id: 'grid-pqRst-U',
			type: 'table',
			tableType: 'table',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U',
			name: 'Tasks',
			parent: {
				id: 'canvas-IjkLmnO',
				type: 'page',
				browserLink:
					'https://docs.superhuman.com/d/_dAbCDeFGH/Launch-Status_sumnO',
				href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
				name: 'Launch Status',
			},
			browserLink:
				'https://docs.superhuman.com/d/_dAbCDeFGH/#Teams-and-Tasks_tpqRst-U',
			displayColumn: {
				id: 'c-tuVwxYz',
				type: 'column',
				href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U/columns/c-tuVwxYz',
			},
			rowCount: 130,
			sorts: [
				{
					column: {
						id: 'c-tuVwxYz',
						type: 'column',
						href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U/columns/c-tuVwxYz',
					},
					direction: 'ascending',
				},
			],
			layout: 'default',
			createdAt: '2018-04-11T00:18:57.946Z',
			updatedAt: '2018-04-11T00:18:57.946Z',
		};
		respondWith(200, expected);

		const result = await Tables.get(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			useUpdatedTableLayouts: true,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table?useUpdatedTableLayouts=true',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.tables.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.tablesGet.parse(result)).toEqual(expected);
	});

	it('columns.list sends GET /docs/{docId}/tables/{tableIdOrName}/columns', async () => {
		const expected = {
			items: [
				{
					id: 'c-tuVwxYz',
					type: 'column',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U/columns/c-tuVwxYz',
					name: 'Completed',
					format: {
						type: 'text',
						isArray: true,
					},
				},
			],
		};
		respondWith(200, expected);

		const result = await Columns.list(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/columns?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.columns.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.columnsList.parse(result)).toEqual(
			expected,
		);
	});

	it('columns.get sends GET /docs/{docId}/tables/{tableIdOrName}/columns/{columnIdOrName}', async () => {
		const expected = {
			id: 'c-tuVwxYz',
			type: 'column',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U/columns/c-tuVwxYz',
			name: 'Completed',
			parent: {
				id: 'grid-pqRst-U',
				type: 'table',
				tableType: 'table',
				browserLink:
					'https://docs.superhuman.com/d/_dAbCDeFGH/#Teams-and-Tasks_tpqRst-U',
				href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U',
				name: 'Tasks',
			},
			format: {
				type: 'text',
				isArray: true,
			},
		};
		respondWith(200, expected);

		const result = await Columns.get(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			columnIdOrName: 'c-tuVwxYz',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/columns/c-tuVwxYz',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.columns.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.columnsGet.parse(result)).toEqual(
			expected,
		);
	});

	it('rows.list sends GET /docs/{docId}/tables/{tableIdOrName}/rows', async () => {
		const expected = {
			items: [
				{
					id: 'i-tuVwxYz',
					type: 'row',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U/rows/i-RstUv-W',
					name: 'Apple',
					index: 7,
					browserLink:
						'https://docs.superhuman.com/d/_dAbCDeFGH#Teams-and-Tasks_tpqRst-U/_rui-tuVwxYz',
					createdAt: '2018-04-11T00:18:57.946Z',
					updatedAt: '2018-04-11T00:18:57.946Z',
					values: {
						key: '$12.34',
					},
				},
			],
		};
		respondWith(200, expected);

		const result = await Rows.list(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			query: 'c-tuVwxYz:"Apple"',
			sortBy: 'createdAt',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/rows?query=c-tuVwxYz%3A%22Apple%22&sortBy=createdAt',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.rows.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.rowsList.parse(result)).toEqual(expected);
	});

	it('rows.get sends GET /docs/{docId}/tables/{tableIdOrName}/rows/{rowIdOrName}', async () => {
		const expected = {
			id: 'i-tuVwxYz',
			type: 'row',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U/rows/i-RstUv-W',
			name: 'Apple',
			index: 7,
			browserLink:
				'https://docs.superhuman.com/d/_dAbCDeFGH#Teams-and-Tasks_tpqRst-U/_rui-tuVwxYz',
			createdAt: '2018-04-11T00:18:57.946Z',
			updatedAt: '2018-04-11T00:18:57.946Z',
			values: {
				key: '$12.34',
			},
			parent: {
				id: 'grid-pqRst-U',
				type: 'table',
				tableType: 'table',
				browserLink:
					'https://docs.superhuman.com/d/_dAbCDeFGH/#Teams-and-Tasks_tpqRst-U',
				href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/tables/grid-pqRst-U',
				name: 'Tasks',
			},
		};
		respondWith(200, expected);

		const result = await Rows.get(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			rowIdOrName: 'i-tuVwxYz',
			useColumnNames: true,
			valueFormat: 'simple',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/rows/i-tuVwxYz?useColumnNames=true&valueFormat=simple',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.rows.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.rowsGet.parse(result)).toEqual(expected);
	});

	it('rows.upsert sends POST /docs/{docId}/tables/{tableIdOrName}/rows', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
		};
		respondWith(202, expected);

		const result = await Rows.upsert(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			disableParsing: true,
			rows: [
				{
					cells: [
						{
							column: 'c-tuVwxYz',
							value: '$12.34',
						},
					],
				},
			],
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/rows?disableParsing=true',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				rows: [
					{
						cells: [
							{
								column: 'c-tuVwxYz',
								value: '$12.34',
							},
						],
					},
				],
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.rowsUpsert.parse(result)).toEqual(
			expected,
		);
	});

	it('rows.update sends PUT /docs/{docId}/tables/{tableIdOrName}/rows/{rowIdOrName}', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			id: 'i-tuVwxYz',
		};
		respondWith(202, expected);

		const result = await Rows.update(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			rowIdOrName: 'i-tuVwxYz',
			disableParsing: true,
			row: {
				cells: [
					{
						column: 'c-tuVwxYz',
						value: '$12.34',
					},
				],
			},
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/rows/i-tuVwxYz?disableParsing=true',
			method: 'PUT',
			auth: 'Bearer test-api-key',
			body: {
				row: {
					cells: [
						{
							column: 'c-tuVwxYz',
							value: '$12.34',
						},
					],
				},
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.rowsUpdate.parse(result)).toEqual(
			expected,
		);
	});

	it('rows.delete sends DELETE /docs/{docId}/tables/{tableIdOrName}/rows/{rowIdOrName}', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			id: 'i-tuVwxYz',
		};
		respondWith(202, expected);

		const result = await Rows.delete(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			rowIdOrName: 'i-tuVwxYz',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/rows/i-tuVwxYz',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.rowsDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('rows.deleteMany sends DELETE /docs/{docId}/tables/{tableIdOrName}/rows', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			rowIds: ['i-bCdeFgh', 'i-CdEfgHi'],
		};
		respondWith(202, expected);

		const result = await Rows.deleteMany(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			rowIds: ['i-bCdeFgh', 'i-CdEfgHi'],
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/rows',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: {
				rowIds: ['i-bCdeFgh', 'i-CdEfgHi'],
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.rowsDeleteMany.parse(result)).toEqual(
			expected,
		);
	});

	it('rows.pushButton sends POST /docs/{docId}/tables/{tableIdOrName}/rows/{rowIdOrName}/buttons/{columnIdOrName}', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			rowId: 'i-tuVwxYz',
			columnId: 'i-tuVwxYz',
		};
		respondWith(202, expected);

		const result = await Rows.pushButton(ctx, {
			docId: 'AbCDeFGH',
			tableIdOrName: 'Tasks Table',
			rowIdOrName: 'i-tuVwxYz',
			columnIdOrName: 'c-tuVwxYz',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/tables/Tasks%20Table/rows/i-tuVwxYz/buttons/c-tuVwxYz',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.rowsPushButton.parse(result)).toEqual(
			expected,
		);
	});

	it('formulas.list sends GET /docs/{docId}/formulas', async () => {
		const expected = {
			items: [
				{
					id: 'f-fgHijkLm',
					type: 'formula',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/formulas/f-fgHijkLm',
					name: 'Sum of expenses',
				},
			],
		};
		respondWith(200, expected);

		const result = await Formulas.list(ctx, {
			docId: 'AbCDeFGH',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/formulas?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.formulas.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.formulasList.parse(result)).toEqual(
			expected,
		);
	});

	it('formulas.get sends GET /docs/{docId}/formulas/{formulaIdOrName}', async () => {
		const expected = {
			id: 'f-fgHijkLm',
			type: 'formula',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/formulas/f-fgHijkLm',
			name: 'Sum of expenses',
			value: '$12.34',
		};
		respondWith(200, expected);

		const result = await Formulas.get(ctx, {
			docId: 'AbCDeFGH',
			formulaIdOrName: 'f-fgHijkLm',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/formulas/f-fgHijkLm',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.formulas.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.formulasGet.parse(result)).toEqual(
			expected,
		);
	});

	it('controls.list sends GET /docs/{docId}/controls', async () => {
		const expected = {
			items: [
				{
					id: 'ctrl-cDefGhij',
					type: 'control',
					href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/controls/ctrl-cDefGhij',
					name: 'Cost',
				},
			],
		};
		respondWith(200, expected);

		const result = await Controls.list(ctx, {
			docId: 'AbCDeFGH',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/controls?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.controls.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.controlsList.parse(result)).toEqual(
			expected,
		);
	});

	it('controls.get sends GET /docs/{docId}/controls/{controlIdOrName}', async () => {
		const expected = {
			id: 'ctrl-cDefGhij',
			type: 'control',
			href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH/controls/ctrl-cDefGhij',
			name: 'Cost',
			controlType: 'slider',
			value: '$12.34',
		};
		respondWith(200, expected);

		const result = await Controls.get(ctx, {
			docId: 'AbCDeFGH',
			controlIdOrName: 'ctrl-cDefGhij',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/controls/ctrl-cDefGhij',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.controls.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.controlsGet.parse(result)).toEqual(
			expected,
		);
	});

	it('domains.list sends GET /docs/{docId}/domains', async () => {
		const expected = {
			customDocDomains: [
				{
					customDocDomain: 'example.com',
					hasCertificate: true,
					hasDnsDocId: true,
					setupStatus: 'pending',
					domainStatus: 'connected',
				},
			],
		};
		respondWith(200, expected);

		const result = await Domains.list(ctx, {
			docId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/domains',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.domainsList.parse(result)).toEqual(
			expected,
		);
	});

	it('domains.add sends POST /docs/{docId}/domains', async () => {
		const expected = {};
		respondWith(202, expected);

		const result = await Domains.add(ctx, {
			docId: 'AbCDeFGH',
			customDocDomain: 'example.com',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/domains',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				customDocDomain: 'example.com',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.domainsAdd.parse(result)).toEqual(
			expected,
		);
	});

	it('domains.update sends PATCH /docs/{docId}/domains/{customDocDomain}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Domains.update(ctx, {
			docId: 'AbCDeFGH',
			customDocDomain: 'value',
			body: {},
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/domains/value',
			method: 'PATCH',
			auth: 'Bearer test-api-key',
			body: {},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.domainsUpdate.parse(result)).toEqual(
			expected,
		);
	});

	it('domains.delete sends DELETE /docs/{docId}/domains/{customDocDomain}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Domains.delete(ctx, {
			docId: 'AbCDeFGH',
			customDocDomain: 'value',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/domains/value',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.domainsDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('domains.getProvider sends GET /domains/provider/{customDocDomain}', async () => {
		const expected = {
			provider: 'GoDaddy',
		};
		respondWith(200, expected);

		const result = await Domains.getProvider(ctx, {
			customDocDomain: 'value',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/domains/provider/value',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.domainsGetProvider.parse(result)).toEqual(
			expected,
		);
	});

	it('folders.list sends GET /folders', async () => {
		const expected = {
			items: [
				{
					id: 'fl-1Ab234',
					type: 'folder',
					name: 'Projects',
					browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
					workspace: {
						id: 'ws-1Ab234',
						type: 'workspace',
						browserLink:
							'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
					},
				},
			],
		};
		respondWith(200, expected);

		const result = await Folders.list(ctx, {
			workspaceId: 'ws-1Ab234',
			isStarred: true,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/folders?workspaceId=ws-1Ab234&isStarred=true',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.folders.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.foldersList.parse(result)).toEqual(
			expected,
		);
	});

	it('folders.get sends GET /folders/{folderId}', async () => {
		const expected = {
			id: 'fl-1Ab234',
			type: 'folder',
			name: 'Projects',
			browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
			workspace: {
				id: 'ws-1Ab234',
				type: 'workspace',
				browserLink: 'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
			},
		};
		respondWith(200, expected);

		const result = await Folders.get(ctx, {
			folderId: 'fl-1Ab234',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/folders/fl-1Ab234',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.folders.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.foldersGet.parse(result)).toEqual(
			expected,
		);
	});

	it('folders.create sends POST /folders', async () => {
		const expected = {
			id: 'fl-1Ab234',
			type: 'folder',
			name: 'Projects',
			browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
			workspace: {
				id: 'ws-1Ab234',
				type: 'workspace',
				browserLink: 'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
			},
		};
		respondWith(201, expected);

		const result = await Folders.create(ctx, {
			name: 'Projects',
			workspaceId: 'ws-1Ab234',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/folders',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				name: 'Projects',
				workspaceId: 'ws-1Ab234',
			},
		});
		expect(result).toEqual(expected);
		expect(db.folders.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.foldersCreate.parse(result)).toEqual(
			expected,
		);
	});

	it('folders.update sends PATCH /folders/{folderId}', async () => {
		const expected = {
			id: 'fl-1Ab234',
			type: 'folder',
			name: 'Projects',
			browserLink: 'https://docs.superhuman.com/folders/fl-1Ab234',
			workspace: {
				id: 'ws-1Ab234',
				type: 'workspace',
				browserLink: 'https://docs.superhuman.com/docs?workspaceId=ws-1Ab234',
			},
		};
		respondWith(200, expected);

		const result = await Folders.update(ctx, {
			folderId: 'fl-1Ab234',
			name: 'Projects',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/folders/fl-1Ab234',
			method: 'PATCH',
			auth: 'Bearer test-api-key',
			body: {
				name: 'Projects',
			},
		});
		expect(result).toEqual(expected);
		expect(db.folders.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.foldersUpdate.parse(result)).toEqual(
			expected,
		);
	});

	it('folders.delete sends DELETE /folders/{folderId}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Folders.delete(ctx, {
			folderId: 'fl-1Ab234',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/folders/fl-1Ab234',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.foldersDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('automations.trigger sends POST /docs/{docId}/hooks/automation/{ruleId}', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
		};
		respondWith(202, expected);

		const result = await Automations.trigger(ctx, {
			docId: 'AbCDeFGH',
			ruleId: 'grid-auto-b3Jmey6jBS',
			payload: {
				message: 'Run the weekly report',
			},
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/docs/AbCDeFGH/hooks/automation/grid-auto-b3Jmey6jBS',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				message: 'Run the weekly report',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.automationsTrigger.parse(result)).toEqual(
			expected,
		);
	});

	it('analytics.listDocs sends GET /analytics/docs', async () => {
		const expected = {
			items: [
				{
					doc: {
						id: 'AbCDeFGH',
						type: 'doc',
						browserLink: 'https://docs.superhuman.com/d/_dAbCDeFGH',
						href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH',
						title: 'Cool Geometry Formulas',
						createdAt: '2022-04-11T00:18:57.946Z',
					},
					metrics: [
						{
							date: '2020-09-02',
							views: 980,
							copies: 24,
							likes: 342,
							sessionsMobile: 530,
							sessionsDesktop: 212,
							sessionsOther: 10,
							totalSessions: 1000,
						},
					],
				},
			],
		};
		respondWith(200, expected);

		const result = await Analytics.listDocs(ctx, {
			docIds: ['value'],
			workspaceId: 'ws-1Ab234',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/analytics/docs?docIds=value&workspaceId=ws-1Ab234',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.analyticsListDocs.parse(result)).toEqual(
			expected,
		);
	});

	it('analytics.listPages sends GET /analytics/docs/{docId}/pages', async () => {
		const expected = {
			items: [
				{
					page: {
						id: 'section-IjkLmnO',
						name: 'Launch Status',
					},
					metrics: [
						{
							date: '2022-06-03',
							views: 980,
							sessions: 24,
							users: 42,
							averageSecondsViewed: 42,
							medianSecondsViewed: 42,
							tabs: 10,
						},
					],
				},
			],
		};
		respondWith(200, expected);

		const result = await Analytics.listPages(ctx, {
			docId: 'AbCDeFGH',
			sinceDate: '2020-08-01',
			untilDate: '2020-08-05',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/analytics/docs/AbCDeFGH/pages?sinceDate=2020-08-01&untilDate=2020-08-05',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.analyticsListPages.parse(result)).toEqual(
			expected,
		);
	});

	it('analytics.getDocsSummary sends GET /analytics/docs/summary', async () => {
		const expected = {
			totalSessions: 1337,
		};
		respondWith(200, expected);

		const result = await Analytics.getDocsSummary(ctx, {
			isPublished: true,
			sinceDate: '2020-08-01',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/analytics/docs/summary?isPublished=true&sinceDate=2020-08-01',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.analyticsGetDocsSummary.parse(result),
		).toEqual(expected);
	});

	it('analytics.listPacks sends GET /analytics/packs', async () => {
		const expected = {
			items: [
				{
					pack: {
						id: 1003,
						name: 'Cool Geometry Formulas',
						createdAt: '2022-04-11T00:18:57.946Z',
					},
					metrics: [
						{
							date: '2020-09-02',
							docInstalls: 100,
							workspaceInstalls: 10,
							numFormulaInvocations: 100,
							numActionInvocations: 100,
							numSyncInvocations: 100,
							numMetadataInvocations: 100,
							docsActivelyUsing: 50,
							docsActivelyUsing7Day: 100,
							docsActivelyUsing30Day: 200,
							docsActivelyUsing90Day: 300,
							docsActivelyUsingAllTime: 500,
							workspacesActivelyUsing: 10,
							workspacesActivelyUsing7Day: 15,
							workspacesActivelyUsing30Day: 20,
							workspacesActivelyUsing90Day: 30,
							workspacesActivelyUsingAllTime: 50,
							workspacesActivelyTrialing: 1,
							workspacesActivelyTrialing7Day: 1,
							workspacesActivelyTrialing30Day: 1,
							workspacesActivelyTrialing90Day: 1,
							workspacesActivelyTrialingAllTime: 1,
							workspacesNewlySubscribed: 1,
							workspacesWithActiveSubscriptions: 1,
							workspacesWithSuccessfulTrials: 1,
							revenueUsd: 'value',
						},
					],
				},
			],
		};
		respondWith(200, expected);

		const result = await Analytics.listPacks(ctx, {
			packIds: [1],
			workspaceId: 'ws-1Ab234',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/analytics/packs?packIds=1&workspaceId=ws-1Ab234',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.analyticsListPacks.parse(result)).toEqual(
			expected,
		);
	});

	it('analytics.getPacksSummary sends GET /analytics/packs/summary', async () => {
		const expected = {
			totalDocInstalls: 1,
			totalWorkspaceInstalls: 1,
			totalInvocations: 1,
		};
		respondWith(200, expected);

		const result = await Analytics.getPacksSummary(ctx, {
			packIds: [1],
			workspaceId: 'ws-1Ab234',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/analytics/packs/summary?packIds=1&workspaceId=ws-1Ab234',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.analyticsGetPacksSummary.parse(result),
		).toEqual(expected);
	});

	it('analytics.listPackFormulas sends GET /analytics/packs/{packId}/formulas', async () => {
		const expected = {
			items: [
				{
					formula: {
						name: 'SquareRoot',
						type: 'action',
					},
					metrics: [
						{
							date: '2020-09-02',
							formulaInvocations: 123,
							errors: 5,
							docsActivelyUsing: 50,
							docsActivelyUsing7Day: 100,
							docsActivelyUsing30Day: 200,
							docsActivelyUsing90Day: 300,
							docsActivelyUsingAllTime: 500,
							workspacesActivelyUsing: 10,
							workspacesActivelyUsing7Day: 15,
							workspacesActivelyUsing30Day: 20,
							workspacesActivelyUsing90Day: 30,
							workspacesActivelyUsingAllTime: 50,
						},
					],
				},
			],
		};
		respondWith(200, expected);

		const result = await Analytics.listPackFormulas(ctx, {
			packId: 123,
			packFormulaNames: ['value'],
			packFormulaTypes: ['action'],
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/analytics/packs/123/formulas?packFormulaNames=value&packFormulaTypes=action',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.analyticsListPackFormulas.parse(result),
		).toEqual(expected);
	});

	it('analytics.getLastUpdated sends GET /analytics/updated', async () => {
		const expected = {
			docAnalyticsLastUpdated: '2022-05-01',
			packAnalyticsLastUpdated: '2022-05-01',
			packFormulaAnalyticsLastUpdated: '2022-05-01',
		};
		respondWith(200, expected);

		const result = await Analytics.getLastUpdated(ctx, {});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/analytics/updated',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.analyticsGetLastUpdated.parse(result),
		).toEqual(expected);
	});

	it('workspaces.listUsers sends GET /workspaces/{workspaceId}/users', async () => {
		const expected = {
			items: [
				{
					email: 'hello@example.com',
					name: 'Sally Jane',
					role: 'Admin',
					registeredAt: '2018-04-11T00:18:57.946Z',
				},
			],
		};
		respondWith(200, expected);

		const result = await Workspaces.listUsers(ctx, {
			workspaceId: 'ws-1Ab234',
			includedRoles: ['Admin'],
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/workspaces/ws-1Ab234/users?includedRoles=Admin&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.workspacesListUsers.parse(result)).toEqual(
			expected,
		);
	});

	it('workspaces.listRoles sends GET /workspaces/{workspaceId}/roles', async () => {
		const expected = {
			items: [
				{
					month: '2020-09-15',
					activeAdminCount: 2,
					activeDocMakerCount: 2,
					activeEditorCount: 2,
					inactiveAdminCount: 2,
					inactiveDocMakerCount: 2,
					inactiveEditorCount: 2,
				},
			],
		};
		respondWith(200, expected);

		const result = await Workspaces.listRoles(ctx, {
			workspaceId: 'ws-1Ab234',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/workspaces/ws-1Ab234/roles',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.workspacesListRoles.parse(result)).toEqual(
			expected,
		);
	});

	it('workspaces.changeUserRole sends POST /workspaces/{workspaceId}/users/role', async () => {
		const expected = {
			roleChangedAt: '2018-04-11T00:18:57.946Z',
		};
		respondWith(200, expected);

		const result = await Workspaces.changeUserRole(ctx, {
			workspaceId: 'ws-1Ab234',
			email: 'hello@example.com',
			newRole: 'Admin',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/workspaces/ws-1Ab234/users/role',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				email: 'hello@example.com',
				newRole: 'Admin',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.workspacesChangeUserRole.parse(result),
		).toEqual(expected);
	});

	it('packs.list sends GET /packs', async () => {
		const expected = {
			items: [
				{
					id: 1003,
					name: 'Cool Geometry Formulas',
					description:
						'This Pack allows users to calculate the surface area and volume of a few common 3D shapes, like cubes and pyramids.',
					shortDescription:
						'Calculate cool geometric formulas like surface area.',
					workspaceId: 'ws-asdf',
					categories: [
						{
							categoryId: 'aBCdEFg',
							categoryName: 'Project management',
						},
					],
				},
			],
		};
		respondWith(200, expected);

		const result = await Packs.list(ctx, {
			accessType: 'edit',
			accessTypes: ['none'],
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs?accessType=edit&accessTypes=none',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.packs.upsertByEntityId.mock.calls).toEqual(
			expected.items.map((item) => [String(item.id), item]),
		);
		expect(CodaEndpointOutputSchemas.packsList.parse(result)).toEqual(expected);
	});

	it('packs.get sends GET /packs/{packId}', async () => {
		const expected = {
			id: 1003,
			name: 'Cool Geometry Formulas',
			description:
				'This Pack allows users to calculate the surface area and volume of a few common 3D shapes, like cubes and pyramids.',
			shortDescription: 'Calculate cool geometric formulas like surface area.',
			workspaceId: 'ws-asdf',
			categories: [
				{
					categoryId: 'aBCdEFg',
					categoryName: 'Project management',
				},
			],
		};
		respondWith(200, expected);

		const result = await Packs.get(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(db.packs.upsertByEntityId.mock.calls).toEqual([
			[String(expected.id), expected],
		]);
		expect(CodaEndpointOutputSchemas.packsGet.parse(result)).toEqual(expected);
	});

	it('packs.create sends POST /packs', async () => {
		const expected = {
			packId: 123,
		};
		respondWith(200, expected);

		const result = await Packs.create(ctx, {
			workspaceId: 'ws-asdf',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				workspaceId: 'ws-asdf',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packsCreate.parse(result)).toEqual(
			expected,
		);
	});

	it('packs.update sends PATCH /packs/{packId}', async () => {
		const expected = {
			id: 1003,
			name: 'Cool Geometry Formulas',
			description:
				'This Pack allows users to calculate the surface area and volume of a few common 3D shapes, like cubes and pyramids.',
			shortDescription: 'Calculate cool geometric formulas like surface area.',
			workspaceId: 'ws-asdf',
			categories: [
				{
					categoryId: 'aBCdEFg',
					categoryName: 'Project management',
				},
			],
		};
		respondWith(200, expected);

		const result = await Packs.update(ctx, {
			packId: 123,
			overallRateLimit: {
				intervalSeconds: 3600,
				operationsPerInterval: 20,
			},
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123',
			method: 'PATCH',
			auth: 'Bearer test-api-key',
			body: {
				overallRateLimit: {
					intervalSeconds: 3600,
					operationsPerInterval: 20,
				},
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packsUpdate.parse(result)).toEqual(
			expected,
		);
	});

	it('packs.delete sends DELETE /packs/{packId}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await Packs.delete(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packsDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('packs.getConfigurationSchema sends GET /packs/{packId}/configurations/schema', async () => {
		const expected = {
			message: 'hello',
		};
		respondWith(200, expected);

		const result = await Packs.getConfigurationSchema(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/configurations/schema',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packsGetConfigurationSchema.parse(result),
		).toEqual(expected);
	});

	it('packVersions.list sends GET /packs/{packId}/versions', async () => {
		const expected = {
			items: [
				{
					packId: 1003,
					buildNotes: 'Adding a new formula.',
					createdAt: '2018-04-11T00:18:57.946Z',
					creationUserLoginId: 'api@example.com',
					packVersion: '1.0.3',
				},
			],
			creationUsers: [
				{
					name: 'John Doe',
					loginId: 'user@example.com',
					type: 'user',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackVersions.list(ctx, {
			packId: 123,
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/versions?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packVersionsList.parse(result)).toEqual(
			expected,
		);
	});

	it('packVersions.getNext sends POST /packs/{packId}/nextVersion', async () => {
		const expected = {
			nextVersion: '2.1.0',
			findings: ['value'],
			findingDetails: [
				{
					finding: 'value',
					path: 'value',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackVersions.getNext(ctx, {
			packId: 123,
			proposedMetadata:
				'{"formulas": [{"description": "my formula", "name": "foo", "parameters": [], "resultType": 0}]}',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/nextVersion',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				proposedMetadata:
					'{"formulas": [{"description": "my formula", "name": "foo", "parameters": [], "resultType": 0}]}',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packVersionsGetNext.parse(result)).toEqual(
			expected,
		);
	});

	it('packVersions.getDiff sends GET /packs/{packId}/versions/{basePackVersion}/diff/{targetPackVersion}', async () => {
		const expected = {
			findings: ['value'],
			findingDetails: [
				{
					finding: 'value',
					path: 'value',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackVersions.getDiff(ctx, {
			packId: 123,
			basePackVersion: '1.2.3',
			targetPackVersion: '1.2.3',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/versions/1.2.3/diff/1.2.3',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packVersionsGetDiff.parse(result)).toEqual(
			expected,
		);
	});

	it('packVersions.register sends POST /packs/{packId}/versions/{packVersion}/register', async () => {
		const expected = {
			uploadUrl:
				'https://coda-us-west-2-prod-packs-upload.s3.amazonaws.com/packs/123/versions/1.0.0',
			headers: {
				key: 'value',
			},
		};
		respondWith(200, expected);

		const result = await PackVersions.register(ctx, {
			packId: 123,
			packVersion: '1.2.3',
			bundleHash:
				'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/versions/1.2.3/register',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				bundleHash:
					'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packVersionsRegister.parse(result),
		).toEqual(expected);
	});

	it('packVersions.uploadComplete sends POST /packs/{packId}/versions/{packVersion}/uploadComplete', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackVersions.uploadComplete(ctx, {
			packId: 123,
			packVersion: '1.2.3',
			notes: 'Adding a new formula HelloWorld.',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/versions/1.2.3/uploadComplete',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				notes: 'Adding a new formula HelloWorld.',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packVersionsUploadComplete.parse(result),
		).toEqual(expected);
	});

	it('packVersions.uploadSourceCode sends POST /packs/{packId}/uploadSourceCode', async () => {
		const expected = {
			uploadUrl:
				'https://coda-us-west-2-prod-packs-upload.s3-accelerate.amazonaws.com/packUploads/123/1/main.ts',
			uploadedPathName: '/packs/123/versions/1/sourceCode/uploadComplete',
			headers: {
				key: 'value',
			},
		};
		respondWith(200, expected);

		const result = await PackVersions.uploadSourceCode(ctx, {
			packId: 123,
			payloadHash:
				'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
			filename: 'main.ts',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/uploadSourceCode',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				payloadHash:
					'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
				filename: 'main.ts',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packVersionsUploadSourceCode.parse(result),
		).toEqual(expected);
	});

	it('packVersions.sourceCodeUploadComplete sends POST /packs/{packId}/versions/{packVersion}/sourceCode/uploadComplete', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
		};
		respondWith(200, expected);

		const result = await PackVersions.sourceCodeUploadComplete(ctx, {
			packId: 123,
			packVersion: '1.2.3',
			filename: 'main.ts',
			codeHash: 'value',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/versions/1.2.3/sourceCode/uploadComplete',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				filename: 'main.ts',
				codeHash: 'value',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packVersionsSourceCodeUploadComplete.parse(
				result,
			),
		).toEqual(expected);
	});

	it('packVersions.getSourceCode sends GET /packs/{packId}/versions/{packVersion}/sourceCode', async () => {
		const expected = {
			files: [
				{
					filename: 'main.ts',
					url: 'https://coda-us-west-2-prod-packs.s3.us-west-2.amazonaws.com/packs/123/1/main.ts',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackVersions.getSourceCode(ctx, {
			packId: 123,
			packVersion: '1.2.3',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/versions/1.2.3/sourceCode',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packVersionsGetSourceCode.parse(result),
		).toEqual(expected);
	});

	it('packReleases.list sends GET /packs/{packId}/releases', async () => {
		const expected = {
			items: [
				{
					packId: 1003,
					releaseId: 2,
					releaseNotes: 'The first release.',
					createdAt: '2018-04-11T00:18:57.946Z',
					packVersion: '1.0.3',
					sdkVersion: '1.5.1',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackReleases.list(ctx, {
			packId: 123,
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/releases?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packReleasesList.parse(result)).toEqual(
			expected,
		);
	});

	it('packReleases.create sends POST /packs/{packId}/releases', async () => {
		const expected = {
			packId: 1003,
			releaseId: 2,
			releaseNotes: 'The first release.',
			createdAt: '2018-04-11T00:18:57.946Z',
			packVersion: '1.0.3',
			sdkVersion: '1.5.1',
		};
		respondWith(200, expected);

		const result = await PackReleases.create(ctx, {
			packId: 123,
			packVersion: '1.0.0',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/releases',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				packVersion: '1.0.0',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packReleasesCreate.parse(result)).toEqual(
			expected,
		);
	});

	it('packReleases.update sends PUT /packs/{packId}/releases/{packReleaseId}', async () => {
		const expected = {
			packId: 1003,
			releaseId: 2,
			releaseNotes: 'The first release.',
			createdAt: '2018-04-11T00:18:57.946Z',
			packVersion: '1.0.3',
			sdkVersion: '1.5.1',
		};
		respondWith(200, expected);

		const result = await PackReleases.update(ctx, {
			packId: 123,
			packReleaseId: 2,
			releaseNotes: 'The first release.',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/releases/2',
			method: 'PUT',
			auth: 'Bearer test-api-key',
			body: {
				releaseNotes: 'The first release.',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packReleasesUpdate.parse(result)).toEqual(
			expected,
		);
	});

	it('packAssets.upload sends POST /packs/{packId}/uploadAsset', async () => {
		const expected = {
			uploadUrl:
				'https://coda-us-west-2-prod-blobs-upload.s3-accelerate.amazonaws.com/packs/123/assets/logo/e23fcb5e564f08b71183d424c2c380c0',
			packAssetUploadedPathName:
				'/packs/123/assets/e23fcb5e564f08b71183d424c2c380c0',
			headers: {
				key: 'value',
			},
		};
		respondWith(200, expected);

		const result = await PackAssets.upload(ctx, {
			packId: 123,
			packAssetType: 'logo',
			imageHash:
				'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
			mimeType: 'image/jpeg',
			filename: 'image.jpg',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/uploadAsset',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				packAssetType: 'logo',
				imageHash:
					'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
				mimeType: 'image/jpeg',
				filename: 'image.jpg',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packAssetsUpload.parse(result)).toEqual(
			expected,
		);
	});

	it('packAssets.uploadComplete sends POST /packs/{packId}/assets/{packAssetId}/assetType/{packAssetType}/uploadComplete', async () => {
		const expected = {
			requestId: 'abc-123-def-456',
			assetId: 'e23fcb5e564f08b71183d424c2c380c0',
		};
		respondWith(200, expected);

		const result = await PackAssets.uploadComplete(ctx, {
			packId: 123,
			packAssetId: 'value',
			packAssetType: 'logo',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/assets/value/assetType/logo/uploadComplete',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packAssetsUploadComplete.parse(result),
		).toEqual(expected);
	});

	it('packListings.list sends GET /packs/listings', async () => {
		const expected = {
			items: [
				{
					packId: 1003,
					packVersion: '1.0.3',
					name: 'Cool Geometry Formulas',
					shortDescription:
						'Calculate cool geometric formulas like surface area.',
					description:
						'This Pack allows users to calculate the surface area and volume of a few common 3D shapes, like cubes and pyramids.',
					logoUrl: 'value',
					logo: {
						filename: 'value',
						imageUrl: 'value',
						assetId: 'value',
					},
					externalMetadataUrl:
						'https://codahosted.io/packs/12345/1.2.3/metadata/0c892064aa5cb.json',
					categories: [
						{
							categoryId: 'aBCdEFg',
							categoryName: 'Project management',
						},
					],
					makers: [
						{
							name: 'John Doe',
						},
					],
					sdkVersion: '1.5.1',
					packCategoryType: 'connector',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackListings.list(ctx, {
			packAccessTypes: ['none'],
			packIds: [1],
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/listings?packAccessTypes=none&packIds=1',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packListingsList.parse(result)).toEqual(
			expected,
		);
	});

	it('packListings.get sends GET /packs/{packId}/listing', async () => {
		const expected = {
			packId: 1003,
			packVersion: '1.0.3',
			name: 'Cool Geometry Formulas',
			shortDescription: 'Calculate cool geometric formulas like surface area.',
			description:
				'This Pack allows users to calculate the surface area and volume of a few common 3D shapes, like cubes and pyramids.',
			logoUrl: 'value',
			logo: {
				filename: 'value',
				imageUrl: 'value',
				assetId: 'value',
			},
			discoverability: 'public',
			categories: [
				{
					categoryId: 'aBCdEFg',
					categoryName: 'Project management',
				},
			],
			makers: [
				{
					name: 'John Doe',
				},
			],
			userAccess: {
				canEdit: true,
				canTest: true,
				canView: true,
				canInstall: true,
				canPurchase: true,
				requiresTrial: true,
				canConnectAccount: true,
			},
			externalMetadataUrl:
				'https://codahosted.io/packs/12345/1.2.3/metadata/0c892064aa5cb.json',
			sdkVersion: '1.5.1',
			packCategoryType: 'connector',
		};
		respondWith(200, expected);

		const result = await PackListings.get(ctx, {
			packId: 123,
			workspaceId: 'ws-1Ab234',
			docId: 'fleHfrkw3L',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/listing?workspaceId=ws-1Ab234&docId=fleHfrkw3L',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packListingsGet.parse(result)).toEqual(
			expected,
		);
	});

	it('packListings.deleteDraft sends DELETE /packs/{packId}/listingDraft', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackListings.deleteDraft(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/listingDraft',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packListingsDeleteDraft.parse(result),
		).toEqual(expected);
	});

	it('packPermissions.list sends GET /packs/{packId}/permissions', async () => {
		const expected = {
			items: [
				{
					id: 'value',
					principal: {
						type: 'user',
						email: 'value',
					},
					access: 'none',
				},
			],
			permissionUsers: [
				{
					name: 'John Doe',
					loginId: 'user@example.com',
					type: 'user',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackPermissions.list(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/permissions',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packPermissionsList.parse(result)).toEqual(
			expected,
		);
	});

	it('packPermissions.add sends POST /packs/{packId}/permissions', async () => {
		const expected = {
			permissionId: 'value',
		};
		respondWith(200, expected);

		const result = await PackPermissions.add(ctx, {
			packId: 123,
			principal: {
				type: 'user',
				email: 'value',
			},
			access: 'none',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/permissions',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				principal: {
					type: 'user',
					email: 'value',
				},
				access: 'none',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packPermissionsAdd.parse(result)).toEqual(
			expected,
		);
	});

	it('packPermissions.delete sends DELETE /packs/{packId}/permissions/{permissionId}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackPermissions.delete(ctx, {
			packId: 123,
			permissionId: 'AbCDeFGH',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/permissions/AbCDeFGH',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packPermissionsDelete.parse(result),
		).toEqual(expected);
	});

	it('packInvitations.listForUser sends GET /packs/invitations', async () => {
		const expected = {
			items: [
				{
					invitation: {
						invitationId: '550e8400-e29b-41d4-a716-446655440000',
						packId: 123,
						inviteeEmail: 'user@example.com',
						inviterUserId: 456,
						access: 'none',
						createdAt: 'value',
						expiresAt: 'value',
					},
					pack: {
						id: 1003,
						name: 'Cool Geometry Formulas',
						description:
							'This Pack allows users to calculate the surface area and volume of a few common 3D shapes, like cubes and pyramids.',
						shortDescription:
							'Calculate cool geometric formulas like surface area.',
						workspaceId: 'ws-asdf',
						categories: [
							{
								categoryId: 'aBCdEFg',
								categoryName: 'Project management',
							},
						],
					},
					makers: [
						{
							name: 'John Doe',
							loginId: 'user@example.com',
						},
					],
					networkDomains: ['value'],
				},
			],
		};
		respondWith(200, expected);

		const result = await PackInvitations.listForUser(ctx, {
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/invitations?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packInvitationsListForUser.parse(result),
		).toEqual(expected);
	});

	it('packInvitations.create sends POST /packs/{packId}/invitations', async () => {
		const expected = {
			invitationId: '550e8400-e29b-41d4-a716-446655440000',
		};
		respondWith(200, expected);

		const result = await PackInvitations.create(ctx, {
			packId: 123,
			email: 'user@example.com',
			access: 'none',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/invitations',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				email: 'user@example.com',
				access: 'none',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packInvitationsCreate.parse(result),
		).toEqual(expected);
	});

	it('packMakers.list sends GET /packs/{packId}/makers', async () => {
		const expected = {
			makers: [
				{
					name: 'John Doe',
					loginId: 'user@example.com',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackMakers.list(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/makers',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packMakersList.parse(result)).toEqual(
			expected,
		);
	});

	it('packMakers.add sends POST /packs/{packId}/maker', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackMakers.add(ctx, {
			packId: 123,
			loginId: 'api@example.com',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/maker',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				loginId: 'api@example.com',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packMakersAdd.parse(result)).toEqual(
			expected,
		);
	});

	it('packMakers.delete sends DELETE /packs/{packId}/maker/{loginId}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackMakers.delete(ctx, {
			packId: 123,
			loginId: 'api@example.com',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/maker/api%40example.com',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packMakersDelete.parse(result)).toEqual(
			expected,
		);
	});

	it('packCategories.list sends GET /packs/{packId}/categories', async () => {
		const expected = {
			categories: [
				{
					categoryId: 'aBCdEFg',
					categoryName: 'Project management',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackCategories.list(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/categories',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packCategoriesList.parse(result)).toEqual(
			expected,
		);
	});

	it('packCategories.add sends POST /packs/{packId}/category', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackCategories.add(ctx, {
			packId: 123,
			categoryName: 'Project management',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/category',
			method: 'POST',
			auth: 'Bearer test-api-key',
			body: {
				categoryName: 'Project management',
			},
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packCategoriesAdd.parse(result)).toEqual(
			expected,
		);
	});

	it('packCategories.delete sends DELETE /packs/{packId}/category/{categoryName}', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackCategories.delete(ctx, {
			packId: 123,
			categoryName: 'Project management',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/category/Project%20management',
			method: 'DELETE',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packCategoriesDelete.parse(result),
		).toEqual(expected);
	});

	it('packFeaturedDocs.list sends GET /packs/{packId}/featuredDocs', async () => {
		const expected = {
			items: [
				{
					doc: {
						id: 'AbCDeFGH',
						type: 'doc',
						browserLink: 'https://docs.superhuman.com/d/_dAbCDeFGH',
						href: 'https://docs.superhuman.com/apis/v1/docs/AbCDeFGH',
					},
					isPinned: true,
				},
			],
		};
		respondWith(200, expected);

		const result = await PackFeaturedDocs.list(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/featuredDocs',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packFeaturedDocsList.parse(result),
		).toEqual(expected);
	});

	it('packFeaturedDocs.update sends PUT /packs/{packId}/featuredDocs', async () => {
		const expected = {};
		respondWith(200, expected);

		const result = await PackFeaturedDocs.update(ctx, {
			packId: 123,
			items: [
				{
					url: 'value',
				},
			],
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/featuredDocs',
			method: 'PUT',
			auth: 'Bearer test-api-key',
			body: {
				items: [
					{
						url: 'value',
					},
				],
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packFeaturedDocsUpdate.parse(result),
		).toEqual(expected);
	});

	it('packConnections.getOauthConfig sends GET /packs/{packId}/oauthConfig', async () => {
		const expected = {
			maskedClientId: 'value',
			maskedClientSecret: 'value',
			authorizationUrl: 'value',
			tokenUrl: 'value',
			redirectUri: 'value',
		};
		respondWith(200, expected);

		const result = await PackConnections.getOauthConfig(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/oauthConfig',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packConnectionsGetOauthConfig.parse(result),
		).toEqual(expected);
	});

	it('packConnections.setOauthConfig sends PUT /packs/{packId}/oauthConfig', async () => {
		const expected = {
			maskedClientId: 'value',
			maskedClientSecret: 'value',
			authorizationUrl: 'value',
			tokenUrl: 'value',
			redirectUri: 'value',
		};
		respondWith(200, expected);

		const result = await PackConnections.setOauthConfig(ctx, {
			packId: 123,
			clientId: 'value',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/oauthConfig',
			method: 'PUT',
			auth: 'Bearer test-api-key',
			body: {
				clientId: 'value',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packConnectionsSetOauthConfig.parse(result),
		).toEqual(expected);
	});

	it('packConnections.getSystemConnection sends GET /packs/{packId}/systemConnection', async () => {
		const expected = {
			type: 'header',
			headerName: 'value',
			tokenPrefix: 'value',
		};
		respondWith(200, expected);

		const result = await PackConnections.getSystemConnection(ctx, {
			packId: 123,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/systemConnection',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packConnectionsGetSystemConnection.parse(
				result,
			),
		).toEqual(expected);
	});

	it('packConnections.setSystemConnection sends PUT /packs/{packId}/systemConnection', async () => {
		const expected = {
			type: 'header',
			headerName: 'value',
			tokenPrefix: 'value',
		};
		respondWith(200, expected);

		const result = await PackConnections.setSystemConnection(ctx, {
			packId: 123,
			credentials: {
				type: 'header',
				token: 'value',
			},
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/systemConnection',
			method: 'PUT',
			auth: 'Bearer test-api-key',
			body: {
				credentials: {
					type: 'header',
					token: 'value',
				},
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packConnectionsSetSystemConnection.parse(
				result,
			),
		).toEqual(expected);
	});

	it('packConnections.patchSystemConnection sends PATCH /packs/{packId}/systemConnection', async () => {
		const expected = {
			type: 'header',
			headerName: 'value',
			tokenPrefix: 'value',
		};
		respondWith(200, expected);

		const result = await PackConnections.patchSystemConnection(ctx, {
			packId: 123,
			body: {
				type: 'header',
			},
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/systemConnection',
			method: 'PATCH',
			auth: 'Bearer test-api-key',
			body: {
				type: 'header',
			},
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packConnectionsPatchSystemConnection.parse(
				result,
			),
		).toEqual(expected);
	});

	it('packLogs.list sends GET /packs/{packId}/docs/{docId}/logs', async () => {
		const expected = {
			items: [
				{
					type: 'custom',
					context: {
						logId: 'value',
						docId: 'value',
						createdAt: '2018-04-11T00:18:57.946Z',
						packId: 'value',
						packVersion: 'value',
						formulaName: 'value',
						userId: 'value',
						connectionId: 'value',
						requestId: 'value',
						requestType: 'unknown',
						detailsKey: 'value',
					},
					message: 'The formula is called!',
					level: 'error',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackLogs.list(ctx, {
			packId: 123,
			docId: 'AbCDeFGH',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/docs/AbCDeFGH/logs?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packLogsList.parse(result)).toEqual(
			expected,
		);
	});

	it('packLogs.listGrouped sends GET /packs/{packId}/docs/{docId}/groupedLogs', async () => {
		const expected = {
			items: [
				{
					type: 'invocation',
					invocationLog: {
						type: 'invocation',
						context: {
							logId: 'value',
							docId: 'value',
							createdAt: '2018-04-11T00:18:57.946Z',
							packId: 'value',
							packVersion: 'value',
							formulaName: 'value',
							userId: 'value',
							connectionId: 'value',
							requestId: 'value',
							requestType: 'unknown',
							detailsKey: 'value',
						},
					},
					relatedLogs: [
						{
							type: 'custom',
							context: {
								logId: 'value',
								docId: 'value',
								createdAt: '2018-04-11T00:18:57.946Z',
								packId: 'value',
								packVersion: 'value',
								formulaName: 'value',
								userId: 'value',
								connectionId: 'value',
								requestId: 'value',
								requestType: 'unknown',
								detailsKey: 'value',
							},
							message: 'The formula is called!',
							level: 'error',
						},
					],
				},
			],
			incompleteRelatedLogs: true,
		};
		respondWith(200, expected);

		const result = await PackLogs.listGrouped(ctx, {
			packId: 123,
			docId: 'AbCDeFGH',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/docs/AbCDeFGH/groupedLogs?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packLogsListGrouped.parse(result)).toEqual(
			expected,
		);
	});

	it('packLogs.listIngestion sends GET /packs/{packId}/tenantId/{tenantId}/rootIngestionId/{rootIngestionId}/logs', async () => {
		const expected = {
			items: [
				{
					type: 'custom',
					context: {
						logId: 'value',
						docId: 'value',
						createdAt: '2018-04-11T00:18:57.946Z',
						packId: 'value',
						packVersion: 'value',
						formulaName: 'value',
						userId: 'value',
						connectionId: 'value',
						requestId: 'value',
						requestType: 'unknown',
						detailsKey: 'value',
					},
					message: 'The formula is called!',
					level: 'error',
				},
			],
		};
		respondWith(200, expected);

		const result = await PackLogs.listIngestion(ctx, {
			packId: 123,
			tenantId: 'org-LxmbD9y2EU',
			rootIngestionId: 'a4e293c4-4a85-45a4-b2ba-7f305cba2703',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/tenantId/org-LxmbD9y2EU/rootIngestionId/a4e293c4-4a85-45a4-b2ba-7f305cba2703/logs?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packLogsListIngestion.parse(result),
		).toEqual(expected);
	});

	it('packLogs.listGroupedIngestion sends GET /packs/{packId}/tenantId/{tenantId}/rootIngestionId/{rootIngestionId}/groupedLogs', async () => {
		const expected = {
			items: [
				{
					type: 'invocation',
					invocationLog: {
						type: 'invocation',
						context: {
							logId: 'value',
							docId: 'value',
							createdAt: '2018-04-11T00:18:57.946Z',
							packId: 'value',
							packVersion: 'value',
							formulaName: 'value',
							userId: 'value',
							connectionId: 'value',
							requestId: 'value',
							requestType: 'unknown',
							detailsKey: 'value',
						},
					},
					relatedLogs: [
						{
							type: 'custom',
							context: {
								logId: 'value',
								docId: 'value',
								createdAt: '2018-04-11T00:18:57.946Z',
								packId: 'value',
								packVersion: 'value',
								formulaName: 'value',
								userId: 'value',
								connectionId: 'value',
								requestId: 'value',
								requestType: 'unknown',
								detailsKey: 'value',
							},
							message: 'The formula is called!',
							level: 'error',
						},
					],
				},
			],
			incompleteRelatedLogs: true,
		};
		respondWith(200, expected);

		const result = await PackLogs.listGroupedIngestion(ctx, {
			packId: 123,
			tenantId: 'org-LxmbD9y2EU',
			rootIngestionId: 'a4e293c4-4a85-45a4-b2ba-7f305cba2703',
			limit: 10,
			pageToken: 'eyJsaW1pd',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/tenantId/org-LxmbD9y2EU/rootIngestionId/a4e293c4-4a85-45a4-b2ba-7f305cba2703/groupedLogs?limit=10&pageToken=eyJsaW1pd',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packLogsListGroupedIngestion.parse(result),
		).toEqual(expected);
	});

	it('packLogs.listIngestionExecutions sends GET /packs/{packId}/tenantId/{tenantId}/rootIngestionId/{rootIngestionId}/ingestionBatchExecutions', async () => {
		const expected = {
			items: [
				{
					completionTimestamp: 1,
					creationTimestamp: 1,
					executionType: 'FULL',
					fullExecutionId: 'value',
					ingestionExecutionId: 'value',
					ingestionId: 'value',
					ingestionName: 'value',
					startTimestamp: 1,
				},
			],
		};
		respondWith(200, expected);

		const result = await PackLogs.listIngestionExecutions(ctx, {
			packId: 123,
			tenantId: 'org-LxmbD9y2EU',
			rootIngestionId: 'a4e293c4-4a85-45a4-b2ba-7f305cba2703',
			pageToken: 'eyJsaW1pd',
			limit: 10,
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/tenantId/org-LxmbD9y2EU/rootIngestionId/a4e293c4-4a85-45a4-b2ba-7f305cba2703/ingestionBatchExecutions?pageToken=eyJsaW1pd&limit=10',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(
			CodaEndpointOutputSchemas.packLogsListIngestionExecutions.parse(result),
		).toEqual(expected);
	});

	it('packLogs.getDetails sends GET /packs/{packId}/tenantId/{tenantId}/rootIngestionId/{rootIngestionId}/logs/{logId}', async () => {
		const expected = {
			type: 'fetcher',
			request: 'value',
		};
		respondWith(200, expected);

		const result = await PackLogs.getDetails(ctx, {
			packId: 123,
			tenantId: 'org-LxmbD9y2EU',
			rootIngestionId: 'a4e293c4-4a85-45a4-b2ba-7f305cba2703',
			logId: 'value',
			detailsKey: 'value',
		});

		expect(sentRequest()).toEqual({
			url: 'https://coda.io/apis/v1/packs/123/tenantId/org-LxmbD9y2EU/rootIngestionId/a4e293c4-4a85-45a4-b2ba-7f305cba2703/logs/value?detailsKey=value',
			method: 'GET',
			auth: 'Bearer test-api-key',
			body: undefined,
		});
		expect(result).toEqual(expected);
		expect(CodaEndpointOutputSchemas.packLogsGetDetails.parse(result)).toEqual(
			expected,
		);
	});

	it('rejects with the 401 status and is not retried by the auth handler', async () => {
		respondWith(401, {
			statusCode: 401,
			statusMessage: 'Unauthorized',
			message: 'Unauthorized',
		});

		const error = await failure(Docs.list(ctx, {}));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 401 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('surfaces Retry-After from a 429 to the rate limit handler', async () => {
		jest.useFakeTimers();
		try {
			fetchMock.mockImplementation(
				async () =>
					new Response(
						JSON.stringify({ statusCode: 429, message: 'Rate limit exceeded' }),
						{
							status: 429,
							headers: {
								'Content-Type': 'application/json',
								'Retry-After': '3',
							},
						},
					),
			);

			const pending = failure(Docs.list(ctx, {}));
			await jest.runAllTimersAsync();
			const error = await pending;

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 429, retryAfter: 3000 });
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(error),
			).resolves.toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 3000,
			});
		} finally {
			jest.useRealTimers();
		}
	});
});
