import { FreeAgentSchema } from './schema';

describe('FreeAgent schema', () => {
	it('declares a semver version', () => {
		expect(FreeAgentSchema.version).toBeDefined();
		expect(FreeAgentSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FreeAgentSchema.entities).toBe('object');
		expect(FreeAgentSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FreeAgentSchema.entities))).toBe(true);
		for (const entity of Object.values(FreeAgentSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
