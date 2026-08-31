import { enforcePermission, runPermissionExecution } from '../core/permissions';
import type { UsageLimit } from '../core/plugins';
import { createTestDatabase } from './setup-db';

const rateLimit = (
	max: number,
	extra: Partial<UsageLimit> = {},
): UsageLimit => ({
	max,
	window: '1m',
	type: 'rate_limit',
	...extra,
});

type LimitOpts = {
	globalLimits?: (UsageLimit & { scope?: 'global' | 'tenant' })[];
	pluginLimits?: UsageLimit[];
};

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
		const limits = [rateLimit(2)];

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

		expect((await call()).result).toBe('allow');
		expect((await call()).result).toBe('allow');

		const blockedRes = await call();
		expect(blockedRes.result).toBe('blocked');
		expect(blockedRes.reason).toBe('rate_limit_exceeded');
	});

	it('returns budget_exhausted for budget limits', async () => {
		const limits: UsageLimit[] = [{ max: 1, window: '1d', type: 'budget' }];

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

		const limits: UsageLimit[] = [
			{ max: 1, window: '10s', type: 'rate_limit' },
		];

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

		jest.advanceTimersByTime(11000);

		expect((await call()).result).toBe('allow');
	});

	it('isolates counters by tenant and plugin scope', async () => {
		const call = (tenantId: string, pluginId: string, limits: LimitOpts) =>
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

		await call('tenant1', 'pluginA', {
			globalLimits: [{ max: 10, window: '1m', type: 'rate_limit' }],
		});

		await call('tenant1', 'pluginA', {
			globalLimits: [
				{ max: 1, window: '1m', type: 'rate_limit', scope: 'tenant' },
			],
		});

		const blocked = await call('tenant1', 'pluginB', {
			globalLimits: [
				{ max: 1, window: '1m', type: 'rate_limit', scope: 'tenant' },
			],
		});
		expect(blocked.result).toBe('blocked');

		const allowed = await call('tenant2', 'pluginB', {
			globalLimits: [
				{ max: 1, window: '1m', type: 'rate_limit', scope: 'tenant' },
			],
		});
		expect(allowed.result).toBe('allow');
	});

	it('isolates plugin limits by pluginId', async () => {
		const call = (pluginId: string, pluginLimits: UsageLimit[]) =>
			enforcePermission({
				pluginId,
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'read',
				db: testDb.database,
				pluginLimits,
			});

		const limits = [rateLimit(1)];

		const firstA = await call('pluginA', limits);
		expect(firstA.result).toBe('allow');

		const secondA = await call('pluginA', limits);
		expect(secondA.result).toBe('blocked');
		expect(secondA.reason).toBe('rate_limit_exceeded');

		const firstB = await call('pluginB', limits);
		expect(firstB.result).toBe('allow');
	});

	it('isolates plugin limits by tenant', async () => {
		const limits = [rateLimit(1)];

		const first = await enforcePermission({
			pluginId: 'pluginA',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'open',
			riskLevel: 'read',
			db: testDb.database,
			tenantId: 'tenant1',
			pluginLimits: limits,
		});
		expect(first.result).toBe('allow');

		const blocked = await enforcePermission({
			pluginId: 'pluginA',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'open',
			riskLevel: 'read',
			db: testDb.database,
			tenantId: 'tenant1',
			pluginLimits: limits,
		});
		expect(blocked.result).toBe('blocked');

		const otherTenant = await enforcePermission({
			pluginId: 'pluginA',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'open',
			riskLevel: 'read',
			db: testDb.database,
			tenantId: 'tenant2',
			pluginLimits: limits,
		});
		expect(otherTenant.result).toBe('allow');
	});

	it('keeps distinct counters for the same limit at different risk levels', async () => {
		const limits: UsageLimit[] = [
			rateLimit(1, { riskLevel: 'read' }),
			rateLimit(1, { riskLevel: 'write' }),
		];

		const readCall = () =>
			enforcePermission({
				pluginId: 'test-plugin',
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'read',
				db: testDb.database,
				pluginLimits: limits,
			});

		const writeCall = () =>
			enforcePermission({
				pluginId: 'test-plugin',
				endpointPath: 'test.endpoint',
				args: {},
				mode: 'open',
				riskLevel: 'write',
				db: testDb.database,
				pluginLimits: limits,
			});

		expect((await readCall()).result).toBe('allow');
		expect((await writeCall()).result).toBe('allow');
		expect((await readCall()).result).toBe('blocked');
		expect((await writeCall()).result).toBe('blocked');
	});

	it('increments every stacked limit before returning a blocked reason', async () => {
		const limits: UsageLimit[] = [
			rateLimit(1),
			{ max: 10, window: '1m', type: 'budget' },
		];

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

		expect((await call()).result).toBe('allow');
		const blocked = await call();
		expect(blocked.result).toBe('blocked');
		expect(blocked.reason).toBe('rate_limit_exceeded');

		const rows = await testDb.database.db
			.selectFrom('corsair_usage_counters')
			.selectAll()
			.execute();
		expect(rows).toHaveLength(2);
		expect(rows.every((row) => row.count === 2)).toBe(true);
	});

	it('prunes expired usage counter rows', async () => {
		await testDb.database.db
			.insertInto('corsair_usage_counters')
			.values({
				key: 'usage:stale',
				count: 9,
				expires_at: new Date(Date.now() - 1000).toISOString(),
			})
			.execute();

		await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'open',
			riskLevel: 'read',
			db: testDb.database,
			pluginLimits: [rateLimit(5)],
		});

		const stale = await testDb.database.db
			.selectFrom('corsair_usage_counters')
			.selectAll()
			.where('key', '=', 'usage:stale')
			.executeTakeFirst();
		expect(stale).toBeUndefined();
	});

	it('does not let leftover pending records block open-mode quota checks', async () => {
		await testDb.database.db
			.insertInto('corsair_permissions')
			.values({
				id: 'leftover-pending',
				created_at: new Date(),
				updated_at: new Date(),
				token: 'leftover-token',
				plugin: 'test-plugin',
				endpoint: 'test.endpoint',
				args: '{}',
				tenant_id: 'default',
				status: 'pending',
				expires_at: new Date(Date.now() + 60_000).toISOString(),
			})
			.execute();

		const res = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'open',
			riskLevel: 'read',
			db: testDb.database,
			pluginLimits: [rateLimit(1)],
		});
		expect(res.result).toBe('allow');
	});

	it('does not increment counter for policy-denied calls', async () => {
		const limits = [rateLimit(1)];

		const deniedRes = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args: {},
			mode: 'readonly',
			riskLevel: 'write',
			db: testDb.database,
			pluginLimits: limits,
		});

		expect(deniedRes.result).toBe('blocked');
		expect(deniedRes.reason).toBe('policy');

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
		const limits = [rateLimit(1)];
		const args = { data: 'test' };

		const initialRes = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args,
			mode: 'open',
			override: 'require_approval',
			riskLevel: 'write',
			db: testDb.database,
			pluginLimits: limits,
			approvalMode: 'asynchronous',
		});

		expect(initialRes.result).toBe('blocked');
		expect(initialRes.reason).toBe('pending');
		const id = initialRes.id!;

		await testDb.database.db
			.updateTable('corsair_permissions')
			.set({ status: 'approved', updated_at: new Date() })
			.where('id', '=', id)
			.execute();

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

		expect(replayRes.result).toBe('allow');

		const usage = await testDb.database.db
			.selectFrom('corsair_usage_counters')
			.selectAll()
			.executeTakeFirst();

		expect(usage?.count).toBe(1);

		const secondReplay = await enforcePermission({
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args,
			mode: 'open',
			override: 'require_approval',
			riskLevel: 'write',
			db: testDb.database,
			pluginLimits: limits,
		});
		expect(secondReplay.result).toBe('blocked');
		expect(secondReplay.reason).toBe('pending');
	});

	it('allows an executing record only inside permission execution', async () => {
		const args = { data: 'exec' };
		await testDb.database.db
			.insertInto('corsair_permissions')
			.values({
				id: 'exec-1',
				created_at: new Date(),
				updated_at: new Date(),
				token: 'exec-token',
				plugin: 'test-plugin',
				endpoint: 'test.endpoint',
				args: JSON.stringify(args),
				tenant_id: 'default',
				status: 'executing',
				expires_at: new Date(Date.now() + 60_000).toISOString(),
			})
			.execute();

		const opts = {
			pluginId: 'test-plugin',
			endpointPath: 'test.endpoint',
			args,
			mode: 'open' as const,
			override: 'require_approval' as const,
			riskLevel: 'write' as const,
			db: testDb.database,
			pluginLimits: [rateLimit(1)],
		};

		const stray = await enforcePermission(opts);
		expect(stray.result).toBe('blocked');
		expect(stray.reason).toBe('pending');

		const inner = await runPermissionExecution(() => enforcePermission(opts));
		expect(inner.result).toBe('allow');
	});
});
