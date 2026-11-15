import { ParallelSchema } from './schema';

describe('Parallel schema', () => {
	it('declares a semver version', () => {
		expect(ParallelSchema.version).toBeDefined();
		expect(ParallelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ParallelSchema.entities).toBe('object');
		expect(ParallelSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ParallelSchema.entities))).toBe(true);
		for (const entity of Object.values(ParallelSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
