import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { create, get, list, remove, update } from './endpoints/secrets';
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

describe('secrets endpoints', () => {
	it('list sends GET /secrets with pagination', async () => {
		const payload = {
			items: [{ secret_id: 'secret-001', name: 'api-token' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await list(ctx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'secrets' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST /secrets', async () => {
		const payload = { secret_id: 'secret-002', name: 'webhook-signing' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await create(ctx, { body: { name: 'webhook-signing' } });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'secrets' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET /secrets/{secret_id}', async () => {
		const payload = { secret_id: 'secret-003', name: 'oauth-client' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await get(ctx, { secret_id: 'secret-003' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'secrets/secret-003' }),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH /secrets/{secret_id}', async () => {
		const payload = { secret_id: 'secret-004', name: 'rotated-token' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await update(ctx, {
			secret_id: 'secret-004',
			body: { name: 'rotated-token' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'secrets/secret-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /secrets/{secret_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await remove(ctx, { secret_id: 'secret-005' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'secrets/secret-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('secrets input schemas', () => {
	it('accepts a valid secretGet input', () => {
		const parsed = GriptapeEndpointInputSchemas.secretGet.safeParse({
			secret_id: 'secret-003',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty secret_id for secretGet', () => {
		const parsed = GriptapeEndpointInputSchemas.secretGet.safeParse({
			secret_id: '',
		});
		expect(parsed.success).toBe(false);
	});
});
