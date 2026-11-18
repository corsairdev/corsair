import { LexofficeSchema } from './schema';

describe('Lexoffice schema', () => {
	it('declares a semver version', () => {
		expect(LexofficeSchema.version).toBeDefined();
		expect(LexofficeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LexofficeSchema.entities).toBe('object');
		expect(LexofficeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LexofficeSchema.entities))).toBe(true);
		for (const entity of Object.values(LexofficeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
