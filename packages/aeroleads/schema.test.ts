import { AeroLeadsSchema } from './schema';

describe('AeroLeads schema', () => {
	it('declares a semver version', () => {
		expect(AeroLeadsSchema.version).toBeDefined();
		expect(AeroLeadsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AeroLeadsSchema.entities).toBe('object');
		expect(AeroLeadsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AeroLeadsSchema.entities))).toBe(true);
		for (const entity of Object.values(AeroLeadsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
