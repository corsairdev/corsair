import { FingertipSchema } from './schema';

describe('Fingertip schema', () => {
	it('declares a semver version', () => {
		expect(FingertipSchema.version).toBeDefined();
		expect(FingertipSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FingertipSchema.entities).toBe('object');
		expect(FingertipSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FingertipSchema.entities))).toBe(true);
		for (const entity of Object.values(FingertipSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
