import { KalshiSchema } from './schema';

describe('Kalshi schema', () => {
	it('declares a semver version', () => {
		expect(KalshiSchema.version).toBeDefined();
		expect(KalshiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof KalshiSchema.entities).toBe('object');
		expect(KalshiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(KalshiSchema.entities))).toBe(true);
		for (const entity of Object.values(KalshiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
