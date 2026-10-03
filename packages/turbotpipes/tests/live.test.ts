jest.unmock('corsair/http');

import { makeTurbotPipesRequest } from '../client';
import { ActorEndpoints, TenantsEndpoints, UsersEndpoints } from '../endpoints';

const API_KEY = process.env.TURBOT_PIPES_API_KEY;

describe('TurbotPipes Live API Tests', () => {
	const createMockContext = (key: string) => ({
		key,
		authType: 'api_key' as const,
		schema: {} as any,
		options: { key } as any,
		$getAccountId: jest.fn().mockResolvedValue('acc_1'),
		keys: {
			get_api_key: jest.fn().mockResolvedValue(key),
			get_access_token: jest.fn(),
			get_webhook_signature: jest.fn(),
		},
	});

	if (API_KEY) {
		it('fetches authenticated actor details live', async () => {
			const ctx = createMockContext(API_KEY);
			const res = await ActorEndpoints.getActor(ctx as any, {});
			expect(res).toBeDefined();
			expect(res.handle).toBeDefined();
			expect(res.type).toBe('user');
		});

		it('fetches user details live', async () => {
			const ctx = createMockContext(API_KEY);
			const actor = await ActorEndpoints.getActor(ctx as any, {});
			const res = await UsersEndpoints.getUser(ctx as any, {
				user_handle: actor.handle,
			});
			expect(res).toBeDefined();
			expect(res.handle).toBe(actor.handle);
		});

		it('fetches actor workspaces live', async () => {
			const ctx = createMockContext(API_KEY);
			const res = await ActorEndpoints.listActorWorkspaces(ctx as any, {});
			expect(res).toBeDefined();
			expect(Array.isArray(res.items)).toBe(true);
		});

		it('fetches accessible tenants live', async () => {
			const ctx = createMockContext(API_KEY);
			const res = await TenantsEndpoints.listTenants(ctx as any, {});
			expect(res).toBeDefined();
			expect(Array.isArray(res.items)).toBe(true);
		});
	} else {
		it('skips live network tests when TURBOT_PIPES_API_KEY is not set', () => {
			expect(API_KEY).toBeUndefined();
		});
	}
});
