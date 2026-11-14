import { RespondioSchema } from './schema';

describe('respond.io schema', () => {
	it('declares a semver version', () => {
		expect(RespondioSchema.version).toBeDefined();
		expect(RespondioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RespondioSchema.entities).toBe('object');
		expect(RespondioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RespondioSchema.entities))).toBe(true);
		for (const entity of Object.values(RespondioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since messages arrive continuously', () => {
		// A conversation changes with every inbound message, so a cached copy would
		// be stale within seconds.
		expect(Object.keys(RespondioSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
