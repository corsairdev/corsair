import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { create, get, list, remove, update } from './endpoints/integrations';
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
const mockLog = jest.mocked(logEventFromContext);

const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('integrations endpoints', () => {
	it('list sends GET /integrations with pagination', async () => {
		const payload = {
			items: [{ integration_id: 'integration-001', name: 'Slack bridge' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await list(ctx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'integrations' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST /integrations', async () => {
		const payload = { integration_id: 'integration-002', name: 'New hook' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await create(ctx, { body: { name: 'New hook' } });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'integrations' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET /integrations/{integration_id}', async () => {
		const payload = { integration_id: 'integration-003', name: 'Webhook' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await get(ctx, { integration_id: 'integration-003' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'integrations/integration-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH /integrations/{integration_id}', async () => {
		const payload = { integration_id: 'integration-004', name: 'Renamed' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await update(ctx, {
			integration_id: 'integration-004',
			body: { name: 'Renamed' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'integrations/integration-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /integrations/{integration_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await remove(ctx, { integration_id: 'integration-005' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'integrations/integration-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('integrations input schemas', () => {
	it('accepts a valid integrationGet input', () => {
		const parsed = GriptapeEndpointInputSchemas.integrationGet.safeParse({
			integration_id: 'integration-003',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty integration_id for integrationGet', () => {
		const parsed = GriptapeEndpointInputSchemas.integrationGet.safeParse({
			integration_id: '',
		});
		expect(parsed.success).toBe(false);
	});
});
