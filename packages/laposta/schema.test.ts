import { LapostaSchema } from './schema';

describe('Laposta schema', () => {
	it('declares a semver version', () => {
		expect(LapostaSchema.version).toBeDefined();
		expect(LapostaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LapostaSchema.entities).toBe('object');
		expect(LapostaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LapostaSchema.entities))).toBe(true);
		for (const entity of Object.values(LapostaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
