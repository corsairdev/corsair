import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import * as Tools from './endpoints/tools';
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

describe('tool.list', () => {
	it('sends GET /tools with pagination parameters', async () => {
		const mockResponse = {
			tools: [{ tool_id: 'tool-001' }],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 1,
				total_pages: 1,
			},
		};

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'tools' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.create', () => {
	it('sends POST /tools with body', async () => {
		const mockResponse = { tool_id: 'tool-001', name: 'New tool' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.create(ctx, {
			body: { name: 'New tool' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'tools' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.get', () => {
	it('sends GET /tools/{tool_id}', async () => {
		const mockResponse = { tool_id: 'tool-001', name: 'My tool' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.get(ctx, { tool_id: 'tool-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'tools/tool-001' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.update', () => {
	it('sends PATCH /tools/{tool_id} with body', async () => {
		const mockResponse = { tool_id: 'tool-001', name: 'Renamed' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.update(ctx, {
			tool_id: 'tool-001',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'PATCH', url: 'tools/tool-001' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.remove', () => {
	it('sends DELETE /tools/{tool_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Tools.remove(ctx, { tool_id: 'tool-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'DELETE', url: 'tools/tool-001' }),
		);

		expect(result).toEqual(undefined);
	});
});

describe('tool.listRuns', () => {
	it('sends GET /tools/{tool_id}/runs', async () => {
		const mockResponse = { runs: [{ run_id: 'run-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.listRuns(ctx, { tool_id: 'tool-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'tools/tool-001/runs',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.listDeployments', () => {
	it('sends GET /tools/{tool_id}/deployments', async () => {
		const mockResponse = { deployments: [{ deployment_id: 'deploy-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.listDeployments(ctx, { tool_id: 'tool-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'tools/tool-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.createDeployment', () => {
	it('sends POST /tools/{tool_id}/deployments with body', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'pending' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.createDeployment(ctx, {
			tool_id: 'tool-001',
			body: { environment: 'production' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'tools/tool-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.deploymentStatus', () => {
	it('sends GET /deployments/{deployment_id}', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'ready' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.deploymentStatus(ctx, {
			deployment_id: 'deploy-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'deployments/deploy-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('toolDeploymentStatus input schema', () => {
	it('accepts a well-formed deployment id', () => {
		const parsed = GriptapeEndpointInputSchemas.toolDeploymentStatus.safeParse({
			deployment_id: 'deploy-001',
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects an empty deployment id', () => {
		const parsed = GriptapeEndpointInputSchemas.toolDeploymentStatus.safeParse({
			deployment_id: '',
		});

		expect(parsed.success).toBe(false);
	});
});
