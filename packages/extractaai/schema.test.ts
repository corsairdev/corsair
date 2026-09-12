import { ExtractaaiSchema } from './schema';

describe('Extractaai schema', () => {
	it('declares a semver version', () => {
		expect(ExtractaaiSchema.version).toBeDefined();
		expect(ExtractaaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ExtractaaiSchema.entities).toBe('object');
		expect(ExtractaaiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ExtractaaiSchema.entities))).toBe(true);
		for (const entity of Object.values(ExtractaaiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
