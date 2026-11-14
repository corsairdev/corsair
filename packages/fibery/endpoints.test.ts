import { getOAuthAccessToken, logEventFromContext } from 'corsair/core';
import {
	makeFiberyBinaryRequest,
	makeFiberyCommand,
	makeFiberyFileUpload,
	makeFiberyJsonRpc,
	makeFiberyRequest,
} from './client';
import * as operations from './endpoints/operations';
import type { FiberyJson } from './endpoints/types';
import type {
	FiberyContext,
	FiberyKeyBuilderContext,
	FiberyPluginOptions,
} from './index';
import { fibery } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		getOAuthAccessToken: jest.fn(async () => 'fresh-fibery-oauth-token'),
		logEventFromContext: jest.fn(),
	};
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeFiberyBinaryRequest: jest.fn(),
		makeFiberyCommand: jest.fn(),
		makeFiberyFileUpload: jest.fn(),
		makeFiberyJsonRpc: jest.fn(),
		makeFiberyRequest: jest.fn(),
	};
});

const mockCommand = jest.mocked(makeFiberyCommand);
const mockJsonRpc = jest.mocked(makeFiberyJsonRpc);
const mockRequest = jest.mocked(makeFiberyRequest);
const mockBinary = jest.mocked(makeFiberyBinaryRequest);
const mockUpload = jest.mocked(makeFiberyFileUpload);
const mockLog = jest.mocked(logEventFromContext);
const mockOAuthAccessToken = jest.mocked(getOAuthAccessToken);
const id = '019dcf9a-c5ab-7292-9bdb-8956eea1b532';
const otherId = '019dcf9a-c294-71cc-b740-ccdbd5722322';
const url = 'https://acme.fibery.io';
const options = { workspaceUrl: url, authType: 'api_key' as const };

const ctx: FiberyContext = {
	endpoints: {},
	db: {},
	$getAccountId: async () => 'fibery-test-account',
	key: 'fibery-test-token',
	options: { workspaceUrl: url, authType: 'api_key' },
	keys: {
		get_dek: async () => 'dek',
		issue_new_dek: async () => 'dek',
		get_api_key: async () => 'fibery-test-token',
		set_api_key: async () => undefined,
		get_access_token: async () => 'fibery-oauth-token',
		set_access_token: async () => undefined,
		get_refresh_token: async () => null,
		set_refresh_token: async () => undefined,
		get_expires_at: async () => null,
		set_expires_at: async () => undefined,
		get_scope: async () => null,
		set_scope: async () => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => undefined,
		get_integration_credentials: async () => ({
			client_id: null,
			client_secret: null,
			redirect_url: null,
		}),
	},
};

const oauthKeyBuilderContext: FiberyKeyBuilderContext = {
	authType: 'oauth_2',
	options: { workspaceUrl: url, authType: 'oauth_2' },
	tenantId: 'fibery-oauth-tenant',
	keys: {
		get_dek: async () => 'dek',
		issue_new_dek: async () => 'dek',
		get_access_token: async () => 'expired-token',
		set_access_token: async () => undefined,
		get_refresh_token: async () => 'refresh-token',
		set_refresh_token: async () => undefined,
		get_expires_at: async () => '2000-01-01T00:00:00.000Z',
		set_expires_at: async () => undefined,
		get_scope: async () => 'openid offline',
		set_scope: async () => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => undefined,
		get_integration_credentials: async () => ({
			client_id: 'fibery-client-id',
			client_secret: 'fibery-client-secret',
			redirect_url: 'https://app.invalid.test/oauth/callback',
		}),
	},
};

type RouteCase = {
	name: string;
	run: () => Promise<FiberyJson>;
	transport: 'command' | 'request' | 'rpc' | 'binary' | 'upload';
	path: string;
	method?: string;
	payload?: FiberyJson;
	query?: FiberyJson;
	response: FiberyJson;
};

