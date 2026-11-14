import { HandwryttenSchema } from './schema';

describe('Handwrytten schema', () => {
	it('declares a semver version', () => {
		expect(HandwryttenSchema.version).toBeDefined();
		expect(HandwryttenSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HandwryttenSchema.entities).toBe('object');
		expect(HandwryttenSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HandwryttenSchema.entities))).toBe(true);
		for (const entity of Object.values(HandwryttenSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
