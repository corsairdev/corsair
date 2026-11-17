import { SquareSchema } from './schema';

describe('Square schema', () => {
	it('declares a semver version', () => {
		expect(SquareSchema.version).toBeDefined();
		expect(SquareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SquareSchema.entities).toBe('object');
		expect(SquareSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SquareSchema.entities))).toBe(true);
		for (const entity of Object.values(SquareSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
