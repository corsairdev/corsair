import { logEventFromContext } from 'corsair/core';
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
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Orgs endpoints', () => {
	it('orgs.list calls GET /orgs and parses response', async () => {
		const mockOrgs = [
			{
				id: 1,
				name: 'Grist Labs',
				domain: 'gristlabs',
				access: 'owners',
			},
		];
		mockedRequest.mockResolvedValue(mockOrgs);

		const result = await Orgs.list(ctx, {});
		expect(result).toEqual(mockOrgs);
		expect(mockedRequest).toHaveBeenCalledWith('/orgs', 'test-api-key', {
			method: 'GET',
			baseUrl: undefined,
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
				baseUrl: undefined,
			},
		);
	});

	it('orgs.update sends PATCH /orgs/{orgId}', async () => {
		mockedRequest.mockResolvedValue(null);
		await Orgs.update(ctx, { orgId: 10, name: 'Renamed' });
		expect(mockedRequest).toHaveBeenCalledWith('/orgs/10', 'test-api-key', {
			method: 'PATCH',
			body: { name: 'Renamed' },
			baseUrl: undefined,
		});
	});

	it('orgs.delete encodes orgId and name in path', async () => {
		mockedRequest.mockResolvedValue(null);
		await Orgs.deleteOrg(ctx, { orgId: 10, name: 'My Org' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/10/My%20Org',
			'test-api-key',
			{
				method: 'DELETE',
				baseUrl: undefined,
			},
		);
	});
});

describe('Workspaces endpoints', () => {
	it('workspaces.list calls GET /orgs/{orgId}/workspaces', async () => {
		const mockWs = [
			{
				id: 97,
				name: 'Docs',
				docs: [{ id: 'doc1', name: 'Plan' }],
			},
		];
		mockedRequest.mockResolvedValue(mockWs);

		const result = await Workspaces.list(ctx, { orgId: 'current' });
		expect(result).toEqual(mockWs);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orgs/current/workspaces',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: undefined,
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
				baseUrl: undefined,
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
				baseUrl: undefined,
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
			baseUrl: undefined,
		});
	});

	it('docs.get calls GET /docs/{docId}', async () => {
		const mockDoc = { id: 'doc_1', name: 'My Doc' };
		mockedRequest.mockResolvedValue(mockDoc);

		const result = await Docs.get(ctx, { docId: 'doc_1' });
		expect(result).toEqual(mockDoc);
		expect(mockedRequest).toHaveBeenCalledWith('/docs/doc_1', 'test-api-key', {
			method: 'GET',
			baseUrl: undefined,
		});
	});

	it('docs.move calls PATCH /docs/{docId}/move', async () => {
		mockedRequest.mockResolvedValue(null);
		await Docs.move(ctx, { docId: 'doc_1', workspace: 99 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/move',
			'test-api-key',
			{
				method: 'PATCH',
				body: { workspace: 99 },
				baseUrl: undefined,
			},
		);
	});
});

describe('Tables endpoints', () => {
	it('tables.list calls GET /docs/{docId}/tables', async () => {
		const mockTables = {
			tables: [{ id: 'Table1', fields: { tableRef: 1, onDemand: false } }],
		};
		mockedRequest.mockResolvedValue(mockTables);

		const result = await Tables.list(ctx, { docId: 'doc_1' });
		expect(result).toEqual(mockTables);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/tables',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: undefined,
			},
		);
	});

	it('tables.create calls POST /docs/{docId}/tables', async () => {
		const mockCreated = { tables: [{ id: 'People' }] };
		mockedRequest.mockResolvedValue(mockCreated);

		const result = await Tables.create(ctx, {
			docId: 'doc_1',
			tables: [
				{
					id: 'People',
					columns: [{ id: 'pet', fields: { label: 'Pet' } }],
				},
			],
		});
		expect(result).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/tables',
			'test-api-key',
			{
				method: 'POST',
				body: {
					tables: [
						{
							id: 'People',
							columns: [{ id: 'pet', fields: { label: 'Pet' } }],
						},
					],
				},
				baseUrl: undefined,
			},
		);
	});
});

describe('Records endpoints', () => {
	it('records.list queries records with options', async () => {
		const mockRecords = {
			records: [{ id: 1, fields: { pet: 'cat', popularity: 67 } }],
		};
		mockedRequest.mockResolvedValue(mockRecords);

		const result = await Records.list(ctx, {
			docId: 'doc_1',
			tableId: 'Table1',
			limit: 10,
			cellFormat: 'formatted',
		});
		expect(result).toEqual(mockRecords);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/tables/Table1/records',
			'test-api-key',
			{
				method: 'GET',
				query: { limit: 10, cellFormat: 'formatted' },
				baseUrl: undefined,
			},
		);
	});

	it('records.add adds records to a table', async () => {
		const mockResponse = { records: [{ id: 42 }] };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Records.add(ctx, {
			docId: 'doc_1',
			tableId: 'Table1',
			records: [{ fields: { pet: 'bird' } }],
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/tables/Table1/records',
			'test-api-key',
			{
				method: 'POST',
				body: { records: [{ fields: { pet: 'bird' } }] },
				query: undefined,
				baseUrl: undefined,
			},
		);
	});

	it('records.delete deletes records by ID', async () => {
		mockedRequest.mockResolvedValue(null);

		await Records.deleteRecords(ctx, {
			docId: 'doc_1',
			tableId: 'Table1',
			recordIds: [1, 2, 3],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/tables/Table1/records/delete',
			'test-api-key',
			{
				method: 'POST',
				body: [1, 2, 3],
				baseUrl: undefined,
			},
		);
	});
});

describe('Columns endpoints', () => {
	it('columns.list calls GET /docs/{docId}/tables/{tableId}/columns', async () => {
		const mockCols = {
			columns: [{ id: 'col1', fields: { label: 'Name', type: 'Text' } }],
		};
		mockedRequest.mockResolvedValue(mockCols);

		const result = await Columns.list(ctx, {
			docId: 'doc_1',
			tableId: 'Table1',
		});
		expect(result).toEqual(mockCols);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/tables/Table1/columns',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: undefined,
			},
		);
	});

	it('columns.delete calls DELETE /docs/{docId}/tables/{tableId}/columns/{colId}', async () => {
		mockedRequest.mockResolvedValue(null);

		await Columns.deleteColumn(ctx, {
			docId: 'doc_1',
			tableId: 'Table1',
			colId: 'col1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/tables/Table1/columns/col1',
			'test-api-key',
			{
				method: 'DELETE',
				baseUrl: undefined,
			},
		);
	});
});

