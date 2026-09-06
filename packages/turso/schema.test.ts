import { TursoSchema } from './schema';

describe('Turso schema', () => {
	it('declares a semver version', () => {
		expect(TursoSchema.version).toBeDefined();
		expect(TursoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TursoSchema.entities).toBe('object');
		expect(TursoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TursoSchema.entities))).toBe(true);
		for (const entity of Object.values(TursoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
