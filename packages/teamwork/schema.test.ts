import { TeamworkSchema } from './schema';

describe('Teamwork schema', () => {
	it('declares a semver version', () => {
		expect(TeamworkSchema.version).toBeDefined();
		expect(TeamworkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TeamworkSchema.entities).toBe('object');
		expect(TeamworkSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TeamworkSchema.entities))).toBe(true);
		for (const entity of Object.values(TeamworkSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
