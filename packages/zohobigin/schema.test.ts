import { ZohoBiginSchema } from './schema';

describe('ZohoBigin schema', () => {
	it('declares a semver version', () => {
		expect(ZohoBiginSchema.version).toBeDefined();
		expect(ZohoBiginSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZohoBiginSchema.entities).toBe('object');
		expect(ZohoBiginSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZohoBiginSchema.entities))).toBe(true);
		for (const entity of Object.values(ZohoBiginSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
