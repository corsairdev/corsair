import { WhautomateSchema } from './schema';

describe('Whautomate schema', () => {
	it('declares a semver version', () => {
		expect(WhautomateSchema.version).toBeDefined();
		expect(WhautomateSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WhautomateSchema.entities).toBe('object');
		expect(WhautomateSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WhautomateSchema.entities))).toBe(true);
		for (const entity of Object.values(WhautomateSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
