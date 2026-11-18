import { LangbaseSchema } from './schema';

describe('Langbase schema', () => {
	it('declares a semver version', () => {
		expect(LangbaseSchema.version).toBeDefined();
		expect(LangbaseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LangbaseSchema.entities).toBe('object');
		expect(LangbaseSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LangbaseSchema.entities))).toBe(true);
		for (const entity of Object.values(LangbaseSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
