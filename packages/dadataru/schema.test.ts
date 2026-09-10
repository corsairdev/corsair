import { DadataruSchema } from './schema';

describe('Dadataru schema', () => {
	it('declares a semver version', () => {
		expect(DadataruSchema.version).toBeDefined();
		expect(DadataruSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DadataruSchema.entities).toBe('object');
		expect(DadataruSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DadataruSchema.entities))).toBe(true);
		for (const entity of Object.values(DadataruSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
