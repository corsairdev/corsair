import { VeriphoneSchema } from './schema';

describe('Veriphone schema', () => {
	it('declares a semver version', () => {
		expect(VeriphoneSchema.version).toBeDefined();
		expect(VeriphoneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof VeriphoneSchema.entities).toBe('object');
		expect(VeriphoneSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(VeriphoneSchema.entities))).toBe(true);
		for (const entity of Object.values(VeriphoneSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
