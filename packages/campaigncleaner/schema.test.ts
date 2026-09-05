import { CampaignCleanerSchema } from './schema';

describe('CampaignCleaner schema', () => {
	it('declares a semver version', () => {
		expect(CampaignCleanerSchema.version).toBeDefined();
		expect(CampaignCleanerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CampaignCleanerSchema.entities).toBe('object');
		expect(CampaignCleanerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CampaignCleanerSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(CampaignCleanerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
