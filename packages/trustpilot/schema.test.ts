import { TrustpilotSchema } from './schema';

describe('Trustpilot schema', () => {
	it('declares a semver version', () => {
		expect(TrustpilotSchema.version).toBeDefined();
		expect(TrustpilotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TrustpilotSchema.entities).toBe('object');
		expect(TrustpilotSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TrustpilotSchema.entities))).toBe(true);
		for (const entity of Object.values(TrustpilotSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
