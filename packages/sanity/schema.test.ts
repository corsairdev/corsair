import { SanitySchema } from './schema';

describe('Sanity schema', () => {
	it('declares a semver version', () => {
		expect(SanitySchema.version).toBeDefined();
		expect(SanitySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SanitySchema.entities).toBe('object');
		expect(SanitySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SanitySchema.entities))).toBe(true);
		for (const entity of Object.values(SanitySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
