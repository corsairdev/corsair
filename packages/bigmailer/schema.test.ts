import { BigmailerSchema } from './schema';

describe('Bigmailer schema', () => {
	it('declares a semver version', () => {
		expect(BigmailerSchema.version).toBeDefined();
		expect(BigmailerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares exactly the 13 persistence entities this plugin mirrors', () => {
		expect(Object.keys(BigmailerSchema.entities).sort()).toEqual(
			[
				'brands',
				'brandProperties',
				'fields',
				'lists',
				'connections',
				'messageTypes',
				'senders',
				'contacts',
				'segments',
				'suppressionLists',
				'templates',
				'bulkCampaigns',
				'transactionalCampaigns',
			].sort(),
		);
		for (const entity of Object.values(BigmailerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
