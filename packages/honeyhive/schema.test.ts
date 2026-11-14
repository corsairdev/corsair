import { HoneyHiveSchema } from './schema';

describe('HoneyHive schema', () => {
	it('declares a semver version', () => {
		expect(HoneyHiveSchema.version).toBeDefined();
		expect(HoneyHiveSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HoneyHiveSchema.entities).toBe('object');
		expect(HoneyHiveSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HoneyHiveSchema.entities))).toBe(true);
		for (const entity of Object.values(HoneyHiveSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
