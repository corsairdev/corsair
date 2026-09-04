import { request } from 'corsair/http';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import * as users from './endpoints/users';
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

describe('griptape user endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('user.list sends GET /users with pagination', async () => {
		const payload = { users: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await users.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'users' }),
		);
		expect(result).toEqual(payload);
	});

	it('user.get sends GET /users/{user_id}', async () => {
		const payload = { user_id: 'user-test-001', email: 'user@example.com' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await users.get(ctx, { user_id: 'user-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'users/user-test-001' }),
		);
		expect(result).toEqual(payload);
	});

	it('user.getApiKey sends GET /api-keys/{api_key_id}', async () => {
		const payload = { api_key_id: 'key-test-001', name: 'ci-key' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await users.getApiKey(ctx, { api_key_id: 'key-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'api-keys/key-test-001' }),
		);
		expect(result).toEqual(payload);
	});

	it('user.deleteApiKey sends DELETE /api-keys/{api_key_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await users.deleteApiKey(ctx, {
			api_key_id: 'key-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'api-keys/key-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('validates userGet input', () => {
		const valid = GriptapeEndpointInputSchemas.userGet.safeParse({
			user_id: 'user-test-001',
		});

		expect(valid.success).toBe(true);
	});

	it('rejects userGet input with an empty id', () => {
		const invalid = GriptapeEndpointInputSchemas.userGet.safeParse({
			user_id: '',
		});

		expect(invalid.success).toBe(false);
	});
});
