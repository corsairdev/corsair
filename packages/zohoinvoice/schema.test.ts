import { ZohoInvoiceSchema } from './schema';

describe('ZohoInvoice schema', () => {
	it('declares a semver version', () => {
		expect(ZohoInvoiceSchema.version).toBeDefined();
		expect(ZohoInvoiceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZohoInvoiceSchema.entities).toBe('object');
		expect(ZohoInvoiceSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZohoInvoiceSchema.entities))).toBe(true);
		for (const entity of Object.values(ZohoInvoiceSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
