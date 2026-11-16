import { ErpnextSchema } from './schema';

describe('Erpnext schema', () => {
	it('declares a semver version', () => {
		expect(ErpnextSchema.version).toBeDefined();
		expect(ErpnextSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ErpnextSchema.entities).toBe('object');
		expect(ErpnextSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ErpnextSchema.entities))).toBe(true);
		for (const entity of Object.values(ErpnextSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
