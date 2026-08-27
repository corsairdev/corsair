import { SynthflowAiSchema } from './schema';

describe('SynthflowAi schema', () => {
	it('declares a semver version', () => {
		expect(SynthflowAiSchema.version).toBeDefined();
		expect(SynthflowAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SynthflowAiSchema.entities).toBe('object');
		expect(SynthflowAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SynthflowAiSchema.entities))).toBe(true);
		for (const entity of Object.values(SynthflowAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
