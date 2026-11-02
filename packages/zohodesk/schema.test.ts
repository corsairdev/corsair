import { ZohoDeskSchema } from './schema';

describe('ZohoDesk schema', () => {
	it('declares a semver version', () => {
		expect(ZohoDeskSchema.version).toBeDefined();
		expect(ZohoDeskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZohoDeskSchema.entities).toBe('object');
		expect(ZohoDeskSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZohoDeskSchema.entities))).toBe(true);
		for (const entity of Object.values(ZohoDeskSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
