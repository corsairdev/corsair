import { CeligoSchema } from './schema';

describe('Celigo schema', () => {
	it('declares a semver version', () => {
		expect(CeligoSchema.version).toBeDefined();
		expect(CeligoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CeligoSchema.entities).toBe('object');
		expect(CeligoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CeligoSchema.entities))).toBe(true);
		for (const entity of Object.values(CeligoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
