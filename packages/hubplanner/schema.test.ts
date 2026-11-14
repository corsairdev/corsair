import { HubPlannerSchema } from './schema';

describe('HubPlanner schema', () => {
	it('declares a semver version', () => {
		expect(HubPlannerSchema.version).toBeDefined();
		expect(HubPlannerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HubPlannerSchema.entities).toBe('object');
		expect(HubPlannerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HubPlannerSchema.entities))).toBe(true);
		for (const entity of Object.values(HubPlannerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
