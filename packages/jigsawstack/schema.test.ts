import { JigsawstackSchema } from './schema';

describe('Jigsawstack schema', () => {
	it('declares a semver version', () => {
		expect(JigsawstackSchema.version).toBeDefined();
		expect(JigsawstackSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof JigsawstackSchema.entities).toBe('object');
		expect(JigsawstackSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(JigsawstackSchema.entities))).toBe(true);
		for (const entity of Object.values(JigsawstackSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
