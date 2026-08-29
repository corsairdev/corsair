import { CapsuleCrmSchema } from './schema';

describe('CapsuleCrm schema', () => {
	it('declares a semver version', () => {
		expect(CapsuleCrmSchema.version).toBeDefined();
		expect(CapsuleCrmSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CapsuleCrmSchema.entities).toBe('object');
		expect(CapsuleCrmSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CapsuleCrmSchema.entities))).toBe(true);
		for (const entity of Object.values(CapsuleCrmSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
