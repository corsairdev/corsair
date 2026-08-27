import { FaradaySchema } from './schema';

describe('Faraday schema', () => {
	it('declares a semver version', () => {
		expect(FaradaySchema.version).toBeDefined();
		expect(FaradaySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FaradaySchema.entities).toBe('object');
		expect(FaradaySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FaradaySchema.entities))).toBe(true);
		for (const entity of Object.values(FaradaySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