const fileInfo = {
	'fibery/id': id,
	'fibery/name': 'note.txt',
	'fibery/content-type': 'text/plain',
	'fibery/secret': id,
	'fibery/content-length': 5,
	'fibery/rank': 0,
};

const cases: RouteCase[] = [
	{
		name: 'schema query',
		run: () => operations.schemaQuery(ctx, {}),
		transport: 'command',
		path: 'fibery.schema/query',
		payload: {},
		response: {},
	},
	{
		name: 'database create',
		run: () =>
			operations.databaseCreate(ctx, {
				database: { 'fibery/name': 'CRM/Lead' },
			}),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{ command: 'schema.type/create', args: { 'fibery/name': 'CRM/Lead' } },
			],
		},
		response: null,
	},
	{
		name: 'database rename',
		run: () =>
			operations.databaseRename(ctx, {
				fromName: 'CRM/Lead',
				toName: 'CRM/Prospect',
			}),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{
					command: 'schema.type/rename',
					args: { 'from-name': 'CRM/Lead', 'to-name': 'CRM/Prospect' },
				},
			],
		},
		response: null,
	},
	{
		name: 'database delete',
		run: () => operations.databaseDelete(ctx, { name: 'CRM/Lead' }),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{
					command: 'schema.type/delete',
					args: {
						name: 'CRM/Lead',
						'delete-entities?': false,
						'delete-related-fields?': false,
					},
				},
			],
		},
		response: null,
	},
	{
		name: 'field create',
		run: () =>
			operations.fieldCreate(ctx, {
				holderType: 'CRM/Lead',
				name: 'CRM/Summary',
				type: 'fibery/text',
			}),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{
					command: 'schema.field/create',
					args: {
						'fibery/holder-type': 'CRM/Lead',
						'fibery/name': 'CRM/Summary',
						'fibery/type': 'fibery/text',
					},
				},
			],
		},
		response: null,
	},
	{
		name: 'enum create',
		run: () => operations.enumCreate(ctx, { name: 'CRM/Status_CRM/Lead' }),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{
					command: 'schema.enum/create',
					args: { 'fibery/name': 'CRM/Status_CRM/Lead' },
				},
			],
		},
		response: null,
	},
	{
		name: 'field rename',
		run: () =>
			operations.fieldRename(ctx, {
				holderType: 'CRM/Lead',
				fromName: 'CRM/Summary',
				toName: 'CRM/Description',
			}),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{
					command: 'schema.field/rename',
					args: {
						'holder-type': 'CRM/Lead',
						'from-name': 'CRM/Summary',
						'to-name': 'CRM/Description',
					},
				},
			],
		},
		response: null,
	},
	{
		name: 'field delete',
		run: () =>
			operations.fieldDelete(ctx, {
				holderType: 'CRM/Lead',
				name: 'CRM/Description',
			}),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{
					command: 'schema.field/delete',
					args: {
						'holder-type': 'CRM/Lead',
						name: 'CRM/Description',
						'delete-values?': false,
					},
				},
			],
		},
		response: null,
	},
	{
		name: 'field metadata',
		run: () =>
			operations.fieldSetMeta(ctx, {
				holderType: 'CRM/Lead',
				name: 'CRM/Description',
				key: 'fibery/required?',
				value: false,
			}),
		transport: 'command',
		path: 'fibery.schema/batch',
		payload: {
			commands: [
				{
					command: 'schema.field/set-meta',
					args: {
						name: 'CRM/Description',
						'holder-type': 'CRM/Lead',
						key: 'fibery/required?',
						value: false,
					},
				},
			],
		},
		response: null,
	},
	{
		name: 'install mixins',
		run: () =>
			operations.installMixins(ctx, {
				types: { 'CRM/Lead': ['fibery/rank-mixin'] },
			}),
		transport: 'command',
		path: 'fibery.app/install-mixins',
		payload: { types: { 'CRM/Lead': ['fibery/rank-mixin'] } },
		response: null,
	},
	{
		name: 'entity query',
		run: () =>
			operations.entityQuery(ctx, {
				query: {
					'q/from': 'CRM/Lead',
					'q/select': ['fibery/id'],
					'q/limit': 100,
				},
			}),
		transport: 'command',
		path: 'fibery.entity/query',
		payload: {
			query: {
				'q/from': 'CRM/Lead',
				'q/select': ['fibery/id'],
				'q/limit': 100,
			},
		},
		response: [],
	},
	{
		name: 'entity create',
		run: () =>
			operations.entityCreate(ctx, {
				type: 'CRM/Lead',
				entity: { 'CRM/Name': 'Sample' },
			}),
		transport: 'command',
		path: 'fibery.entity/create',
		payload: { type: 'CRM/Lead', entity: { 'CRM/Name': 'Sample' } },
		response: {},
	},
	{
		name: 'entity update',
		run: () =>
			operations.entityUpdate(ctx, {
				type: 'CRM/Lead',
				entity: { 'fibery/id': id, 'CRM/Name': 'Changed' },
			}),
		transport: 'command',
		path: 'fibery.entity/update',
		payload: {
			type: 'CRM/Lead',
			entity: { 'fibery/id': id, 'CRM/Name': 'Changed' },
		},
		response: {},
	},
	{
		name: 'entity delete',
		run: () => operations.entityDelete(ctx, { type: 'CRM/Lead', id }),
		transport: 'command',
		path: 'fibery.entity/delete',
		payload: { type: 'CRM/Lead', entity: { 'fibery/id': id } },
		response: null,
	},
	{
		name: 'entity upsert',
		run: () =>
			operations.entityUpsert(ctx, {
				type: 'CRM/Lead',
				entities: [{ 'fibery/id': id }],
				conflictField: 'CRM/Name',
				conflictAction: 'skip-create',
			}),
		transport: 'command',
		path: 'fibery.entity.batch/create-or-update',
		payload: {
			type: 'CRM/Lead',
			entities: [{ 'fibery/id': id }],
			'conflict-field': 'CRM/Name',
			'conflict-action': 'skip-create',
		},
		response: [],
	},
	{
		name: 'collection add',
		run: () =>
			operations.collectionAdd(ctx, {
				type: 'CRM/Lead',
				field: 'CRM/Contacts',
				entityId: id,
				itemIds: [otherId],
			}),
		transport: 'command',
		path: 'fibery.entity/add-collection-items',
		payload: {
			type: 'CRM/Lead',
			field: 'CRM/Contacts',
			entity: { [id]: [otherId] },
		},
		response: 'ok',
	},
	{
		name: 'collection remove',
		run: () =>
			operations.collectionRemove(ctx, {
				type: 'CRM/Lead',
				field: 'CRM/Contacts',
				entityId: id,
				itemIds: [otherId],
			}),
		transport: 'command',
		path: 'fibery.entity/remove-collection-items',
		payload: {
			type: 'CRM/Lead',
			field: 'CRM/Contacts',
			entity: { [id]: [otherId] },
		},
		response: 'ok',
	},
	{
		name: 'collection set',
		run: () =>
			operations.collectionSet(ctx, {
				type: 'CRM/Lead',
				field: 'CRM/Contacts',
				entityId: id,
				itemIds: [otherId],
			}),
		transport: 'command',
		path: 'fibery.entity/set-collection-items',
		payload: {
			type: 'CRM/Lead',
			field: 'CRM/Contacts',
			entity: { [id]: [otherId] },
		},
		response: 'ok',
	},
	{
		name: 'collection reset',
		run: () =>
			operations.collectionReset(ctx, {
				type: 'CRM/Lead',
				field: 'CRM/Contacts',
				entityId: id,
			}),
		transport: 'command',
		path: 'fibery.entity/reset-collection-items',
		payload: { type: 'CRM/Lead', field: 'CRM/Contacts', entity: id },
		response: 'ok',
	},
	{
		name: 'document get',
		run: () => operations.documentGet(ctx, { secret: id, format: 'html' }),
		transport: 'request',
		path: `/api/documents/${id}`,
		method: 'GET',
		query: { format: 'html' },
		response: { secret: id, content: '<p>Hello</p>' },
	},
	{
		name: 'document batch get',
		run: () => operations.documentGetBatch(ctx, { secrets: [id] }),
		transport: 'request',
		path: '/api/documents/commands',
		method: 'POST',
		payload: { command: 'get-documents', args: [{ secret: id }] },
		response: [{ secret: id, content: 'Hello' }],
	},
	{
		name: 'document update',
		run: () =>
			operations.documentUpdate(ctx, {
				secret: id,
				format: 'md',
				content: 'Hello',
			}),
		transport: 'request',
		path: `/api/documents/${id}`,
		method: 'PUT',
		query: { format: 'md' },
		payload: { content: 'Hello' },
		response: null,
	},
	{
		name: 'document batch update',
		run: () =>
			operations.documentUpdateBatch(ctx, {
				documents: [{ secret: id, content: 'Hello' }],
			}),
		transport: 'request',
		path: '/api/documents/commands',
		method: 'POST',
		query: { format: 'md' },
		payload: {
			command: 'create-or-update-documents',
			args: [{ secret: id, content: 'Hello' }],
		},
		response: null,
	},
	{
		name: 'file upload',
		run: () =>
			operations.fileUpload(ctx, {
				name: 'note.txt',
				contentType: 'text/plain',
				base64: 'SGVsbG8=',
			}),
		transport: 'upload',
		path: '/api/files',
		response: fileInfo,
	},
	{
		name: 'file download',
		run: () => operations.fileDownload(ctx, { secret: id }),
		transport: 'binary',
		path: `/api/files/${id}`,
		method: 'GET',
		response: { kind: 'binary', contentType: 'text/plain', base64: 'SGVsbG8=' },
	},
	{
		name: 'file sign URLs',
		run: () => operations.fileSignUrls(ctx, { secrets: [id] }),
		transport: 'request',
		path: '/api/files/sign-urls',
		method: 'POST',
		payload: { secrets: [id] },
		response: {
			items: [
				{
					secret: id,
					url: 'https://files.fibery.io/signed',
					expiresAt: '2026-01-01T00:00:00Z',
				},
			],
		},
	},
	{
		name: 'views query',
		run: () => operations.viewsQuery(ctx, { ids: [id] }),
		transport: 'rpc',
		path: 'query-views',
		payload: { filter: { ids: [id] } },
		response: [],
	},
	{
		name: 'views create',
		run: () => operations.viewsCreate(ctx, { views: [{ 'fibery/id': id }] }),
		transport: 'rpc',
		path: 'create-views',
		payload: { views: [{ 'fibery/id': id }] },
		response: [],
	},
	{
		name: 'views update',
		run: () =>
			operations.viewsUpdate(ctx, {
				updates: [{ id, values: { 'fibery/name': 'Updated' } }],
			}),
		transport: 'rpc',
		path: 'update-views',
		payload: { updates: [{ id, values: { 'fibery/name': 'Updated' } }] },
		response: [],
	},
	{
		name: 'views delete',
		run: () => operations.viewsDelete(ctx, { ids: [id] }),
		transport: 'rpc',
		path: 'delete-views',
		payload: { ids: [id] },
		response: null,
	},
	{
		name: 'history search',
		run: () => operations.historySearch(ctx, { limit: 50, where: [] }),
		transport: 'request',
		path: '/api/history/v2/search',
		method: 'POST',
		payload: { limit: 50, where: [] },
		response: { items: [], nextPage: { hasNext: false } },
	},
];

