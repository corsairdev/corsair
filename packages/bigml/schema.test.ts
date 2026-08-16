import { BigmlSchema } from './schema';

describe('Bigml schema', () => {
	it('declares a semver version', () => {
		expect(BigmlSchema.version).toBeDefined();
		expect(BigmlSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BigmlSchema.entities).toBe('object');
		expect(BigmlSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BigmlSchema.entities))).toBe(true);
		for (const entity of Object.values(BigmlSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
