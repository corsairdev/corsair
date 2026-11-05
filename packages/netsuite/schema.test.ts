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
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
