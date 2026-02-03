import { withTenantAdapter } from '../adapters/tenant';
import type { CorsairDbAdapter } from '../adapters/types';
import { createCorsair } from '../core';
import { slack } from '../plugins/slack';
import { createTestDatabase } from './setup-db';

function createResourceData(name: string) {
	return {
		created_at: new Date(),
		updated_at: new Date(),
		resource_id: `res-${Date.now()}-${Math.random()}`,
		resource: 'test',
		service: 'test',
		version: '1.0',
		data: { name },
	};
}

describe('Multi-Tenancy Data Isolation', () => {
	let testDb: ReturnType<typeof createTestDatabase>;
	let adapter: CorsairDbAdapter;

	beforeEach(() => {
		testDb = createTestDatabase();
		adapter = testDb.adapter;
	});

	afterEach(() => {
		testDb.cleanup();
	});

	it('should isolate data between different tenants - findOne', async () => {
		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-1',
				tenant_id: 'tenant-1',
				...createResourceData('Tenant 1 Resource'),
			},
		});

		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-2',
				tenant_id: 'tenant-2',
				...createResourceData('Tenant 2 Resource'),
			},
		});

		const tenant1Adapter = withTenantAdapter(adapter, 'tenant-1');
		const tenant2Adapter = withTenantAdapter(adapter, 'tenant-2');

		const tenant1Resource = await tenant1Adapter.findOne({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-1' }],
		});

		const tenant2Resource = await tenant2Adapter.findOne({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-2' }],
		});

		const tenant1CannotAccessTenant2 = await tenant1Adapter.findOne({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-2' }],
		});

		const tenant2CannotAccessTenant1 = await tenant2Adapter.findOne({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-1' }],
		});

		expect(tenant1Resource).toBeTruthy();
		expect(JSON.parse(tenant1Resource?.data as string)?.name).toBe(
			'Tenant 1 Resource',
		);
		expect(tenant2Resource).toBeTruthy();
		expect(JSON.parse(tenant2Resource?.data as string)?.name).toBe(
			'Tenant 2 Resource',
		);
		expect(tenant1CannotAccessTenant2).toBeNull();
		expect(tenant2CannotAccessTenant1).toBeNull();
	});

	it('should isolate data between different tenants - findMany', async () => {
		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-1',
				tenant_id: 'tenant-1',
				...createResourceData('Tenant 1 Resource 1'),
			},
		});

		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-2',
				tenant_id: 'tenant-1',
				...createResourceData('Tenant 1 Resource 2'),
			},
		});

		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-3',
				tenant_id: 'tenant-2',
				...createResourceData('Tenant 2 Resource 1'),
			},
		});

		const tenant1Adapter = withTenantAdapter(adapter, 'tenant-1');
		const tenant2Adapter = withTenantAdapter(adapter, 'tenant-2');

		const tenant1Resources = await tenant1Adapter.findMany({
			table: 'corsair_resources',
		});

		const tenant2Resources = await tenant2Adapter.findMany({
			table: 'corsair_resources',
		});

		expect(tenant1Resources).toHaveLength(2);
		expect(tenant1Resources.every((r: any) => r.tenant_id === 'tenant-1')).toBe(
			true,
		);
		expect(tenant2Resources).toHaveLength(1);
		expect(tenant2Resources.every((r: any) => r.tenant_id === 'tenant-2')).toBe(
			true,
		);
	});

	it('should automatically add tenant_id to insert operations', async () => {
		const tenant1Adapter = withTenantAdapter(adapter, 'tenant-1');
		const tenant2Adapter = withTenantAdapter(adapter, 'tenant-2');

		await tenant1Adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-1',
				...createResourceData('Tenant 1 Resource'),
			},
		});

		await tenant2Adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-2',
				...createResourceData('Tenant 2 Resource'),
			},
		});

		const tenant1Resource = await tenant1Adapter.findOne({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-1' }],
		});

		const tenant2Resource = await tenant2Adapter.findOne({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-2' }],
		});

		expect(tenant1Resource?.tenant_id).toBe('tenant-1');
		expect(tenant2Resource?.tenant_id).toBe('tenant-2');
	});

	it('should prevent inserting data with wrong tenant_id', async () => {
		const tenant1Adapter = withTenantAdapter(adapter, 'tenant-1');

		try {
			await tenant1Adapter.insert({
				table: 'corsair_resources',
				data: {
					id: 'resource-1',
					tenant_id: 'tenant-2',
					...createResourceData('Wrong Tenant Resource'),
				},
			});
			fail('Expected error to be thrown');
		} catch (error: any) {
			expect(error.message).toContain('attempted to insert tenant_id');
		}
	});

	it('should isolate update operations by tenant', async () => {
		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-1',
				tenant_id: 'tenant-1',
				...createResourceData('Original Name'),
			},
		});

		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-2',
				tenant_id: 'tenant-2',
				...createResourceData('Original Name'),
			},
		});

		const tenant1Adapter = withTenantAdapter(adapter, 'tenant-1');
		const tenant2Adapter = withTenantAdapter(adapter, 'tenant-2');

		const updated1 = await tenant1Adapter.update({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-1' }],
			data: { data: JSON.stringify({ name: 'Updated by Tenant 1' }) },
		});

		const updated2 = await tenant2Adapter.update({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-2' }],
			data: { data: JSON.stringify({ name: 'Updated by Tenant 2' }) },
		});

		const tenant1CannotUpdateTenant2 = await tenant1Adapter.update({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-2' }],
			data: { data: JSON.stringify({ name: 'Should Not Update' }) },
		});

		expect(JSON.parse(updated1?.data as string)?.name).toBe(
			'Updated by Tenant 1',
		);
		expect(JSON.parse(updated2?.data as string)?.name).toBe(
			'Updated by Tenant 2',
		);
		expect(tenant1CannotUpdateTenant2).toBeNull();
	});

	it('should isolate delete operations by tenant', async () => {
		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-1',
				tenant_id: 'tenant-1',
				...createResourceData('Tenant 1 Resource'),
			},
		});

		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-2',
				tenant_id: 'tenant-2',
				...createResourceData('Tenant 2 Resource'),
			},
		});

		const tenant1Adapter = withTenantAdapter(adapter, 'tenant-1');
		const tenant2Adapter = withTenantAdapter(adapter, 'tenant-2');

		const deletedCount1 = await tenant1Adapter.deleteMany({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-1' }],
		});

		const deletedCount2 = await tenant2Adapter.deleteMany({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-2' }],
		});

		const tenant1CannotDeleteTenant2 = await tenant1Adapter.deleteMany({
			table: 'corsair_resources',
			where: [{ field: 'id', value: 'resource-2' }],
		});

		expect(deletedCount1).toBe(1);
		expect(deletedCount2).toBe(1);
		expect(tenant1CannotDeleteTenant2).toBe(0);
	});

	it('should isolate count operations by tenant', async () => {
		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-1',
				tenant_id: 'tenant-1',
				...createResourceData('Tenant 1 Resource 1'),
			},
		});

		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-2',
				tenant_id: 'tenant-1',
				...createResourceData('Tenant 1 Resource 2'),
			},
		});

		await adapter.insert({
			table: 'corsair_resources',
			data: {
				id: 'resource-3',
				tenant_id: 'tenant-2',
				...createResourceData('Tenant 2 Resource 1'),
			},
		});

		const tenant1Adapter = withTenantAdapter(adapter, 'tenant-1');
		const tenant2Adapter = withTenantAdapter(adapter, 'tenant-2');

		const tenant1Count = await tenant1Adapter.count({
			table: 'corsair_resources',
		});

		const tenant2Count = await tenant2Adapter.count({
			table: 'corsair_resources',
		});

		expect(tenant1Count).toBe(2);
		expect(tenant2Count).toBe(1);
	});

	it('should work with corsair client multi-tenancy', async () => {
		const corsair = createCorsair({
			plugins: [
				slack({
					authType: 'api_key',
				}),
			],
			database: adapter,
			kek: '',
			multiTenancy: true,
		});

		const tenant1 = corsair.withTenant('tenant-1');
		const tenant2 = corsair.withTenant('tenant-2');

		expect(tenant1).toBeDefined();
		expect(tenant2).toBeDefined();
		expect(tenant1).not.toBe(tenant2);
	});
});
