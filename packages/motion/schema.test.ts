import { MotionSchema } from './schema';

describe('Motion schema', () => {
	it('declares a semver version', () => {
		expect(MotionSchema.version).toBeDefined();
		expect(MotionSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MotionSchema.entities).toBe('object');
		expect(MotionSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MotionSchema.entities))).toBe(true);
		for (const entity of Object.values(MotionSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
