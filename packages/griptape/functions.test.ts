import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import * as Functions from './endpoints/functions';
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

describe('function.list', () => {
	it('sends GET /functions with pagination parameters', async () => {
		const mockResponse = {
			functions: [{ function_id: 'func-001' }],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 1,
				total_pages: 1,
			},
		};

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'functions' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.create', () => {
	it('sends POST /functions with body', async () => {
		const mockResponse = { function_id: 'func-001', name: 'New function' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.create(ctx, {
			body: { name: 'New function' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'functions' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.get', () => {
	it('sends GET /functions/{function_id}', async () => {
		const mockResponse = { function_id: 'func-001', name: 'My function' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.get(ctx, { function_id: 'func-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'functions/func-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.update', () => {
	it('sends PATCH /functions/{function_id} with body', async () => {
		const mockResponse = { function_id: 'func-001', name: 'Renamed' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.update(ctx, {
			function_id: 'func-001',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'functions/func-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.remove', () => {
	it('sends DELETE /functions/{function_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Functions.remove(ctx, { function_id: 'func-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'functions/func-001',
			}),
		);

		expect(result).toEqual(undefined);
	});
});

describe('function.listDeployments', () => {
	it('sends GET /functions/{function_id}/deployments', async () => {
		const mockResponse = { deployments: [{ deployment_id: 'deploy-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.listDeployments(ctx, {
			function_id: 'func-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'functions/func-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.createDeployment', () => {
	it('sends POST /functions/{function_id}/deployments with body', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'pending' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.createDeployment(ctx, {
			function_id: 'func-001',
			body: { environment: 'production' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'functions/func-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('functionCreateDeployment input schema', () => {
	it('accepts a well-formed deployment create input', () => {
		const parsed =
			GriptapeEndpointInputSchemas.functionCreateDeployment.safeParse({
				function_id: 'func-001',
				body: { environment: 'production' },
			});

		expect(parsed.success).toBe(true);
	});

	it('rejects input without a function id', () => {
		const parsed =
			GriptapeEndpointInputSchemas.functionCreateDeployment.safeParse({
				body: { environment: 'production' },
			});

		expect(parsed.success).toBe(false);
	});
});
