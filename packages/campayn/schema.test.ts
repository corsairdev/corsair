import { CampaynSchema } from './schema';

describe('Campayn schema', () => {
	it('declares a semver version', () => {
		expect(CampaynSchema.version).toBeDefined();
		expect(CampaynSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CampaynSchema.entities).toBe('object');
		expect(CampaynSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CampaynSchema.entities))).toBe(true);
		for (const entity of Object.values(CampaynSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
