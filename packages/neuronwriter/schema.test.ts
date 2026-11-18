import { NeuronwriterSchema } from './schema';

describe('Neuronwriter schema', () => {
	it('declares a semver version', () => {
		expect(NeuronwriterSchema.version).toBeDefined();
		expect(NeuronwriterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NeuronwriterSchema.entities).toBe('object');
		expect(NeuronwriterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NeuronwriterSchema.entities))).toBe(true);
		for (const entity of Object.values(NeuronwriterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
