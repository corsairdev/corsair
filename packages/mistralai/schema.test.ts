import { MistralAiSchema } from './schema';

describe('Mistral AI schema', () => {
	it('declares a semver version', () => {
		expect(MistralAiSchema.version).toBeDefined();
		expect(MistralAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MistralAiSchema.entities).toBe('object');
		expect(MistralAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MistralAiSchema.entities))).toBe(true);
		for (const entity of Object.values(MistralAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
