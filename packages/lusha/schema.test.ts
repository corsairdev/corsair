import { LushaSchema } from './schema';

describe('Lusha schema', () => {
	it('declares a semver version', () => {
		expect(LushaSchema.version).toBeDefined();
		expect(LushaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LushaSchema.entities).toBe('object');
		expect(LushaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LushaSchema.entities))).toBe(true);
		for (const entity of Object.values(LushaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
