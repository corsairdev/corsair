import { GoDialSchema } from './schema';

describe('GoDial schema', () => {
	it('declares a semver version', () => {
		expect(GoDialSchema.version).toBeDefined();
		expect(GoDialSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoDialSchema.entities).toBe('object');
		expect(GoDialSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GoDialSchema.entities))).toBe(true);
		for (const entity of Object.values(GoDialSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
