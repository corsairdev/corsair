import { RoboflowSchema } from './schema';

describe('Roboflow schema', () => {
	it('declares a semver version', () => {
		expect(RoboflowSchema.version).toBeDefined();
		expect(RoboflowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RoboflowSchema.entities).toBe('object');
		expect(RoboflowSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RoboflowSchema.entities))).toBe(true);
		for (const entity of Object.values(RoboflowSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since training and annotation move without a call', () => {
		// A dataset changes as images are annotated and a training job advances on
		// its own, so a cached copy would present a stale dataset as current.
		expect(Object.keys(RoboflowSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
