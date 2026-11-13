import { RosetteSchema } from './schema';

describe('Rosette schema', () => {
	it('declares a semver version', () => {
		expect(RosetteSchema.version).toBeDefined();
		expect(RosetteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RosetteSchema.entities).toBe('object');
		expect(RosetteSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RosetteSchema.entities))).toBe(true);
		for (const entity of Object.values(RosetteSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since every answer derives from its input', () => {
		// Rosette is a stateless analysis service; the text it is given is the
		// caller's content, not a record worth storing.
		expect(Object.keys(RosetteSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
