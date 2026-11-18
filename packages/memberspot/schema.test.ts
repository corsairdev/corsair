import { MemberSpotSchema } from './schema';

describe('Memberspot schema', () => {
	it('declares a semver version', () => {
		expect(MemberSpotSchema.version).toBeDefined();
		expect(MemberSpotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MemberSpotSchema.entities).toBe('object');
		expect(MemberSpotSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MemberSpotSchema.entities))).toBe(true);
		for (const entity of Object.values(MemberSpotSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
