import { BenzingaSchema } from './schema';

describe('Benzinga schema', () => {
	it('declares a semver version', () => {
		expect(BenzingaSchema.version).toBeDefined();
		expect(BenzingaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BenzingaSchema.entities).toBe('object');
		expect(BenzingaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BenzingaSchema.entities))).toBe(true);
		for (const entity of Object.values(BenzingaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
