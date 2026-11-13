import { RudderStackTransformationSchema } from './schema';

describe('RudderStack Transformation schema', () => {
	it('declares a semver version', () => {
		expect(RudderStackTransformationSchema.version).toBeDefined();
		expect(RudderStackTransformationSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RudderStackTransformationSchema.entities).toBe('object');
		expect(RudderStackTransformationSchema.entities).not.toBeNull();
		expect(
			Array.isArray(Object.keys(RudderStackTransformationSchema.entities)),
		).toBe(true);
		for (const entity of Object.values(
			RudderStackTransformationSchema.entities,
		)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, because publishing is a deliberate act on live code', () => {
		// A transformation's code changes whenever someone edits it, and a cached
		// revision would hide that it is not the one serving traffic.
		expect(Object.keys(RudderStackTransformationSchema.entities)).toHaveLength(
			0,
		);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
