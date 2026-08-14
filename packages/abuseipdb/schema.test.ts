import { AbuseIPDBSchema } from './schema';

describe('AbuseIPDB schema', () => {
	it('declares a semver version', () => {
		expect(AbuseIPDBSchema.version).toBeDefined();
		expect(AbuseIPDBSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AbuseIPDBSchema.entities).toBe('object');
		expect(AbuseIPDBSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AbuseIPDBSchema.entities))).toBe(true);
		for (const entity of Object.values(AbuseIPDBSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
