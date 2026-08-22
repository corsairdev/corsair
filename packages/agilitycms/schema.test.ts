import { AgilityCmsSchema } from './schema';

describe('AgilityCms schema', () => {
	it('declares a semver version', () => {
		expect(AgilityCmsSchema.version).toBeDefined();
		expect(AgilityCmsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AgilityCmsSchema.entities).toBe('object');
		expect(AgilityCmsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AgilityCmsSchema.entities))).toBe(true);
		for (const entity of Object.values(AgilityCmsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
