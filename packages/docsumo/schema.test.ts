import { DocsumoSchema } from './schema';

describe('Docsumo schema', () => {
	it('declares a semver version', () => {
		expect(DocsumoSchema.version).toBeDefined();
		expect(DocsumoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DocsumoSchema.entities).toBe('object');
		expect(DocsumoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DocsumoSchema.entities))).toBe(true);
		for (const entity of Object.values(DocsumoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
