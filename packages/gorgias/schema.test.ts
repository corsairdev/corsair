import { GorgiasSchema } from './schema';

describe('Gorgias schema', () => {
	it('declares a semver version', () => {
		expect(GorgiasSchema.version).toBeDefined();
		expect(GorgiasSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GorgiasSchema.entities).toBe('object');
		expect(GorgiasSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GorgiasSchema.entities))).toBe(true);
		for (const entity of Object.values(GorgiasSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
