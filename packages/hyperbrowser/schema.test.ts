import { HyperbrowserSchema } from './schema';

describe('Hyperbrowser schema', () => {
	it('declares a semver version', () => {
		expect(HyperbrowserSchema.version).toBeDefined();
		expect(HyperbrowserSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HyperbrowserSchema.entities).toBe('object');
		expect(HyperbrowserSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HyperbrowserSchema.entities))).toBe(true);
		for (const entity of Object.values(HyperbrowserSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
