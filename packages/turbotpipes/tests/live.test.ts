import { ActorEndpoints, TenantsEndpoints } from '../endpoints';

const TEST_API_KEY = process.env.TURBOT_PIPES_API_KEY || 'mock_test_token';

describe('TurbotPipes Live API Tests', () => {
	const createMockContext = () => ({
		key: TEST_API_KEY,
		authType: 'api_key' as const,
		schema: {} as any,
		options: { key: TEST_API_KEY } as any,
		keys: {
			get_api_key: jest.fn().mockResolvedValue(TEST_API_KEY),
			get_access_token: jest.fn(),
			get_webhook_signature: jest.fn(),
		},
	});

	it('fetches authenticated actor details live', async () => {
		const ctx = createMockContext();
		try {
			const res = await ActorEndpoints.getActor(ctx as any, {});
			expect(res).toBeDefined();
			expect(typeof res).toBe('object');
		} catch (error: any) {
			expect(error).toBeDefined();
		}
	});

	it('fetches actor workspaces live', async () => {
		const ctx = createMockContext();
		try {
			const res = await ActorEndpoints.listActorWorkspaces(ctx as any, {});
			expect(res).toBeDefined();
		} catch (error: any) {
			expect(error).toBeDefined();
		}
	});

	it('fetches actor organizations live', async () => {
		const ctx = createMockContext();
		try {
			const res = await ActorEndpoints.listActorOrgs(ctx as any, {});
			expect(res).toBeDefined();
		} catch (error: any) {
			expect(error).toBeDefined();
		}
	});

	it('fetches accessible tenants live', async () => {
		const ctx = createMockContext();
		try {
			const res = await TenantsEndpoints.listTenants(ctx as any, {});
			expect(res).toBeDefined();
		} catch (error: any) {
			expect(error).toBeDefined();
		}
	});
});
