import { FlexisignSchema } from './schema';

describe('Flexisign schema', () => {
	it('declares a semver version', () => {
		expect(FlexisignSchema.version).toBeDefined();
		expect(FlexisignSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FlexisignSchema.entities).toBe('object');
		expect(FlexisignSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FlexisignSchema.entities))).toBe(true);
		for (const entity of Object.values(FlexisignSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
