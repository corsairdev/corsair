import {
	XataEndpointInputSchemas,
	XataEndpointOutputSchemas,
	XataRecordSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { xata, xataAuthConfig, xataEndpointSchemas } from './index';

describe('Xata Plugin Interface Tests', () => {
	it('initializes xata plugin with default options', () => {
		const plugin = xata({ key: 'test_api_key' });
		expect(plugin.id).toBe('xata');
		expect((plugin.options as any).authType).toBe('api_key');
		expect(plugin.options!.key).toBe('test_api_key');
		expect(plugin.authConfig).toEqual(xataAuthConfig);
	});

	it('registers all required endpoints and schemas', () => {
		const plugin = xata({ key: 'test_key' });
		expect(plugin.endpoints!.workspaces.list).toBeDefined();
		expect(plugin.endpoints!.databases.list).toBeDefined();
		expect(plugin.endpoints!.records.create).toBeDefined();
		expect(plugin.endpoints!.records.get).toBeDefined();
		expect(plugin.endpoints!.records.update).toBeDefined();
		expect(plugin.endpoints!.records.delete).toBeDefined();
		expect(plugin.endpoints!.records.query).toBeDefined();
		expect(plugin.endpoints!.organizations.list).toBeDefined();
		expect(plugin.endpoints!.regions.list).toBeDefined();
		expect(plugin.endpoints!.images.list).toBeDefined();
		expect(plugin.endpoints!.instanceTypes.list).toBeDefined();
		expect(plugin.endpoints!.extensions.list).toBeDefined();

		expect(xataEndpointSchemas['workspaces.list']).toBeDefined();
		expect(xataEndpointSchemas['databases.list']).toBeDefined();
		expect(xataEndpointSchemas['records.create']).toBeDefined();
		expect(xataEndpointSchemas['records.get']).toBeDefined();
		expect(xataEndpointSchemas['records.update']).toBeDefined();
		expect(xataEndpointSchemas['records.delete']).toBeDefined();
		expect(xataEndpointSchemas['records.query']).toBeDefined();
		expect(xataEndpointSchemas['organizations.list']).toBeDefined();
		expect(xataEndpointSchemas['regions.list']).toBeDefined();
		expect(xataEndpointSchemas['images.list']).toBeDefined();
		expect(xataEndpointSchemas['instanceTypes.list']).toBeDefined();
		expect(xataEndpointSchemas['extensions.list']).toBeDefined();
	});

	it('validates WorkspacesList input/output schemas', () => {
		const input = {};
		const parsedInput = XataEndpointInputSchemas.workspacesList.parse(input);
		expect(parsedInput).toEqual({});

		const mockOutput = {
			workspaces: [
				{ id: 'ws_1', name: 'Main Workspace', slug: 'main-ws', role: 'owner' },
			],
		};
		const parsedOutput =
			XataEndpointOutputSchemas.workspacesList.parse(mockOutput);
		expect(parsedOutput.workspaces).toHaveLength(1);
		expect(parsedOutput.workspaces[0]?.id).toBe('ws_1');
	});

	it('validates DatabasesList input/output schemas', () => {
		const input = { workspaceId: 'ws_1' };
		const parsedInput = XataEndpointInputSchemas.databasesList.parse(input);
		expect(parsedInput.workspaceId).toBe('ws_1');

		const mockOutput = {
			dbs: [{ name: 'test-db', createdAt: '2026-01-01T00:00:00Z' }],
		};
		const parsedOutput =
			XataEndpointOutputSchemas.databasesList.parse(mockOutput);
		expect(parsedOutput.dbs).toHaveLength(1);
		expect(parsedOutput.dbs[0]?.name).toBe('test-db');
	});

	it('validates Record CRUD schemas with passthrough fields', () => {
		const recordInput = {
			workspaceId: 'ws_1',
			region: 'us-east-1',
			dbName: 'my-db',
			tableName: 'users',
			data: { name: 'John Doe', email: 'john@example.com' },
		};
		const parsedInput =
			XataEndpointInputSchemas.recordsCreate.parse(recordInput);
		expect(parsedInput.tableName).toBe('users');

		const mockRecord = {
			id: 'rec_123',
			xata: { version: 1, createdAt: '2026-01-01T00:00:00Z' },
			name: 'John Doe',
			email: 'john@example.com',
		};
		const parsedRecord = XataRecordSchema.parse(mockRecord);
		expect(parsedRecord.id).toBe('rec_123');
		expect((parsedRecord as Record<string, unknown>).name).toBe('John Doe');
	});

	it('validates RecordsQuery input/output schemas', () => {
		const queryInput = {
			workspaceId: 'ws_1',
			region: 'us-east-1',
			dbName: 'my-db',
			tableName: 'users',
			filter: { role: 'admin' },
			sort: { createdAt: 'desc' as const },
			page: { size: 10 },
		};
		const parsedQueryInput =
			XataEndpointInputSchemas.recordsQuery.parse(queryInput);
		expect(parsedQueryInput.dbName).toBe('my-db');

		const mockQueryOutput = {
			records: [
				{
					id: 'rec_admin_1',
					role: 'admin',
				},
			],
			meta: {
				page: {
					cursor: 'cur_abc123',
					more: false,
				},
			},
		};
		const parsedQueryOutput =
			XataEndpointOutputSchemas.recordsQuery.parse(mockQueryOutput);
		expect(parsedQueryOutput.records).toHaveLength(1);
		expect(parsedQueryOutput.meta?.page?.cursor).toBe('cur_abc123');
	});

	it('correctly maps error handlers', () => {
		expect(errorHandlers.AUTH_ERROR).toBeDefined();
		expect(errorHandlers.RATE_LIMIT_ERROR).toBeDefined();
		expect(errorHandlers.PERMISSION_ERROR).toBeDefined();
		expect(errorHandlers.NOT_FOUND_ERROR).toBeDefined();
		expect(errorHandlers.VALIDATION_ERROR).toBeDefined();
		expect(errorHandlers.NETWORK_ERROR).toBeDefined();

		const isAuth = errorHandlers.AUTH_ERROR.match(
			new Error('unauthorized access'),
		);
		expect(isAuth).toBe(true);

		const isNotFound = errorHandlers.NOT_FOUND_ERROR.match(
			new Error('record_not_found'),
		);
		expect(isNotFound).toBe(true);
	});
});
