import { VoSchema } from './schema';

describe('Vo schema', () => {
	it('declares a semver version', () => {
		expect(VoSchema.version).toBeDefined();
		expect(VoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof VoSchema.entities).toBe('object');
		expect(VoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(VoSchema.entities))).toBe(true);
		for (const entity of Object.values(VoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
