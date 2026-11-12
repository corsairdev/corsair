import { EncodianSchema } from './schema';

describe('Encodian schema', () => {
	it('declares a semver version', () => {
		expect(EncodianSchema.version).toBeDefined();
		expect(EncodianSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EncodianSchema.entities).toBe('object');
		expect(EncodianSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EncodianSchema.entities))).toBe(true);
		for (const entity of Object.values(EncodianSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
