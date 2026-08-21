import { AllImagesAiSchema } from './schema';

describe('AllImagesAi schema', () => {
	it('declares a semver version', () => {
		expect(AllImagesAiSchema.version).toBeDefined();
		expect(AllImagesAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AllImagesAiSchema.entities).toBe('object');
		expect(AllImagesAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AllImagesAiSchema.entities))).toBe(true);
		for (const entity of Object.values(AllImagesAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
