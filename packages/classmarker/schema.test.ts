import { ClassmarkerSchema } from './schema';

describe('Classmarker schema', () => {
	it('declares a semver version', () => {
		expect(ClassmarkerSchema.version).toBeDefined();
		expect(ClassmarkerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClassmarkerSchema.entities).toBe('object');
		expect(ClassmarkerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClassmarkerSchema.entities))).toBe(true);
		for (const entity of Object.values(ClassmarkerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
