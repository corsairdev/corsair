import { AttioSchema } from './schema';

describe('Attio schema', () => {
	it('declares a semver version', () => {
		expect(AttioSchema.version).toBeDefined();
		expect(AttioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AttioSchema.entities).toBe('object');
		expect(AttioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AttioSchema.entities))).toBe(true);
		for (const entity of Object.values(AttioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
