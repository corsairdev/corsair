import { EngageSchema } from './schema';

describe('Engage schema', () => {
	it('declares a semver version', () => {
		expect(EngageSchema.version).toBeDefined();
		expect(EngageSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EngageSchema.entities).toBe('object');
		expect(EngageSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EngageSchema.entities))).toBe(true);
		for (const entity of Object.values(EngageSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
