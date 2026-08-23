import { enforcePermission } from '../core/permissions';
import { createTestDatabase } from './setup-db';

describe('enforcePermission - Rate Limits and Budget', () => {
	let testDb: ReturnType<typeof createTestDatabase>;

	beforeEach(() => {
		testDb = createTestDatabase();
	});

	afterEach(() => {
		testDb.cleanup();
		jest.useRealTimers();
	});

	it('allows calls below the limit and blocks when exceeded', async () => {
		const limits = [{ max: 2, window: '1m', type: 'rate_limit' as const }];

		const call = () =>
			enforcePermission({
				pluginId: 'test-plugin',
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'read',
				db: testDb.database,
				pluginLimits: limits,
			});

		// 1st call
		expect((await call()).result).toBe('allow');
		// 2nd call
		expect((await call()).result).toBe('allow');

		// 3rd call - blocked
		const blockedRes = await call();
		expect(blockedRes.result).toBe('blocked');
		expect(blockedRes.reason).toBe('rate_limit_exceeded');
	});

	it('returns budget_exhausted for budget limits', async () => {
		const limits = [{ max: 1, window: '1d', type: 'budget' as const }];

		const call = () =>
			enforcePermission({
				pluginId: 'test-plugin',
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'write',
				db: testDb.database,
				pluginLimits: limits,
			});

		expect((await call()).result).toBe('allow');

		const blockedRes = await call();
		expect(blockedRes.result).toBe('blocked');
		expect(blockedRes.reason).toBe('budget_exhausted');
	});

	it('resets the counter when the time window passes', async () => {
		jest.useFakeTimers();

		const limits = [{ max: 1, window: '10s', type: 'rate_limit' as const }];

		const call = () =>
			enforcePermission({
				pluginId: 'test-plugin',
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'read',
				db: testDb.database,
				globalLimits: limits,
			});

		expect((await call()).result).toBe('allow');
		expect((await call()).result).toBe('blocked');

		// Advance time by 11 seconds to enter the next window epoch
		jest.advanceTimersByTime(11000);

		// Now it should be allowed again
		expect((await call()).result).toBe('allow');
	});

	it('isolates counters by tenant and plugin scope', async () => {
		const call = (tenantId: string, pluginId: string, limits: any) =>
			enforcePermission({
				pluginId,
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'read',
				db: testDb.database,
				tenantId,
				...limits,
			});

		// Global limit (applies to all plugins and tenants)
		await call('tenant1', 'pluginA', {
			globalLimits: [{ max: 10, window: '1m', type: 'rate_limit' }],
		});

		// Tenant limit (applies to tenant1 across all plugins)
		await call('tenant1', 'pluginA', {
			globalLimits: [
				{ max: 1, window: '1m', type: 'rate_limit', scope: 'tenant' },
			],
		});

		// Tenant limit exhausted for tenant1, should block
		const blocked = await call('tenant1', 'pluginB', {
			globalLimits: [
				{ max: 1, window: '1m', type: 'rate_limit', scope: 'tenant' },
			],
		});
		expect(blocked.result).toBe('blocked');

		// Tenant2 should still be allowed
		const allowed = await call('tenant2', 'pluginB', {
			globalLimits: [
				{ max: 1, window: '1m', type: 'rate_limit', scope: 'tenant' },
			],
		});
		expect(allowed.result).toBe('allow');
	});

	it('isolates plugin limits by pluginId', async () => {
		const call = (pluginId: string, pluginLimits: any) =>
			enforcePermission({
				pluginId,
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'read',
				db: testDb.database,
				pluginLimits,
			});

		const limits = [{ max: 1, window: '1m', type: 'rate_limit' as const }];

		// First call through pluginA is allowed
		const firstA = await call('pluginA', limits);
		expect(firstA.result).toBe('allow');

		// Second call through pluginA is blocked
		const secondA = await call('pluginA', limits);
		expect(secondA.result).toBe('blocked');
		expect(secondA.reason).toBe('rate_limit_exceeded');

		// pluginB with the same plugin limit remains allowed
		const firstB = await call('pluginB', limits);
		expect(firstB.result).toBe('allow');
	});

	it('does not increment counter for policy-denied calls', async () => {
		const limits = [{ max: 1, window: '1m', type: 'rate_limit' as const }];

		// This call is denied by policy
		const deniedRes = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'readonly', // Policy deny!
			riskLevel: 'write',
			db: testDb.database,
			pluginLimits: limits,
		});

		expect(deniedRes.result).toBe('blocked');
		expect(deniedRes.reason).toBe('policy');

		// Now an allowed call should pass because the quota was not consumed
		const allowedRes = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'open',
			riskLevel: 'write',
			db: testDb.database,
			pluginLimits: limits,
		});

		expect(allowedRes.result).toBe('allow');
	});
	it('does not double-charge quota when an approved request is replayed', async () => {
		const limits = [{ max: 1, window: '1m', type: 'rate_limit' as const }];
		const args = { data: 'test' };

		// 1. Initial request: should hit limit check, consume 1 quota, and return blocked (pending)
		const initialRes = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args,
			mode: 'open',
			override: 'require_approval', // Triggers pending record creation
			riskLevel: 'write',
			db: testDb.database,
			pluginLimits: limits,
			approvalMode: 'asynchronous', // Return immediately
		});

		expect(initialRes.result).toBe('blocked');
		expect(initialRes.reason).toBe('pending');
		const token = initialRes.token!;
		const id = initialRes.id!;

		// 2. Simulate human approval
		await testDb.database.db
			.updateTable('corsair_permissions')
			.set({ status: 'approved', updated_at: new Date() })
			.where('id', '=', id)
			.execute();

		// 3. Replay the request (simulate executePermission or client retry)
		const replayRes = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args,
			mode: 'open',
			override: 'require_approval',
			riskLevel: 'write',
			db: testDb.database,
			pluginLimits: limits,
		});

		// It should be allowed, because the existing approved record bypasses the limits check!
		expect(replayRes.result).toBe('allow');

		// 4. Verify that the quota was NOT double-charged
		// If it were double-charged, the counter would be 2. Let's check the database.
		const usage = await testDb.database.db
			.selectFrom('corsair_usage_counters')
			.selectAll()
			.executeTakeFirst();

		expect(usage?.count).toBe(1); // Still 1!
	});
});
