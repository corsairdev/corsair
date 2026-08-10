import { AbstractSchema } from './schema';

describe('Abstract schema', () => {
	it('declares a semver version', () => {
		expect(AbstractSchema.version).toBeDefined();
		expect(AbstractSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AbstractSchema.entities).toBe('object');
		expect(AbstractSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AbstractSchema.entities))).toBe(true);
		for (const entity of Object.values(AbstractSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
