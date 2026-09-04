import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import * as Structures from './endpoints/structures';
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

describe('structure.list', () => {
	it('sends GET /structures with pagination parameters', async () => {
		const mockResponse = {
			structures: [{ structure_id: 'struct-001' }],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 1,
				total_pages: 1,
			},
		};

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'structures' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.create', () => {
	it('sends POST /structures with body', async () => {
		const mockResponse = { structure_id: 'struct-001', name: 'New structure' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.create(ctx, {
			body: { name: 'New structure' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'structures' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.get', () => {
	it('sends GET /structures/{structure_id}', async () => {
		const mockResponse = { structure_id: 'struct-001', name: 'My structure' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.get(ctx, { structure_id: 'struct-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'structures/struct-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.update', () => {
	it('sends PATCH /structures/{structure_id} with body', async () => {
		const mockResponse = { structure_id: 'struct-001', name: 'Renamed' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.update(ctx, {
			structure_id: 'struct-001',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'structures/struct-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.remove', () => {
	it('sends DELETE /structures/{structure_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Structures.remove(ctx, {
			structure_id: 'struct-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'structures/struct-001',
			}),
		);

		expect(result).toEqual(undefined);
	});
});

describe('structure.dashboard', () => {
	it('sends GET /dashboards/structures with dashboard query', async () => {
		const mockResponse = { runs: 12, period: 'daily' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.dashboard(ctx, {
			start_time: '2026-01-01T00:00:00Z',
			end_time: '2026-02-01T00:00:00Z',
			period: 'daily',
			structure_ids: ['struct-001'],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'dashboards/structures',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.listRuns', () => {
	it('sends GET /structures/{structure_id}/runs', async () => {
		const mockResponse = { runs: [{ run_id: 'run-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.listRuns(ctx, {
			structure_id: 'struct-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'structures/struct-001/runs',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.listDeployments', () => {
	it('sends GET /structures/{structure_id}/deployments', async () => {
		const mockResponse = { deployments: [{ deployment_id: 'deploy-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.listDeployments(ctx, {
			structure_id: 'struct-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'structures/struct-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.createDeployment', () => {
	it('sends POST /structures/{structure_id}/deployments with body', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'pending' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.createDeployment(ctx, {
			structure_id: 'struct-001',
			body: { environment: 'production' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'structures/struct-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structureDashboard input schema', () => {
	it('accepts a well-formed dashboard query', () => {
		const parsed = GriptapeEndpointInputSchemas.structureDashboard.safeParse({
			start_time: '2026-01-01T00:00:00Z',
			end_time: '2026-02-01T00:00:00Z',
			period: 'daily',
			structure_ids: ['struct-001'],
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects non-array structure_ids', () => {
		const parsed = GriptapeEndpointInputSchemas.structureDashboard.safeParse({
			structure_ids: 'struct-001',
		});

		expect(parsed.success).toBe(false);
	});
});