describe('SQL endpoints', () => {
	it('sql.query sends POST /docs/{docId}/sql', async () => {
		const mockResult = {
			statement: 'SELECT * FROM Table1',
			records: [{ fields: { id: 1, name: 'Alice' } }],
		};
		mockedRequest.mockResolvedValue(mockResult);

		const result = await Sql.query(ctx, {
			docId: 'doc_1',
			sql: 'SELECT * FROM Table1',
			args: [1],
		});
		expect(result).toEqual(mockResult);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/sql',
			'test-api-key',
			{
				method: 'POST',
				body: { sql: 'SELECT * FROM Table1', args: [1] },
				baseUrl: undefined,
			},
		);
	});

	it('sql.queryGet sends GET /docs/{docId}/sql', async () => {
		const mockResult = {
			statement: 'SELECT 1',
			records: [{ fields: { '1': 1 } }],
		};
		mockedRequest.mockResolvedValue(mockResult);

		const result = await Sql.queryGet(ctx, {
			docId: 'doc_1',
			q: 'SELECT 1',
		});
		expect(result).toEqual(mockResult);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/sql',
			'test-api-key',
			{
				method: 'GET',
				query: { q: 'SELECT 1' },
				baseUrl: undefined,
			},
		);
	});
});

describe('Attachments endpoints', () => {
	it('attachments.list calls GET /docs/{docId}/attachments', async () => {
		const mockAtts = {
			records: [{ id: 1, fields: { fileName: 'test.csv', fileSize: 100 } }],
		};
		mockedRequest.mockResolvedValue(mockAtts);

		const result = await Attachments.list(ctx, { docId: 'doc_1' });
		expect(result).toEqual(mockAtts);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/docs/doc_1/attachments',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: undefined,
			},
		);
	});
});

describe('Profile endpoints', () => {
	it('profile.get calls GET /profile/user', async () => {
		const mockProfile = { id: 1, name: 'Alice', email: 'alice@example.com' };
		mockedRequest.mockResolvedValue(mockProfile);

		const result = await Profile.get(ctx, {});
		expect(result).toEqual(mockProfile);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/user',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: undefined,
			},
		);
	});
});

describe('ServiceAccounts endpoints', () => {
	it('serviceAccounts.list calls GET /service-accounts', async () => {
		const mockSAs = [{ id: 'sa_1', name: 'Bot' }];
		mockedRequest.mockResolvedValue(mockSAs);

		const result = await ServiceAccounts.list(ctx, {});
		expect(result).toEqual(mockSAs);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/service-accounts',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: undefined,
			},
		);
	});
});

describe('Templates endpoints', () => {
	it('templates.list calls GET /templates', async () => {
		const mockTpls = [{ id: 1, name: 'Template' }];
		mockedRequest.mockResolvedValue(mockTpls);

		const result = await Templates.list(ctx, {});
		expect(result).toEqual(mockTpls);
		expect(mockedRequest).toHaveBeenCalledWith('/templates', 'test-api-key', {
			method: 'GET',
			baseUrl: undefined,
		});
	});
});

describe('Widgets endpoints', () => {
	it('widgets.list calls GET /widgets', async () => {
		const mockWidgets = [{ name: 'Calendar' }];
		mockedRequest.mockResolvedValue(mockWidgets);

		const result = await Widgets.list(ctx, {});
		expect(result).toEqual(mockWidgets);
		expect(mockedRequest).toHaveBeenCalledWith('/widgets', 'test-api-key', {
			method: 'GET',
			baseUrl: undefined,
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
				baseUrl: undefined,
			},
		);
	});
});

describe('Session endpoints', () => {
	it('session.getActive calls GET /session/access/active', async () => {
		const mockSession = { user: { id: 1, name: 'Alice' } };
		mockedRequest.mockResolvedValue(mockSession);

		const result = await Session.getActive(ctx, {});
		expect(result).toEqual(mockSession);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/session/access/active',
			'test-api-key',
			{
				method: 'GET',
				baseUrl: undefined,
			},
		);
	});
});

describe('Validation prevents network calls on invalid input', () => {
	it('rejects empty docId before network call', async () => {
		// unknown because rejection value has no static type; assertions narrow it
		const err = await Docs.get(ctx, { docId: '' }).catch(
			(caught: unknown) => caught,
		);
		expect(err).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