beforeEach(() => {
	mockCommand.mockReset();
	mockJsonRpc.mockReset();
	mockRequest.mockReset();
	mockBinary.mockReset();
	mockUpload.mockReset();
	mockLog.mockReset();
	mockOAuthAccessToken.mockReset();
	mockOAuthAccessToken.mockResolvedValue('fresh-fibery-oauth-token');
});

describe('OAuth key builder', () => {
	it('uses Corsair refresh handling with Fibery Basic client authentication', async () => {
		const plugin = fibery<FiberyPluginOptions>({
			workspaceUrl: url,
			authType: 'oauth_2',
		});
		if (!plugin.keyBuilder) throw new Error('Expected Fibery keyBuilder.');

		await expect(
			plugin.keyBuilder(oauthKeyBuilderContext, 'endpoint'),
		).resolves.toBe('fresh-fibery-oauth-token');
		expect(mockOAuthAccessToken).toHaveBeenCalledWith(oauthKeyBuilderContext, {
			plugin: 'fibery',
			tokenUrl: 'https://auth.fibery.io/oauth2/token',
			tokenAuthMethod: 'basic',
		});
	});
});

describe.each(cases)('$name', (testCase) => {
	it('uses the documented route and validates its response', async () => {
		if (testCase.transport === 'command')
			mockCommand.mockResolvedValue(testCase.response);
		if (testCase.transport === 'request')
			mockRequest.mockResolvedValue(testCase.response);
		if (testCase.transport === 'rpc')
			mockJsonRpc.mockResolvedValue(testCase.response);
		if (testCase.transport === 'binary') {
			mockBinary.mockResolvedValue({
				contentType: 'text/plain',
				base64: 'SGVsbG8=',
			});
		}
		if (testCase.transport === 'upload')
			mockUpload.mockResolvedValue(testCase.response);

		await expect(testCase.run()).resolves.toEqual(testCase.response);
		if (testCase.transport === 'command') {
			expect(mockCommand).toHaveBeenCalledWith(
				testCase.path,
				testCase.payload ?? {},
				'fibery-test-token',
				options,
			);
		}
		if (testCase.transport === 'request') {
			expect(mockRequest).toHaveBeenCalledWith(
				testCase.path,
				'fibery-test-token',
				{
					...options,
					method: testCase.method,
					...(testCase.payload === undefined ? {} : { body: testCase.payload }),
					...(testCase.query === undefined ? {} : { query: testCase.query }),
				},
			);
		}
		if (testCase.transport === 'rpc') {
			expect(mockJsonRpc).toHaveBeenCalledWith(
				testCase.path,
				testCase.payload,
				'fibery-test-token',
				options,
			);
		}
		if (testCase.transport === 'binary') {
			expect(mockBinary).toHaveBeenCalledWith(
				testCase.path,
				'fibery-test-token',
				{ ...options, method: 'GET' },
			);
		}
		if (testCase.transport === 'upload') {
			expect(mockUpload).toHaveBeenCalledWith(
				expect.any(FormData),
				'fibery-test-token',
				options,
			);
		}
		for (const call of mockLog.mock.calls) {
			expect(JSON.stringify(call[2])).not.toContain('Hello');
			expect(JSON.stringify(call[2])).not.toContain('Fibery');
		}
	});
});

describe('endpoint validation', () => {
	it('rejects invalid entity and history inputs before transport', async () => {
		await expect(
			operations.entityQuery(ctx, {
				query: {
					'q/from': 'CRM/Lead',
					'q/select': ['fibery/id'],
					'q/limit': 0,
				},
			}),
		).rejects.toThrow();
		await expect(
			operations.historySearch(ctx, { limit: -1 }),
		).rejects.toThrow();
		expect(mockCommand).not.toHaveBeenCalled();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('risk levels', () => {
	it('marks replace-all and clear collection calls as destructive', () => {
		const plugin = fibery<FiberyPluginOptions>({ workspaceUrl: url });
		expect(plugin.endpointMeta?.['collection.set']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['collection.reset']?.riskLevel).toBe(
			'destructive',
		);
	});
});
