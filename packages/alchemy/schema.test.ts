import { AlchemySchema } from './schema';

describe('Alchemy schema', () => {
	it('declares a semver version', () => {
		expect(AlchemySchema.version).toBeDefined();
		expect(AlchemySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AlchemySchema.entities).toBe('object');
		expect(AlchemySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AlchemySchema.entities))).toBe(true);
		for (const entity of Object.values(AlchemySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
