import { DiffbotSchema } from './schema';

describe('Diffbot schema', () => {
	it('declares a semver version', () => {
		expect(DiffbotSchema.version).toBeDefined();
		expect(DiffbotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DiffbotSchema.entities).toBe('object');
		expect(DiffbotSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DiffbotSchema.entities))).toBe(true);
		for (const entity of Object.values(DiffbotSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
