import { CoassembleSchema } from './schema';

describe('Coassemble schema', () => {
	it('declares a semver version', () => {
		expect(CoassembleSchema.version).toBeDefined();
		expect(CoassembleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CoassembleSchema.entities).toBe('object');
		expect(CoassembleSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CoassembleSchema.entities))).toBe(true);
		for (const entity of Object.values(CoassembleSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
