import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { makeFireberryRequest } from './client';
import {
	Batch,
	CustomFields,
	CustomObjects,
	Files,
	Metadata,
	Records,
} from './endpoints';
import { getFireberryRecordPath } from './endpoints/record-routes';
import type { FireberryContext } from './index';
import { fireberry, fireberryEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});
jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue(null) };
});

const mockRequest = jest.mocked(request);
const mockLogEventFromContext = jest.mocked(logEventFromContext);
const unusedEndpoint = async (): Promise<never> => {
	throw new Error('Endpoint stubs are not invoked by this test');
};
const endpointContext = {
	key: 'secret',
	options: {},
	db: {},
	keys: {
		get_dek: async () => 'dek',
		issue_new_dek: async () => 'dek',
		get_api_key: async () => 'secret',
		get_webhook_signature: async () => null,
		set_api_key: async () => undefined,
		set_webhook_signature: async () => undefined,
	},
	$getAccountId: async () => 'test-account',
	endpoints: {
		records: {
			list: unusedEndpoint,
			get: unusedEndpoint,
			create: unusedEndpoint,
			update: unusedEndpoint,
			delete: unusedEndpoint,
			query: unusedEndpoint,
			legacyQuery: unusedEndpoint,
			related: unusedEndpoint,
			items: unusedEndpoint,
		},
		metadata: {
			objects: unusedEndpoint,
			object: unusedEndpoint,
			fields: unusedEndpoint,
			field: unusedEndpoint,
			picklist: unusedEndpoint,
		},
		customFields: {
			create: unusedEndpoint,
			update: unusedEndpoint,
			delete: unusedEndpoint,
		},
		customObjects: {
			create: unusedEndpoint,
			update: unusedEndpoint,
			delete: unusedEndpoint,
		},
		files: { create: unusedEndpoint },
		batch: {
			create: unusedEndpoint,
			update: unusedEndpoint,
			delete: unusedEndpoint,
		},
	},
} satisfies FireberryContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ success: true, data: {}, message: '' });
	mockLogEventFromContext.mockReset();
	mockLogEventFromContext.mockResolvedValue(null);
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
			'records.legacyQuery',
			'records.related',
			'records.items',
			'metadata.objects',
			'metadata.object',
			'metadata.fields',
			'metadata.field',
			'metadata.picklist',
			'customFields.create',
			'customFields.update',
			'customFields.delete',
			'customObjects.create',
			'customObjects.update',
			'customObjects.delete',
			'files.create',
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
			'legacyQuery',
			'related',
			'items',
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
		expect(Object.keys(plugin.endpoints.customFields)).toEqual([
			'create',
			'update',
			'delete',
		]);
		expect(Object.keys(plugin.endpoints.customObjects)).toEqual([
			'create',
			'update',
			'delete',
		]);
		expect(Object.keys(plugin.endpoints.files)).toEqual(['create']);
		expect(plugin.webhooks).toEqual({});
	});

	it('executes each registered non-upload operation on its documented method, path, and body', async () => {
		const recordList = {
			success: true,
			data: {
				PrimaryKey: 'accountid',
				PrimaryField: 'accountname',
				Total_Records: 0,
				Page_Size: 50,
				Page_Number: 1,
				Records: [],
			},
			message: '',
		};
		const record = {
			success: true,
			data: { Record: { accountname: 'Example' } },
			message: '',
		};
		const emptyEnvelope = { success: true, data: null, message: '' };
		const query = {
			success: true,
			data: [],
			message: '',
			pageNumber: 1,
			pageSize: 25,
			isLastPage: true,
		};
		const legacyQuery = { success: true, data: {}, message: '' };
		const field = {
			success: true,
			data: {
				label: 'Name',
				fieldName: 'name',
				systemFieldTypeId: 'string',
				fieldObjectType: 'account',
				systemName: 'name',
			},
			message: '',
		};
		const calls = [
			{
				run: () => Records.list(endpointContext, { object: 'account' }),
				response: recordList,
				method: 'GET',
				path: '/api/record/account',
			},
			{
				run: () =>
					Records.get(endpointContext, { object: 'contract', id: 'record-id' }),
				response: record,
				method: 'GET',
				path: '/api/record/contract/record-id',
			},
			{
				run: () =>
					Records.create(endpointContext, {
						object: 'account',
						data: { accountname: 'Example' },
					}),
				response: record,
				method: 'POST',
				path: '/api/record/account',
				body: { accountname: 'Example' },
			},
			{
				// Live PUT response: data is the record id and the record sits under `record`.
				// A partial body without the primary field is accepted by the live API.
				run: () =>
					Records.update(endpointContext, {
						object: 'account',
						id: 'record-id',
						data: { description: 'Changed' },
					}),
				response: {
					success: true,
					data: 'record-id',
					message: '',
					record: {
						accountid: 'record-id',
						accountname: 'Example',
						description: 'Changed',
						telephone1: null,
					},
				},
				method: 'PUT',
				path: '/api/record/account/record-id',
				body: { description: 'Changed' },
			},
			{
				run: () =>
					Records.delete(endpointContext, {
						object: 'account',
						id: 'record-id',
					}),
				response: emptyEnvelope,
				method: 'DELETE',
				path: '/api/record/account/record-id',
			},
			{
				run: () =>
					Records.query(endpointContext, {
						objectType: 1,
						fields: [{ name: 'accountname' }],
					}),
				response: query,
				method: 'POST',
				path: '/api/v3/query',
				body: { objectType: 1, fields: [{ name: 'accountname' }] },
			},
			{
				run: () =>
					Records.legacyQuery(endpointContext, {
						objecttype: 1,
						fields: 'accountname',
					}),
				response: legacyQuery,
				method: 'POST',
				path: '/api/query',
				body: { objecttype: 1, fields: 'accountname' },
			},
			{
				run: () =>
					Records.related(endpointContext, {
						objectType: 1,
						id: 'record-id',
						relatedObjectType: 2,
					}),
				response: recordList,
				method: 'GET',
				path: '/api/record/1/record-id/2',
			},
			{
				run: () =>
					Records.items(endpointContext, {
						itemType: 'order',
						id: 'record-id',
					}),
				response: {},
				method: 'GET',
				path: '/api/v2/record/13/record-id/items',
			},
			{
				run: () => Metadata.objects(endpointContext, {}),
				response: { success: true, data: [], message: '' },
				method: 'GET',
				path: '/metadata/records',
			},
			{
				run: () => Metadata.object(endpointContext, { id: 1 }),
				response: { success: true, data: {}, message: '' },
				method: 'GET',
				path: '/metadata/records/1',
			},
			{
				run: () => Metadata.fields(endpointContext, { id: 1 }),
				response: { success: true, data: {}, message: '' },
				method: 'GET',
				path: '/metadata/records/1/fields',
			},
			{
				run: () =>
					Metadata.field(endpointContext, { id: 1, fieldName: 'name' }),
				response: field,
				method: 'GET',
				path: '/metadata/records/1/fields/name',
			},
			{
				run: () =>
					Metadata.picklist(endpointContext, {
						id: 1,
						fieldName: 'statuscode',
					}),
				response: field,
				method: 'GET',
				path: '/metadata/records/1/fields/statuscode/values',
			},
			{
				run: () =>
					CustomFields.create(endpointContext, {
						objectType: 1,
						fieldType: 'text',
						data: { fieldName: 'pcfdisplay', label: 'Display' },
					}),
				response: {},
				method: 'POST',
				path: '/api/v2/system-field/1/text',
				body: { fieldName: 'pcfdisplay', label: 'Display' },
			},
			{
				run: () =>
					CustomFields.update(endpointContext, {
						objectType: 1,
						fieldType: 'text',
						fieldName: 'pcfdisplay',
						data: { label: 'New Display' },
					}),
				response: {},
				method: 'PUT',
				path: '/api/v2/system-field/1/text/pcfdisplay',
				body: { label: 'New Display' },
			},
			{
				run: () =>
					CustomFields.delete(endpointContext, {
						objectType: 1,
						fieldType: 'text',
						fieldName: 'pcfdisplay',
					}),
				response: {},
				method: 'DELETE',
				path: '/api/v2/system-field/1/text/pcfdisplay',
			},
			{
				run: () =>
					CustomObjects.create(endpointContext, {
						name: 'Asset',
						collectionname: 'Assets',
					}),
				response: {},
				method: 'POST',
				path: '/api/v2/record/58',
				body: { name: 'Asset', collectionname: 'Assets' },
			},
			{
				run: () =>
					CustomObjects.update(endpointContext, { id: '58', name: 'Asset' }),
				response: {},
				method: 'PUT',
				path: '/api/v2/record/58/58',
				body: { name: 'Asset' },
			},
			{
				run: () => CustomObjects.delete(endpointContext, { id: '58' }),
				response: {},
				method: 'DELETE',
				path: '/api/record/58/58',
			},
			{
				run: () =>
					Batch.create(endpointContext, {
						objectCode: 'account',
						data: [{ accountname: 'Example' }],
					}),
				response: {},
				method: 'POST',
				path: '/api/v3/record/account/batch/create',
				body: { data: [{ accountname: 'Example' }] },
			},
			{
				run: () =>
					Batch.update(endpointContext, {
						objectCode: 'account',
						data: [{ id: 'record-id', record: { accountname: 'Changed' } }],
					}),
				response: {},
				method: 'POST',
				path: '/api/v3/record/account/batch/update',
				body: {
					data: [{ id: 'record-id', record: { accountname: 'Changed' } }],
				},
			},
			{
				run: () =>
					Batch.delete(endpointContext, {
						objectCode: 'account',
						ids: ['record-id'],
					}),
				response: {},
				method: 'POST',
				path: '/api/v3/record/account/batch/delete',
				body: { data: ['record-id'] },
			},
		] as const;
		for (const [index, call] of calls.entries()) {
			mockRequest.mockResolvedValueOnce(call.response);
			await call.run();
			expect(mockRequest.mock.calls[index]?.[1]).toMatchObject({
				method: call.method,
				url: call.path,
			});
			if ('body' in call) {
				expect(mockRequest.mock.calls[index]?.[1]?.body).toEqual(call.body);
			} else {
				expect(mockRequest.mock.calls[index]?.[1]?.body).toBeUndefined();
			}
		}
	});

	it('validates direct handler inputs and resolves Batch wire names to payload schemas', async () => {
		await expect(
			Records.create(endpointContext, {
				object: 'account',
				data: { accountname: 42 },
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();

		await expect(
			Batch.create(endpointContext, {
				objectCode: 'accountproduct',
				data: [{ accountid: 42 }],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();

		await expect(
			Batch.update(endpointContext, {
				objectCode: 'crmuser',
				data: [{ id: 'user-id', record: { emailaddress1: 42 } }],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();

		mockRequest.mockResolvedValueOnce({});
		await Batch.create(endpointContext, {
			objectCode: 'accountproduct',
			data: [{ accountid: 'account-id', productid: 'product-id' }],
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/api/v3/record/accountproduct/batch/create',
		});
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

	it('maps irregular REST paths and rejects undocumented resource verbs', () => {
		// The reference lists /api/record/contracts, but the live API answers 400 "Invalid Object Name" there.
		expect(getFireberryRecordPath('contract', 'list')).toBe(
			'/api/record/contract',
		);
		expect(getFireberryRecordPath('contract', 'create')).toBe(
			'/api/record/Contract',
		);
		expect(getFireberryRecordPath('invoice', 'get', 'record-id')).toBe(
			'/api/record/invoiceno/record-id',
		);
		expect(getFireberryRecordPath('transactionItem', 'get', 'record-id')).toBe(
			'/api/record/transactionItem/record-id',
		);
		expect(getFireberryRecordPath('user', 'update', 'record-id')).toBe(
			'/api/record/crmuser/record-id',
		);
		expect(getFireberryRecordPath('1024', 'create')).toBe('/api/record/1024');
		expect(() => getFireberryRecordPath('note', 'update', 'record-id')).toThrow(
			'Unsupported Fireberry update',
		);
		expect(() =>
			getFireberryRecordPath('transaction', 'delete', 'record-id'),
		).toThrow('Unsupported Fireberry delete');
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

	it('throws when Fireberry answers a custom field delete with success: false', async () => {
		mockRequest.mockResolvedValueOnce({ success: false });
		mockLogEventFromContext.mockClear();
		await expect(
			CustomFields.delete(endpointContext, {
				objectType: 1,
				fieldType: 'text',
				fieldName: 'pcfdisplay',
			}),
		).rejects.toThrow('Fireberry did not delete the field');
		expect(mockLogEventFromContext).not.toHaveBeenCalled();
	});

	it('accepts an empty Batch delete response and logs successful completion', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		const result = await Batch.delete(endpointContext, {
			objectCode: 'account',
			ids: ['record-id'],
		});
		expect(result).toBeUndefined();
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			endpointContext,
			'fireberry.batch.delete',
			{ count: 1 },
			'completed',
		);
	});

	it('accepts the bare `true` body the live file upload returns', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('true', { status: 200 }));
		const result = await Files.create(endpointContext, {
			objectId: '1',
			recordId: 'record-id',
			fileName: 'readme.txt',
			fileBase64: 'SGVsbG8=',
		});
		expect(result).toBe(true);
		fetchSpy.mockRestore();
	});
});
