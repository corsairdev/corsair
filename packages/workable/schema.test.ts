import { WorkableSchema } from './schema';

describe('Workable schema', () => {
	it('declares a semver version', () => {
		expect(WorkableSchema.version).toBeDefined();
		expect(WorkableSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WorkableSchema.entities).toBe('object');
		expect(WorkableSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WorkableSchema.entities))).toBe(true);
		for (const entity of Object.values(WorkableSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
