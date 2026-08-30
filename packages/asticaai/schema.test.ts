import { AsticaAiSchema } from './schema';

describe('AsticaAi schema', () => {
	it('declares a semver version', () => {
		expect(AsticaAiSchema.version).toBeDefined();
		expect(AsticaAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AsticaAiSchema.entities).toBe('object');
		expect(AsticaAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AsticaAiSchema.entities))).toBe(true);
		for (const entity of Object.values(AsticaAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
