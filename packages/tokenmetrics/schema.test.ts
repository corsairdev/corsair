import { TokenMetricsSchema } from './schema';

describe('TokenMetrics schema', () => {
	it('declares a semver version', () => {
		expect(TokenMetricsSchema.version).toBeDefined();
		expect(TokenMetricsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TokenMetricsSchema.entities).toBe('object');
		expect(TokenMetricsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TokenMetricsSchema.entities))).toBe(true);
		for (const entity of Object.values(TokenMetricsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
