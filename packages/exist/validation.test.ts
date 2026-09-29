import { request } from 'corsair/http';
import { makeExistRequest } from './client';
import type { ExistContext } from './index';
import { exist, existEndpointSchemas } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;

const mockCtx = {
	key: 'test-access-token',
	$getAccountId: async () => 'test-account-id',
	database: undefined,
	endpoints: {},
} as unknown as ExistContext;

const profileResponse = {
	username: 'testuser',
	first_name: 'Test',
	last_name: 'User',
	avatar: null,
	timezone: 'UTC',
};

const pagedAttributes = {
	count: 1,
	next: null,
	previous: null,
	results: [
		{
			name: 'steps',
			label: 'Steps',
			priority: 1,
			group: { name: 'activity', label: 'Activity' },
			service: null,
			template: null,
			active: true,
			manual: false,
			value_type: 0,
			value_type_description: 'INT',
		},
	],
};

const writeResponse = {
	success: [{ name: 'steps', date: '2026-01-01', value: 1000 }],
	failed: [],
};

describe('exist transport retry policy', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(profileResponse);
	});

	it('allows transport retries on GET requests', async () => {
		await makeExistRequest('accounts/profile/', 'token', { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 3,
				}),
			}),
		);
	});

	it('disables transport retries on write requests', async () => {
		await makeExistRequest('attributes/update/', 'token', {
			method: 'POST',
			body: [{ name: 'steps', date: '2026-01-01', value: 1000 }],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: false,
					maxRetries: 0,
				}),
			}),
		);
	});

	it('rejects responses that violate the output contract', async () => {
		mockRequest.mockResolvedValueOnce('not-an-object');
		await expect(
			exist({ key: 'token' }).endpoints!.users.getProfile(mockCtx, {}),
		).rejects.toThrow(/output validation failed/i);
	});
});

describe('exist runtime validation', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(profileResponse);
	});

	it('rejects malformed input before it reaches Exist', async () => {
		await expect(async () => {
			await exist({ key: 'token' }).endpoints!.attributes.update(mockCtx, {
				attributes: [],
			} as never);
		}).rejects.toThrow(/input validation failed/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an over-limit batch before it reaches Exist', async () => {
		const batch = Array.from({ length: 36 }, (_, i) => ({
			name: `attr${i}`,
			date: '2026-01-01',
			value: i,
		}));
		await expect(async () => {
			await exist({ key: 'token' }).endpoints!.attributes.update(mockCtx, {
				attributes: batch,
			} as never);
		}).rejects.toThrow(/input validation failed/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('validates responses against the registered output schema', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 'not-a-number',
			results: 'nope',
		});
		await expect(
			exist({ key: 'token' }).endpoints!.attributes.list(mockCtx, {}),
		).rejects.toThrow(/output validation failed/i);
	});

	it('keeps the refined list-with-values schema introspectable as an object', () => {
		const schema = existEndpointSchemas['attributes.listWithValues']?.input;
		expect(schema).toBeDefined();
		expect((schema as { shape?: unknown }).shape).toBeDefined();
	});
});
