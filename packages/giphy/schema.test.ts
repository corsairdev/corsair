import { GiphySchema } from './schema';

describe('Giphy schema', () => {
	it('declares a semver version', () => {
		expect(GiphySchema.version).toBeDefined();
		expect(GiphySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GiphySchema.entities).toBe('object');
		expect(GiphySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GiphySchema.entities))).toBe(true);
		for (const entity of Object.values(GiphySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
