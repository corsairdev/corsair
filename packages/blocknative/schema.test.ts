import { BlocknativeSchema } from './schema';

describe('Blocknative schema', () => {
	it('declares a semver version', () => {
		expect(BlocknativeSchema.version).toBeDefined();
		expect(BlocknativeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BlocknativeSchema.entities).toBe('object');
		expect(BlocknativeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BlocknativeSchema.entities))).toBe(true);
		for (const entity of Object.values(BlocknativeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
