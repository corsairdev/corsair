import {
	ZohoInventoryCredentials,
	ZohoInventoryOrganizationEntity,
	ZohoInventorySchema,
} from './schema';

describe('ZohoInventory schema', () => {
	it('declares a semver version', () => {
		expect(ZohoInventorySchema.version).toBeDefined();
		expect(ZohoInventorySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZohoInventorySchema.entities).toBe('object');
		expect(ZohoInventorySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZohoInventorySchema.entities))).toBe(true);
		for (const entity of Object.values(ZohoInventorySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('declares official inventory entities', () => {
		expect(Object.keys(ZohoInventorySchema.entities).sort()).toEqual([
			'contacts',
			'creditNotes',
			'invoices',
			'items',
			'organizations',
			'salesOrders',
		]);
	});

	it('validates ZohoInventoryOrganizationEntity', () => {
		const org = ZohoInventoryOrganizationEntity.parse({
			id: 'org_123',
			organization_id: 'org_123',
			name: 'Test Org',
			is_default_org: true,
		});
		expect(org.id).toBe('org_123');
		expect(org.name).toBe('Test Org');
	});

	it('validates ZohoInventoryCredentials', () => {
		const creds = ZohoInventoryCredentials.parse({
			clientId: 'cid_123',
			clientSecret: 'csec_456',
			accessToken: 'acc_789',
			refreshToken: 'ref_012',
		});
		expect(creds.clientId).toBe('cid_123');
	});
});
