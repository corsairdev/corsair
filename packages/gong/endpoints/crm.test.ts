import { request } from 'corsair/http';
import {
	deleteCrmIntegration,
	getCrmObjects,
	getCrmRequestStatus,
	listCrmIntegrations,
	listCrmSchemaFields,
	registerCrmIntegration,
	uploadCrmObjects,
	uploadCrmSchemaFields,
} from './crm';
import { GongCrmInputSchemas, GongCrmOutputSchemas } from './crm-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'token',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://us-123.api.gong.io',
	},
	$getAccountId: async () => 'account-id',
};

describe('Gong CRM operations', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('validates every CRM operation boundary', () => {
		for (const [name, schema] of Object.entries(GongCrmInputSchemas)) {
			expect(schema.safeParse({}).success).toBe(name === 'listIntegrations');
		}
		expect(
			GongCrmOutputSchemas.listIntegrations.safeParse({
				requestId: 'r',
				integrations: [],
			}).success,
		).toBe(true);
		expect(
			GongCrmOutputSchemas.getRequestStatus.safeParse({
				requestId: 'r',
				status: 'DONE',
			}).success,
		).toBe(true);
	});
	it('lists integrations', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', integrations: [] });
		await listCrmIntegrations(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/v2/crm/integrations' }),
		);
	});
	it('registers integration with documented JSON body', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', integrationId: 42 });
		const body = { name: 'Example', ownerEmail: 'owner@example.com' };
		await registerCrmIntegration(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: '/v2/crm/integrations',
				body,
			}),
		);
	});
	it('deletes an integration using both documented query parameters', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r',
			clientRequestId: 'req-1',
		});
		await deleteCrmIntegration(ctx, {
			integrationId: 12,
			clientRequestId: 'req-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'DELETE',
				url: '/v2/crm/integrations',
				query: { integrationId: 12, clientRequestId: 'req-1' },
			}),
		);
	});
	it('lists schema fields with query parameters', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r',
			objectTypeToSelectedFields: {},
		});
		await listCrmSchemaFields(ctx, {
			integrationId: 12,
			objectType: 'ACCOUNT',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/crm/entity-schema',
				query: { integrationId: 12, objectType: 'ACCOUNT' },
			}),
		);
	});
	it('uploads schema fields as a JSON array body', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r' });
		const field = {
			uniqueName: 'owner',
			label: 'Owner',
			type: 'STRING' as const,
		};
		await uploadCrmSchemaFields(ctx, {
			integrationId: 12,
			objectType: 'ACCOUNT',
			fields: [field],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/crm/entity-schema',
				query: { integrationId: 12, objectType: 'ACCOUNT' },
				body: [field],
			}),
		);
	});
	it('requests CRM objects with the documented GET body', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', crmObjectsMap: {} });
		await getCrmObjects(ctx, {
			integrationId: 12,
			objectType: 'DEAL',
			objectsCrmIds: ['a'],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/crm/entities',
				query: { integrationId: 12, objectType: 'DEAL' },
				body: ['a'],
			}),
		);
	});
	it('uploads CRM file as multipart form data', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r',
			clientRequestId: 'req-1',
		});
		const dataFile = new Blob(['{}\n'], { type: 'application/x-ndjson' });
		await uploadCrmObjects(ctx, {
			integrationId: 12,
			objectType: 'ACCOUNT',
			clientRequestId: 'req-1',
			dataFile,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/crm/entities',
				query: {
					integrationId: 12,
					objectType: 'ACCOUNT',
					clientRequestId: 'req-1',
				},
				formData: { dataFile },
			}),
		);
	});
	it('checks asynchronous upload status', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', status: 'DONE' });
		await getCrmRequestStatus(ctx, {
			integrationId: 12,
			clientRequestId: 'req-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/crm/request-status',
				query: { integrationId: 12, clientRequestId: 'req-1' },
			}),
		);
	});
});
