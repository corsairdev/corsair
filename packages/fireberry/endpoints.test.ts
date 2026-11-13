import { request } from 'corsair/http';
import { makeFireberryRequest } from './client';
import { fireberry, fireberryEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ success: true, data: {}, message: '' });
});

describe('registered Fireberry operations and route semantics', () => {
	it('keeps implementation, schema, and metadata operation registries aligned', () => {
		const plugin = fireberry({ key: 'secret' });
		const operationNames = [
			'records.list',
			'records.get',
			'records.create',
			'records.update',
			'records.delete',
			'records.query',
			'metadata.objects',
			'metadata.object',
			'metadata.fields',
			'metadata.field',
			'metadata.picklist',
			'batch.create',
			'batch.update',
			'batch.delete',
		];
		expect(Object.keys(fireberryEndpointSchemas).sort()).toEqual(
			operationNames.sort(),
		);
		if (!plugin.endpointMeta || !plugin.endpoints)
			throw new Error('Fireberry endpoints are not registered');
		expect(Object.keys(plugin.endpointMeta).sort()).toEqual(
			operationNames.sort(),
		);
		expect(Object.keys(plugin.endpoints.records)).toEqual([
			'list',
			'get',
			'create',
			'update',
			'delete',
			'query',
		]);
		expect(Object.keys(plugin.endpoints.metadata)).toEqual([
			'objects',
			'object',
			'fields',
			'field',
			'picklist',
		]);
		expect(Object.keys(plugin.endpoints.batch)).toEqual([
			'create',
			'update',
			'delete',
		]);
		expect(plugin.webhooks).toEqual({});
	});

	it('sends records CRUD operations on the documented REST paths and verbs', async () => {
		const cases = [
			{ path: '/api/record/account', method: 'GET' as const },
			{ path: '/api/record/account/record-id', method: 'GET' as const },
			{
				path: '/api/record/account',
				method: 'POST' as const,
				body: { accountname: 'Example' },
			},
			{
				path: '/api/record/account/record-id',
				method: 'PUT' as const,
				body: { accountname: 'Changed' },
			},
			{ path: '/api/record/account/record-id', method: 'DELETE' as const },
		];
		for (const item of cases) {
			await makeFireberryRequest(item.path, 'secret', {
				method: item.method,
				body: item.body,
			});
		}
		expect(mockRequest.mock.calls.map((call) => call[1]?.method)).toEqual(
			cases.map((item) => item.method),
		);
		expect(mockRequest.mock.calls.map((call) => call[1]?.url)).toEqual(
			cases.map((item) => item.path),
		);
	});

	it('sends query and metadata endpoints using their documented paths', async () => {
		const paths = [
			'/api/v3/query',
			'/metadata/records',
			'/metadata/records/1',
			'/metadata/records/1/fields',
			'/metadata/records/1/fields/accountname',
			'/metadata/records/1/fields/industrycode/values',
		];
		for (const path of paths) {
			await makeFireberryRequest(path, 'secret', {
				method: path.endsWith('/query') ? 'POST' : 'GET',
				metadata: path.startsWith('/metadata/'),
				body: path.endsWith('/query')
					? { objectType: 1, fields: [{ name: 'accountname' }] }
					: undefined,
			});
		}
		expect(mockRequest.mock.calls.map((call) => call[1]?.url)).toEqual(paths);
		expect(mockRequest.mock.calls[0]?.[1]?.method).toBe('POST');
		expect(mockRequest.mock.calls[1]?.[1]?.query).toEqual({
			tokenid: 'secret',
		});
	});

	it('uses Batch v3 paths and Fireberry create/update/delete body shapes', async () => {
		await makeFireberryRequest(
			'/api/v3/record/account/batch/create',
			'secret',
			{
				method: 'POST',
				body: { data: [{ accountname: 'Example' }] },
			},
		);
		await makeFireberryRequest(
			'/api/v3/record/account/batch/update',
			'secret',
			{
				method: 'POST',
				body: {
					data: [{ id: 'record-id', record: { accountname: 'Changed' } }],
				},
			},
		);
		await makeFireberryRequest(
			'/api/v3/record/account/batch/delete',
			'secret',
			{
				method: 'POST',
				body: { data: ['record-id'] },
			},
		);
		expect(mockRequest.mock.calls.map((call) => call[1]?.url)).toEqual([
			'/api/v3/record/account/batch/create',
			'/api/v3/record/account/batch/update',
			'/api/v3/record/account/batch/delete',
		]);
		expect(mockRequest.mock.calls.map((call) => call[1]?.body)).toEqual([
			{ data: [{ accountname: 'Example' }] },
			{ data: [{ id: 'record-id', record: { accountname: 'Changed' } }] },
			{ data: ['record-id'] },
		]);
	});
});
