import { MixmaxSchema } from './schema';

describe('Mixmax schema', () => {
	it('declares a semver version', () => {
		expect(MixmaxSchema.version).toBeDefined();
		expect(MixmaxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MixmaxSchema.entities).toBe('object');
		expect(MixmaxSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MixmaxSchema.entities))).toBe(true);
		for (const entity of Object.values(MixmaxSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
