import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Attachments,
	Columns,
	Docs,
	Orgs,
	Profile,
	Records,
	ServiceAccounts,
	Session,
	Sql,
	Tables,
	Templates,
	Users,
	Widgets,
	Workspaces,
} from './endpoints';
import type { GristContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeGristRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeGristRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): GristContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_base_url: () => Promise.resolve('https://docs.getgrist.com'),
			set_base_url: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const BASE = 'https://docs.getgrist.com/api';
const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('base URL', () => {
	it('uses the account base_url for team sites', async () => {
		mockedRequest.mockResolvedValue([]);
		const teamCtx = buildCtx();
		teamCtx.keys.get_base_url = () =>
			Promise.resolve('https://myteam.getgrist.com/');
		await Orgs.list(teamCtx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/orgs', 'test-api-key', {
			method: 'GET',
			baseUrl: 'https://myteam.getgrist.com/api',
		});
	});

	it('throws AuthMissingError when no base URL is stored', async () => {
		const noUrlCtx = buildCtx();
		noUrlCtx.keys.get_base_url = () => Promise.resolve(null);
		await expect(Orgs.list(noUrlCtx, {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('refuses a non-https base URL before sending the key', async () => {
		const httpCtx = buildCtx();
		httpCtx.keys.get_base_url = () => Promise.resolve('http://grist.example');
		await expect(Orgs.list(httpCtx, {})).rejects.toThrow('https');
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Orgs endpoints', () => {
	it('orgs.list calls GET /orgs', async () => {
		const mockOrgs = [
			{ id: 1, name: 'Grist Labs', domain: 'gristlabs', access: 'owners' },
		];
		mockedRequest.mockResolvedValue(mockOrgs);
		const result = await Orgs.list(ctx, {});
		expect(result).toEqual(mockOrgs);
		expect(mockedRequest).toHaveBeenCalledWith('/orgs', 'test-api-key', {
			method: 'GET',
			baseUrl: BASE,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'grist.orgs.list',
			{ count: 1 },
			'completed',
		);
	});

	it('orgs.get encodes orgId and calls GET /orgs/{orgId}', async () => {
		const mockOrg = {
			id: 42,
			name: 'Test Org',
			domain: null,
			access: 'editors',
		};
		mockedRequest.mockResolvedValue(mockOrg);
		const result = await Orgs.get(ctx, { orgId: 'team/special' });
		expect(result).toEqual(mockOrg);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/team%2Fspecial',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('orgs.update sends PATCH /orgs/{orgId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Orgs.update(ctx, { orgId: 10, name: 'Renamed' });
		expect(mockedRequest).toHaveBeenCalledWith('/orgs/10', 'test-api-key', {
			method: 'PATCH',
			body: { name: 'Renamed' },
			baseUrl: BASE,
		});
	});

	it('orgs.deleteOrg encodes orgId and name in path', async () => {
		mockedRequest.mockResolvedValue(null);
		await Orgs.deleteOrg(ctx, { orgId: 10, name: 'My Org' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/10/My%20Org',
			'test-api-key',
			{
				method: 'DELETE',
				baseUrl: BASE,
			},
		);
	});

	it('orgs.listAccess calls GET /orgs/{orgId}/access', async () => {
		const mockAccess = {
			users: [
				{ id: 1, email: 'user@example.com', name: 'User', access: 'owners' },
			],
		};
		mockedRequest.mockResolvedValue(mockAccess);
		const result = await Orgs.listAccess(ctx, { orgId: 10 });
		expect(result).toEqual(mockAccess);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/10/access',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('orgs.modifyAccess sends PATCH /orgs/{orgId}/access', async () => {
		mockedRequest.mockResolvedValue(null);
		await Orgs.modifyAccess(ctx, {
			orgId: 10,
			users: { 'user@example.com': 'editors' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/10/access',
			'test-api-key',
			{
				method: 'PATCH',
				body: { delta: { users: { 'user@example.com': 'editors' } } },
				baseUrl: BASE,
			},
		);
	});

	it('orgs.getUsage calls GET /orgs/{orgId}/usage', async () => {
		const mockUsage = { userCount: 5, rowCount: 1000 };
		mockedRequest.mockResolvedValue(mockUsage);
		const result = await Orgs.getUsage(ctx, { orgId: 10 });
		expect(result).toEqual(mockUsage);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/10/usage',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});
});

describe('Workspaces endpoints', () => {
	it('workspaces.list calls GET /orgs/{orgId}/workspaces', async () => {
		const mockWs = [
			{ id: 97, name: 'Docs', docs: [{ id: 'doc1', name: 'Plan' }] },
		];
		mockedRequest.mockResolvedValue(mockWs);
		const result = await Workspaces.list(ctx, { orgId: 'current' });
		expect(result).toEqual(mockWs);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/current/workspaces',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.create calls POST /orgs/{orgId}/workspaces', async () => {
		mockedRequest.mockResolvedValue(101);
		const result = await Workspaces.create(ctx, {
			orgId: 'current',
			name: 'New WS',
		});
		expect(result).toBe(101);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/current/workspaces',
			'test-api-key',
			{
				method: 'POST',
				body: { name: 'New WS' },
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.get calls GET /workspaces/{workspaceId}', async () => {
		const mockWs = { id: 97, name: 'Docs', docs: [] };
		mockedRequest.mockResolvedValue(mockWs);
		const result = await Workspaces.get(ctx, { workspaceId: 97 });
		expect(result).toEqual(mockWs);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.update sends PATCH /workspaces/{workspaceId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Workspaces.update(ctx, { workspaceId: 97, name: 'Renamed WS' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97',
			'test-api-key',
			{
				method: 'PATCH',
				body: { name: 'Renamed WS' },
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.deleteWorkspace calls DELETE /workspaces/{workspaceId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Workspaces.deleteWorkspace(ctx, { workspaceId: 97 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97',
			'test-api-key',
			{
				method: 'DELETE',
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.remove moves workspace to trash', async () => {
		mockedRequest.mockResolvedValue(null);
		await Workspaces.remove(ctx, { workspaceId: 97 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97/remove',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.unremove restores workspace from trash', async () => {
		mockedRequest.mockResolvedValue(null);
		await Workspaces.unremove(ctx, { workspaceId: 97 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97/unremove',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.listAccess calls GET /workspaces/{workspaceId}/access', async () => {
		const mockAccess = { users: [] };
		mockedRequest.mockResolvedValue(mockAccess);
		const result = await Workspaces.listAccess(ctx, { workspaceId: 97 });
		expect(result).toEqual(mockAccess);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97/access',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.modifyAccess sends PATCH /workspaces/{workspaceId}/access', async () => {
		mockedRequest.mockResolvedValue(null);
		await Workspaces.modifyAccess(ctx, {
			workspaceId: 97,
			users: { 'user@example.com': 'viewers' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97/access',
			'test-api-key',
			{
				method: 'PATCH',
				body: { delta: { users: { 'user@example.com': 'viewers' } } },
				baseUrl: BASE,
			},
		);
	});

	it('workspaces.modifyAccess forwards maxInheritedRole: null to stop inheriting access', async () => {
		mockedRequest.mockResolvedValue(null);
		await Workspaces.modifyAccess(ctx, {
			workspaceId: 97,
			maxInheritedRole: null,
			users: {},
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97/access',
			'test-api-key',
			{
				method: 'PATCH',
				body: { delta: { maxInheritedRole: null, users: {} } },
				baseUrl: BASE,
			},
		);
	});
});

describe('Docs endpoints', () => {
	it('docs.create calls POST /docs', async () => {
		mockedRequest.mockResolvedValue('doc_xyz789');
		const result = await Docs.create(ctx, {
			documentName: 'New Document',
			workspaceId: 97,
		});
		expect(result).toBe('doc_xyz789');
		expect(mockedRequest).toHaveBeenCalledWith('/docs', 'test-api-key', {
			method: 'POST',
			body: { documentName: 'New Document', workspaceId: 97 },
			baseUrl: BASE,
		});
	});

	it('docs.createInWorkspace calls POST /workspaces/{workspaceId}/docs', async () => {
		mockedRequest.mockResolvedValue('doc_workspace_doc');
		const result = await Docs.createInWorkspace(ctx, {
			workspaceId: 97,
			name: 'Child Doc',
		});
		expect(result).toBe('doc_workspace_doc');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/workspaces/97/docs',
			'test-api-key',
			{
				method: 'POST',
				body: { name: 'Child Doc' },
				baseUrl: BASE,
			},
		);
	});

	it('docs.createInWorkspace requires a name, as Grist does', async () => {
		const noName = { workspaceId: 97 } as unknown as Parameters<
			typeof Docs.createInWorkspace
		>[1];
		await expect(Docs.createInWorkspace(ctx, noName)).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('docs.get calls GET /docs/{docId}', async () => {
		const mockDoc = { id: 'doc123', name: 'Budget', access: 'owners' };
		mockedRequest.mockResolvedValue(mockDoc);
		const result = await Docs.get(ctx, { docId: 'doc123' });
		expect(result).toEqual(mockDoc);
		expect(mockedRequest).toHaveBeenCalledWith('/docs/doc123', 'test-api-key', {
			method: 'GET',
			baseUrl: BASE,
		});
	});

	it('docs.update sends PATCH /docs/{docId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.update(ctx, { docId: 'doc123', name: 'Renamed Doc' });
		expect(mockedRequest).toHaveBeenCalledWith('/docs/doc123', 'test-api-key', {
			method: 'PATCH',
			body: { name: 'Renamed Doc' },
			baseUrl: BASE,
		});
	});

	it('docs.deleteDoc calls DELETE /docs/{docId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.deleteDoc(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith('/docs/doc123', 'test-api-key', {
			method: 'DELETE',
			baseUrl: BASE,
		});
	});

	it('docs.remove calls POST /docs/{docId}/remove', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.remove(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/remove',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('docs.unremove calls POST /docs/{docId}/unremove', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.unremove(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/unremove',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('docs.move calls PATCH /docs/{docId}/move', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.move(ctx, { docId: 'doc123', workspace: 99 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/move',
			'test-api-key',
			{
				method: 'PATCH',
				body: { workspace: 99 },
				baseUrl: BASE,
			},
		);
	});

	it('docs.pin calls PATCH /docs/{docId}/pin', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.pin(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/pin',
			'test-api-key',
			{
				method: 'PATCH',
				baseUrl: BASE,
			},
		);
	});

	it('docs.unpin calls PATCH /docs/{docId}/unpin', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.unpin(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/unpin',
			'test-api-key',
			{
				method: 'PATCH',
				baseUrl: BASE,
			},
		);
	});

	it('docs.copy calls POST /docs/{docId}/copy', async () => {
		mockedRequest.mockResolvedValue('doc_copied');
		const result = await Docs.copy(ctx, {
			docId: 'doc123',
			documentName: 'Copied Doc',
			workspaceId: 97,
		});
		expect(result).toBe('doc_copied');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/copy',
			'test-api-key',
			{
				method: 'POST',
				body: { documentName: 'Copied Doc', workspaceId: 97 },
				baseUrl: BASE,
			},
		);
	});

	it('docs.fork calls POST /docs/{docId}/fork', async () => {
		const forkResponse = {
			forkId: 'f1',
			docId: 'doc123~f1~1',
			urlId: 'doc123~f1~1',
		};
		mockedRequest.mockResolvedValue(forkResponse);
		const result = await Docs.fork(ctx, { docId: 'doc123' });
		expect(result).toEqual(forkResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/fork',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('docs.listAccess calls GET /docs/{docId}/access', async () => {
		const mockAccess = { users: [] };
		mockedRequest.mockResolvedValue(mockAccess);
		const result = await Docs.listAccess(ctx, { docId: 'doc123' });
		expect(result).toEqual(mockAccess);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/access',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('docs.modifyAccess sends PATCH /docs/{docId}/access', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.modifyAccess(ctx, {
			docId: 'doc123',
			users: { 'user@example.com': 'owners' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/access',
			'test-api-key',
			{
				method: 'PATCH',
				body: { delta: { users: { 'user@example.com': 'owners' } } },
				baseUrl: BASE,
			},
		);
	});

	it('docs.modifyAccess forwards maxInheritedRole: null to stop inheriting access', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.modifyAccess(ctx, {
			docId: 'doc123',
			maxInheritedRole: null,
			users: {},
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/access',
			'test-api-key',
			{
				method: 'PATCH',
				body: { delta: { maxInheritedRole: null, users: {} } },
				baseUrl: BASE,
			},
		);
	});

	it('docs.listSnapshots calls GET /docs/{docId}/snapshots', async () => {
		const mockSnapshots = {
			snapshots: [
				{
					snapshotId: 'snap1',
					lastModified: '2026-01-01T00:00:00Z',
					docId: 'doc123',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockSnapshots);
		const result = await Docs.listSnapshots(ctx, { docId: 'doc123' });
		expect(result).toEqual(mockSnapshots);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/snapshots',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('docs.removeSnapshots calls POST /docs/{docId}/snapshots/remove', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.removeSnapshots(ctx, {
			docId: 'doc123',
			snapshotIds: ['snap1'],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/snapshots/remove',
			'test-api-key',
			{
				method: 'POST',
				body: { snapshotIds: ['snap1'] },
				baseUrl: BASE,
			},
		);
	});
});

describe('Tables endpoints', () => {
	it('tables.list calls GET /docs/{docId}/tables', async () => {
		const mockTables = {
			tables: [{ id: 'Table1', fields: { primaryViewId: 1 } }],
		};
		mockedRequest.mockResolvedValue(mockTables);
		const result = await Tables.list(ctx, { docId: 'doc123' });
		expect(result).toEqual(mockTables);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('tables.create calls POST /docs/{docId}/tables', async () => {
		const mockCreated = { tables: [{ id: 'Table2' }] };
		mockedRequest.mockResolvedValue(mockCreated);
		const result = await Tables.create(ctx, {
			docId: 'doc123',
			tables: [
				{ id: 'Table2', columns: [{ id: 'col1', fields: { type: 'Text' } }] },
			],
		});
		expect(result).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables',
			'test-api-key',
			{
				method: 'POST',
				body: {
					tables: [
						{
							id: 'Table2',
							columns: [{ id: 'col1', fields: { type: 'Text' } }],
						},
					],
				},
				baseUrl: BASE,
			},
		);
	});

	it('tables.update sends PATCH /docs/{docId}/tables', async () => {
		mockedRequest.mockResolvedValue(null);
		await Tables.update(ctx, {
			docId: 'doc123',
			tables: [{ id: 'Table1', fields: {} }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables',
			'test-api-key',
			{
				method: 'PATCH',
				body: { tables: [{ id: 'Table1', fields: {} }] },
				baseUrl: BASE,
			},
		);
	});
});

describe('Records endpoints', () => {
	it('records.list queries records with options', async () => {
		const mockRecords = { records: [{ id: 1, fields: { Name: 'Alice' } }] };
		mockedRequest.mockResolvedValue(mockRecords);
		const result = await Records.list(ctx, {
			docId: 'doc123',
			tableId: 'People',
			limit: 10,
			sort: 'Name',
		});
		expect(result).toEqual(mockRecords);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/People/records',
			'test-api-key',
			{
				method: 'GET',
				query: {
					sort: 'Name',
					limit: 10,
					filter: undefined,
					hidden: undefined,
				},
				baseUrl: BASE,
			},
		);
	});

	it('records.add adds records to a table', async () => {
		const mockResult = { records: [{ id: 2 }] };
		mockedRequest.mockResolvedValue(mockResult);
		const result = await Records.add(ctx, {
			docId: 'doc123',
			tableId: 'People',
			records: [{ fields: { Name: 'Bob' } }],
		});
		expect(result).toEqual(mockResult);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/People/records',
			'test-api-key',
			{
				method: 'POST',
				body: { records: [{ fields: { Name: 'Bob' } }] },
				baseUrl: BASE,
			},
		);
	});

	it('records.update updates records in a table', async () => {
		mockedRequest.mockResolvedValue(null);
		await Records.update(ctx, {
			docId: 'doc123',
			tableId: 'People',
			records: [{ id: 1, fields: { Name: 'Alice Updated' } }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/People/records',
			'test-api-key',
			{
				method: 'PATCH',
				body: { records: [{ id: 1, fields: { Name: 'Alice Updated' } }] },
				baseUrl: BASE,
			},
		);
	});

	it('records.replace replaces records in a table', async () => {
		mockedRequest.mockResolvedValue(null);
		await Records.replace(ctx, {
			docId: 'doc123',
			tableId: 'People',
			records: [{ require: { id: 1 }, fields: { Name: 'Alice Replaced' } }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/People/records',
			'test-api-key',
			{
				method: 'PUT',
				body: {
					records: [{ require: { id: 1 }, fields: { Name: 'Alice Replaced' } }],
				},
				baseUrl: BASE,
			},
		);
	});

	it('records.deleteRecords deletes records by ID', async () => {
		mockedRequest.mockResolvedValue(null);
		await Records.deleteRecords(ctx, {
			docId: 'doc123',
			tableId: 'People',
			recordIds: [1, 2, 3],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/People/records/delete',
			'test-api-key',
			{
				method: 'POST',
				body: [1, 2, 3],
				baseUrl: BASE,
			},
		);
	});
});

describe('Columns endpoints', () => {
	it('columns.list calls GET /docs/{docId}/tables/{tableId}/columns', async () => {
		const mockCols = { columns: [{ id: 'col1', fields: { type: 'Text' } }] };
		mockedRequest.mockResolvedValue(mockCols);
		const result = await Columns.list(ctx, {
			docId: 'doc123',
			tableId: 'Table1',
		});
		expect(result).toEqual(mockCols);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/Table1/columns',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('columns.add calls POST /docs/{docId}/tables/{tableId}/columns', async () => {
		const mockCreated = { columns: [{ id: 'col2' }] };
		mockedRequest.mockResolvedValue(mockCreated);
		const result = await Columns.add(ctx, {
			docId: 'doc123',
			tableId: 'Table1',
			columns: [{ id: 'col2', fields: { type: 'Numeric' } }],
		});
		expect(result).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/Table1/columns',
			'test-api-key',
			{
				method: 'POST',
				body: { columns: [{ id: 'col2', fields: { type: 'Numeric' } }] },
				baseUrl: BASE,
			},
		);
	});

	it('columns.update sends PATCH /docs/{docId}/tables/{tableId}/columns', async () => {
		mockedRequest.mockResolvedValue(null);
		await Columns.update(ctx, {
			docId: 'doc123',
			tableId: 'Table1',
			columns: [{ id: 'col1', fields: { label: 'First Name' } }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/Table1/columns',
			'test-api-key',
			{
				method: 'PATCH',
				body: { columns: [{ id: 'col1', fields: { label: 'First Name' } }] },
				baseUrl: BASE,
			},
		);
	});

	it('columns.replace sends PUT /docs/{docId}/tables/{tableId}/columns', async () => {
		mockedRequest.mockResolvedValue(null);
		await Columns.replace(ctx, {
			docId: 'doc123',
			tableId: 'Table1',
			columns: [{ id: 'col1', fields: { type: 'Text' } }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/Table1/columns',
			'test-api-key',
			{
				method: 'PUT',
				body: { columns: [{ id: 'col1', fields: { type: 'Text' } }] },
				baseUrl: BASE,
			},
		);
	});

	it('columns.deleteColumn calls DELETE /docs/{docId}/tables/{tableId}/columns/{colId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Columns.deleteColumn(ctx, {
			docId: 'doc123',
			tableId: 'Table1',
			colId: 'col1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/tables/Table1/columns/col1',
			'test-api-key',
			{
				method: 'DELETE',
				baseUrl: BASE,
			},
		);
	});
});

describe('SQL endpoints', () => {
	it('sql.query sends POST /docs/{docId}/sql', async () => {
		const mockSql = {
			statement: 'SELECT count(*) FROM Table1',
			records: [{ fields: { count: 42 } }],
		};
		mockedRequest.mockResolvedValue(mockSql);
		const result = await Sql.query(ctx, {
			docId: 'doc123',
			sql: 'SELECT count(*) FROM Table1',
		});
		expect(result).toEqual(mockSql);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/sql',
			'test-api-key',
			{
				method: 'POST',
				body: { sql: 'SELECT count(*) FROM Table1' },
				baseUrl: BASE,
			},
		);
	});

	it('sql.queryGet sends GET /docs/{docId}/sql', async () => {
		const mockSql = { records: [{ fields: { val: 'test' } }] };
		mockedRequest.mockResolvedValue(mockSql);
		const result = await Sql.queryGet(ctx, {
			docId: 'doc123',
			q: 'SELECT * FROM Table1',
		});
		expect(result).toEqual(mockSql);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/sql',
			'test-api-key',
			{
				method: 'GET',
				query: { q: 'SELECT * FROM Table1' },
				baseUrl: BASE,
			},
		);
	});
});

describe('Attachments endpoints', () => {
	it('attachments.list calls GET /docs/{docId}/attachments', async () => {
		const mockAtts = {
			records: [{ id: 1, fields: { name: 'file.png', size: 1024 } }],
		};
		mockedRequest.mockResolvedValue(mockAtts);
		const result = await Attachments.list(ctx, { docId: 'doc123' });
		expect(result).toEqual(mockAtts);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/attachments',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('attachments.get calls GET /docs/{docId}/attachments/{attachmentId}', async () => {
		const mockMetadata = { id: 1, name: 'file.png', size: 1024 };
		mockedRequest.mockResolvedValue(mockMetadata);
		const result = await Attachments.get(ctx, {
			docId: 'doc123',
			attachmentId: 1,
		});
		expect(result).toEqual(mockMetadata);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/attachments/1',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('attachments.removeUnused calls POST /docs/{docId}/attachments/removeUnused', async () => {
		mockedRequest.mockResolvedValue(null);
		await Attachments.removeUnused(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/attachments/removeUnused',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('attachments.removeUnused sends expiredOnly as a query parameter', async () => {
		mockedRequest.mockResolvedValue(null);
		await Attachments.removeUnused(ctx, { docId: 'doc123', expiredOnly: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/attachments/removeUnused',
			'test-api-key',
			{
				method: 'POST',
				query: { expiredOnly: true },
				baseUrl: BASE,
			},
		);
	});

	it('attachments.updateUsed calls POST /docs/{docId}/attachments/updateUsed', async () => {
		mockedRequest.mockResolvedValue(null);
		await Attachments.updateUsed(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/attachments/updateUsed',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('attachments.verifyFiles calls POST /docs/{docId}/attachments/verifyFiles', async () => {
		mockedRequest.mockResolvedValue(null);
		await Attachments.verifyFiles(ctx, { docId: 'doc123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/attachments/verifyFiles',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('attachments.getTransferStatus calls GET /docs/{docId}/attachments/transferStatus', async () => {
		const mockStatus = { status: 'idle' };
		mockedRequest.mockResolvedValue(mockStatus);
		const result = await Attachments.getTransferStatus(ctx, {
			docId: 'doc123',
		});
		expect(result).toEqual(mockStatus);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc123/attachments/transferStatus',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});
});

describe('Profile endpoints', () => {
	it('profile.get calls GET /profile/user', async () => {
		const mockProfile = { id: 1, email: 'user@example.com', name: 'User' };
		mockedRequest.mockResolvedValue(mockProfile);
		const result = await Profile.get(ctx, {});
		expect(result).toEqual(mockProfile);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/user',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('profile.updateName calls POST /profile/user/name', async () => {
		mockedRequest.mockResolvedValue(null);
		await Profile.updateName(ctx, { name: 'New Name' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/user/name',
			'test-api-key',
			{
				method: 'POST',
				body: { name: 'New Name' },
				baseUrl: BASE,
			},
		);
	});

	it('profile.updateLocale calls POST /profile/user/locale', async () => {
		mockedRequest.mockResolvedValue(null);
		await Profile.updateLocale(ctx, { locale: 'en-US' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/user/locale',
			'test-api-key',
			{
				method: 'POST',
				body: { locale: 'en-US' },
				baseUrl: BASE,
			},
		);
	});

	it('profile exposes no operation that reads, replaces or deletes the connection key', () => {
		expect(Object.keys(Profile).sort()).toEqual([
			'get',
			'updateLocale',
			'updateName',
		]);
	});
});

const SERVICE_ACCOUNT = {
	id: 7,
	login: 'abc@serviceaccounts.invalid',
	label: 'Bot',
	description: '',
	expiresAt: '2027-01-01T00:00:00.000Z',
	hasValidKey: true,
};

describe('ServiceAccounts endpoints', () => {
	it('serviceAccounts.list calls GET /service-accounts', async () => {
		const mockList = [SERVICE_ACCOUNT];
		mockedRequest.mockResolvedValue(mockList);
		const result = await ServiceAccounts.list(ctx, {});
		expect(result).toEqual(mockList);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('serviceAccounts.create calls POST /service-accounts', async () => {
		const mockCreated = { ...SERVICE_ACCOUNT, key: 'sa_key_new' };
		mockedRequest.mockResolvedValue(mockCreated);
		const result = await ServiceAccounts.create(ctx, {
			label: 'Bot',
			expiresAt: '2027-01-01',
		});
		expect(result).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts',
			'test-api-key',
			{
				method: 'POST',
				body: { label: 'Bot', expiresAt: '2027-01-01' },
				baseUrl: BASE,
			},
		);
	});

	it('serviceAccounts.get calls GET /service-accounts/{id}', async () => {
		const mockSa = SERVICE_ACCOUNT;
		mockedRequest.mockResolvedValue(mockSa);
		const result = await ServiceAccounts.get(ctx, { saId: 'sa1' });
		expect(result).toEqual(mockSa);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts/sa1',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('serviceAccounts.update sends PATCH /service-accounts/{id}', async () => {
		mockedRequest.mockResolvedValue(null);
		await ServiceAccounts.update(ctx, { saId: 'sa1', label: 'Updated Bot' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts/sa1',
			'test-api-key',
			{
				method: 'PATCH',
				body: { label: 'Updated Bot' },
				baseUrl: BASE,
			},
		);
	});

	it('serviceAccounts.deleteServiceAccount calls DELETE /service-accounts/{id}', async () => {
		mockedRequest.mockResolvedValue(null);
		await ServiceAccounts.deleteServiceAccount(ctx, { saId: 'sa1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts/sa1',
			'test-api-key',
			{
				method: 'DELETE',
				baseUrl: BASE,
			},
		);
	});

	it('serviceAccounts.regenerateApiKey calls POST /service-accounts/{id}/apikey', async () => {
		const regenerated = { ...SERVICE_ACCOUNT, key: 'sa_key_123' };
		mockedRequest.mockResolvedValue(regenerated);
		const result = await ServiceAccounts.regenerateApiKey(ctx, { saId: 'sa1' });
		expect(result).toEqual(regenerated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts/sa1/apikey',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('serviceAccounts.deleteApiKey calls DELETE /service-accounts/{id}/apikey', async () => {
		mockedRequest.mockResolvedValue(null);
		await ServiceAccounts.deleteApiKey(ctx, { saId: 'sa1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts/sa1/apikey',
			'test-api-key',
			{
				method: 'DELETE',
				baseUrl: BASE,
			},
		);
	});
});

describe('Templates endpoints', () => {
	it('templates.list calls GET /templates', async () => {
		const mockTemplates = [
			{ id: 1, name: 'Template WS', docs: [{ id: 'doc1', name: 'Invoice' }] },
		];
		mockedRequest.mockResolvedValue(mockTemplates);
		const result = await Templates.list(ctx, {});
		expect(result).toEqual(mockTemplates);
		expect(mockedRequest).toHaveBeenCalledWith('/templates', 'test-api-key', {
			method: 'GET',
			baseUrl: BASE,
		});
	});

	it('templates.get keeps template fields the schema does not name', async () => {
		const mockTemplate = {
			id: 't1',
			name: 'Invoice Template',
			options: { description: 'Monthly invoices' },
		};
		mockedRequest.mockResolvedValue(mockTemplate);
		const result = await Templates.get(ctx, { templateId: 't1' });
		expect(result).toEqual(mockTemplate);
	});

	it('templates.get calls GET /templates/{templateId}', async () => {
		const mockTemplate = {
			id: 't1',
			name: 'Invoice Template',
			access: 'viewers',
		};
		mockedRequest.mockResolvedValue(mockTemplate);
		const result = await Templates.get(ctx, { templateId: 't1' });
		expect(result).toEqual(mockTemplate);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/templates/t1',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});
});

describe('Widgets endpoints', () => {
	it('widgets.list calls GET /widgets', async () => {
		const mockWidgets = [
			{
				widgetId: 'w1',
				name: 'Calendar',
				url: 'https://widgets.example.com/cal',
			},
		];
		mockedRequest.mockResolvedValue(mockWidgets);
		const result = await Widgets.list(ctx, {});
		expect(result).toEqual(mockWidgets);
		expect(mockedRequest).toHaveBeenCalledWith('/widgets', 'test-api-key', {
			method: 'GET',
			baseUrl: BASE,
		});
	});
});

describe('Users endpoints', () => {
	it('users.disable calls POST /users/{userId}/disable', async () => {
		mockedRequest.mockResolvedValue(null);
		await Users.disable(ctx, { userId: 5 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/users/5/disable',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('users.enable calls POST /users/{userId}/enable', async () => {
		mockedRequest.mockResolvedValue(null);
		await Users.enable(ctx, { userId: 5 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/users/5/enable',
			'test-api-key',
			{
				method: 'POST',
				baseUrl: BASE,
			},
		);
	});

	it('users.deleteUser calls DELETE /users/{userId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Users.deleteUser(ctx, { userId: 5, name: 'Jane Doe' });
		expect(mockedRequest).toHaveBeenCalledWith('/users/5', 'test-api-key', {
			method: 'DELETE',
			body: { name: 'Jane Doe' },
			baseUrl: BASE,
		});
	});
});

describe('Session endpoints', () => {
	it('session.getActive calls GET /session/access/active', async () => {
		const mockSession = { user: { id: 1, name: 'User' } };
		mockedRequest.mockResolvedValue(mockSession);
		const result = await Session.getActive(ctx, {});
		expect(result).toEqual(mockSession);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/session/access/active',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('session.getActive returns the user and orgError when org is null', async () => {
		const mockSession = {
			user: { id: 1, name: 'User' },
			org: null,
			orgError: { status: 403, error: 'access denied' },
		};
		mockedRequest.mockResolvedValue(mockSession);
		const result = await Session.getActive(ctx, {});
		expect(result).toEqual(mockSession);
	});

	it('session.getAll calls GET /session/access/all', async () => {
		const mockAll = { users: [{ id: 1, name: 'User' }] };
		mockedRequest.mockResolvedValue(mockAll);
		const result = await Session.getAll(ctx, {});
		expect(result).toEqual(mockAll);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/session/access/all',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: BASE,
			},
		);
	});

	it('session exposes no setActive: Grist answers 403 to it without a browser session', () => {
		expect(Object.keys(Session).sort()).toEqual(['getActive', 'getAll']);
	});
});

describe('Validation prevents network calls on invalid input', () => {
	it('rejects empty docId before network call', async () => {
		await expect(Docs.get(ctx, { docId: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
