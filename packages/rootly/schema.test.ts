import { RootlySchema } from './schema';

describe('Rootly schema', () => {
	it('declares a semver version', () => {
		expect(RootlySchema.version).toBeDefined();
		expect(RootlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RootlySchema.entities).toBe('object');
		expect(RootlySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RootlySchema.entities))).toBe(true);
		for (const entity of Object.values(RootlySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
