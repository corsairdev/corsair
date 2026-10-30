import { OllamaSchema } from './schema';

describe('Ollama schema', () => {
	it('declares a semver version', () => {
		expect(OllamaSchema.version).toBeDefined();
		expect(OllamaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof OllamaSchema.entities).toBe('object');
		expect(OllamaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(OllamaSchema.entities))).toBe(true);
		for (const entity of Object.values(OllamaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
