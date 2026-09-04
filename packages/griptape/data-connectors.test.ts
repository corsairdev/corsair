import { request } from 'corsair/http';
import * as DataConnectors from './endpoints/data-connectors';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('griptape data-connectors endpoints', () => {
	const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;
	const connectorId = '550e8400-e29b-41d4-a716-446655440020';
	const dataJobId = '550e8400-e29b-41d4-a716-446655440021';

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('list sends GET data-connectors with pagination', async () => {
		const payload = { data: [], pagination: { page_number: 1 } };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.list(ctx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'data-connectors' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST data-connectors', async () => {
		const payload = { data_connector_id: connectorId, name: 'dc-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.create(ctx, {
			body: { name: 'dc-one' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'data-connectors' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET data-connectors/{id}', async () => {
		const payload = { data_connector_id: connectorId, name: 'dc-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.get(ctx, {
			data_connector_id: connectorId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `data-connectors/${connectorId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH data-connectors/{id}', async () => {
		const payload = { data_connector_id: connectorId, name: 'dc-renamed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.update(ctx, {
			data_connector_id: connectorId,
			body: { name: 'dc-renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: `data-connectors/${connectorId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE data-connectors/{id}', async () => {
		const payload = undefined as unknown as Record<string, never>;
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.remove(ctx, {
			data_connector_id: connectorId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: `data-connectors/${connectorId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('createJob sends POST data-connectors/{id}/data-jobs', async () => {
		const payload = { data_job_id: dataJobId, status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.createJob(ctx, {
			data_connector_id: connectorId,
			body: { source: 's3' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `data-connectors/${connectorId}/data-jobs`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getDataJob sends GET data-jobs/{id}', async () => {
		const payload = { data_job_id: dataJobId, status: 'done' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.getDataJob(ctx, {
			data_job_id: dataJobId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `data-jobs/${dataJobId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('cancelDataJob sends POST data-jobs/{id}/cancel', async () => {
		const payload = { data_job_id: dataJobId, status: 'cancelled' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.cancelDataJob(ctx, {
			data_job_id: dataJobId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `data-jobs/${dataJobId}/cancel`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates dataConnectorCreateJob input', () => {
		const parsed =
			GriptapeEndpointInputSchemas.dataConnectorCreateJob.safeParse({
				data_connector_id: connectorId,
				body: { source: 's3' },
			});

		expect(parsed.success).toBe(true);
	});

	it('rejects dataConnectorCreateJob with an empty connector id', () => {
		const parsed =
			GriptapeEndpointInputSchemas.dataConnectorCreateJob.safeParse({
				data_connector_id: '',
			});

		expect(parsed.success).toBe(false);
	});
});
