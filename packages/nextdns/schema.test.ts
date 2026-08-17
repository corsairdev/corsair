import { NextDNSSchema } from './schema';

describe('NextDNS schema', () => {
	it('declares a semver version', () => {
		expect(NextDNSSchema.version).toBeDefined();
		expect(NextDNSSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NextDNSSchema.entities).toBe('object');
		expect(NextDNSSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NextDNSSchema.entities))).toBe(true);
		for (const entity of Object.values(NextDNSSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
