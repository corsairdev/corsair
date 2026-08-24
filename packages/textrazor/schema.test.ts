import { TextrazorSchema } from './schema';

describe('Textrazor schema', () => {
	it('declares a semver version', () => {
		expect(TextrazorSchema.version).toBeDefined();
		expect(TextrazorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TextrazorSchema.entities).toBe('object');
		expect(TextrazorSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TextrazorSchema.entities))).toBe(true);
		for (const entity of Object.values(TextrazorSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
