import { request } from 'corsair/http';
import * as models from './endpoints/models';
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

describe('griptape model endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('model.list sends GET /models with pagination', async () => {
		const payload = { models: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.listModels(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'models' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.create sends POST /models', async () => {
		const payload = { model_config_id: 'model-test-001', name: 'test-model' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.createModel(ctx, {
			body: { name: 'test-model' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'models' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.get sends GET /models/{model_config_id}', async () => {
		const payload = { model_config_id: 'model-test-001', name: 'test-model' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.getModel(ctx, {
			model_config_id: 'model-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'models/model-test-001' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.update sends PATCH /models/{model_config_id}', async () => {
		const payload = {
			model_config_id: 'model-test-001',
			name: 'renamed-model',
		};
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.updateModel(ctx, {
			model_config_id: 'model-test-001',
			body: { name: 'renamed-model' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'models/model-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('model.delete sends DELETE /models/{model_config_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await models.removeModel(ctx, {
			model_config_id: 'model-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'models/model-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('model.listAuthConfigs sends GET /models/auth-configs', async () => {
		const payload = { auth_configs: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.listAuthConfigs(ctx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'models/auth-configs' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.createAuthConfig sends POST /models/auth-configs', async () => {
		const payload = { auth_config_id: 'auth-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.createAuthConfig(ctx, {
			body: { provider: 'openai' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'models/auth-configs' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.getAuthConfig sends GET /models/auth-configs/{auth_config_id}', async () => {
		const payload = { auth_config_id: 'auth-test-001', provider: 'openai' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.getAuthConfig(ctx, {
			auth_config_id: 'auth-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'models/auth-configs/auth-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('model.updateAuthConfig sends PATCH /models/auth-configs/{auth_config_id}', async () => {
		const payload = { auth_config_id: 'auth-test-001', provider: 'openai' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.updateAuthConfig(ctx, {
			auth_config_id: 'auth-test-001',
			body: { provider: 'openai' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'models/auth-configs/auth-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('model.deleteAuthConfig sends DELETE /models/auth-configs/{auth_config_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await models.removeAuthConfig(ctx, {
			auth_config_id: 'auth-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'models/auth-configs/auth-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('validates modelGetAuthConfig input', () => {
		const valid = GriptapeEndpointInputSchemas.modelGetAuthConfig.safeParse({
			auth_config_id: 'auth-test-001',
		});

		expect(valid.success).toBe(true);
	});

	it('rejects modelGetAuthConfig input with an empty id', () => {
		const invalid = GriptapeEndpointInputSchemas.modelGetAuthConfig.safeParse({
			auth_config_id: '',
		});

		expect(invalid.success).toBe(false);
	});
});
