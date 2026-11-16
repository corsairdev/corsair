import { VectorshiftSchema } from './schema';

describe('VectorShift schema', () => {
	it('declares a semver version', () => {
		expect(VectorshiftSchema.version).toBeDefined();
		expect(VectorshiftSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof VectorshiftSchema.entities).toBe('object');
		expect(VectorshiftSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(VectorshiftSchema.entities))).toBe(true);
		for (const entity of Object.values(VectorshiftSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since runs are one-off and pipelines change', () => {
		// A pipeline edit changes its outputs, and a run produces a fresh result
		// every time, so there is nothing stable to keep.
		expect(Object.keys(VectorshiftSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
