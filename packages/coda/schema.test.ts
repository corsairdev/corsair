import { CodaSchema } from './schema';

describe('Coda schema', () => {
	it('declares a semver version', () => {
		expect(CodaSchema.version).toBeDefined();
		expect(CodaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CodaSchema.entities).toBe('object');
		expect(CodaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CodaSchema.entities))).toBe(true);
		for (const entity of Object.values(CodaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
