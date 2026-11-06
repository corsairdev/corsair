import { NetSuiteEndpointOutputSchemas } from './endpoints/types';
import { NetSuiteSchema } from './schema';

describe('NetSuite schema', () => {
	it('declares a semver version', () => {
		expect(NetSuiteSchema.version).toBeDefined();
		expect(NetSuiteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NetSuiteSchema.entities).toBe('object');
		expect(NetSuiteSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NetSuiteSchema.entities))).toBe(true);
		expect(Object.keys(NetSuiteSchema.entities)).toHaveLength(13);
		for (const entity of Object.values(NetSuiteSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates types of known response fields in output schemas', () => {
		const tokenOutput = NetSuiteEndpointOutputSchemas.oauth2TokenRefresh;
		expect(tokenOutput.safeParse({ access_token: 'valid-token' }).success).toBe(
			true,
		);
		expect(tokenOutput.safeParse({ access_token: 12345 }).success).toBe(false);
		expect(tokenOutput.safeParse({ expires_in: 'not-a-number' }).success).toBe(
			false,
		);
		expect(tokenOutput.safeParse({ expires_in: '3600' }).success).toBe(true);
	});

	it('validates entity schemas with structured links, references, and sublists', () => {
		const customer = NetSuiteSchema.entities.customers.safeParse({
			id: '123',
			companyName: 'Acme Inc',
			links: [
				{ rel: 'self', href: 'https://example.com/record/v1/customer/123' },
			],
		});
		expect(customer.success).toBe(true);

		const purchaseOrder = NetSuiteSchema.entities.purchaseOrders.safeParse({
			id: 'po-1',
			entity: { id: 'vend-1', refName: 'Supplier LLC' },
			item: [{ item: { id: 'item-1' }, quantity: 10 }],
		});
		expect(purchaseOrder.success).toBe(true);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
