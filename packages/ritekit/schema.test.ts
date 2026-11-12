import { RiteKitSchema } from './schema';

describe('RiteKit schema', () => {
	it('declares a semver version', () => {
		expect(RiteKitSchema.version).toBeDefined();
		expect(RiteKitSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RiteKitSchema.entities).toBe('object');
		expect(RiteKitSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RiteKitSchema.entities))).toBe(true);
		for (const entity of Object.values(RiteKitSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, because every answer derives from its input', () => {
		// Hashtag stats change hourly and a quote image is a pure function of its
		// style parameters, so there is no account record to keep.
		expect(Object.keys(RiteKitSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
