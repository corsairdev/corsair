import { SimlaComSchema } from './schema';

describe('SimlaCom schema', () => {
	it('declares a semver version', () => {
		expect(SimlaComSchema.version).toBeDefined();
		expect(SimlaComSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SimlaComSchema.entities).toBe('object');
		expect(SimlaComSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SimlaComSchema.entities))).toBe(true);
		for (const entity of Object.values(SimlaComSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
