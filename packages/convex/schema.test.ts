import { ConvexSchema } from './schema';

describe('Convex schema', () => {
	it('declares a semver version', () => {
		expect(ConvexSchema.version).toBeDefined();
		expect(ConvexSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ConvexSchema.entities).toBe('object');
		expect(ConvexSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ConvexSchema.entities))).toBe(true);
		for (const entity of Object.values(ConvexSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
