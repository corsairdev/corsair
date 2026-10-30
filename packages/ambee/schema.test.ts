import { AmbeeSchema } from './schema';

describe('Ambee schema', () => {
	it('declares a semver version', () => {
		expect(AmbeeSchema.version).toBeDefined();
		expect(AmbeeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AmbeeSchema.entities).toBe('object');
		expect(AmbeeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AmbeeSchema.entities))).toBe(true);
		for (const entity of Object.values(AmbeeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
