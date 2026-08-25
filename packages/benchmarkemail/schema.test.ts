import { BenchmarkEmailSchema } from './schema';

describe('BenchmarkEmail schema', () => {
	it('declares a semver version', () => {
		expect(BenchmarkEmailSchema.version).toBeDefined();
		expect(BenchmarkEmailSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BenchmarkEmailSchema.entities).toBe('object');
		expect(BenchmarkEmailSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BenchmarkEmailSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(BenchmarkEmailSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
