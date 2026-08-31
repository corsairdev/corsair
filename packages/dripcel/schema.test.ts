import { DripcelSchema } from './schema';

describe('Dripcel schema', () => {
	it('declares a semver version', () => {
		expect(DripcelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map from official Dripcel resources', () => {
		expect(typeof DripcelSchema.entities).toBe('object');
		expect(DripcelSchema.entities).not.toBeNull();
		expect(Object.keys(DripcelSchema.entities).sort()).toEqual([
			'campaigns',
			'contacts',
			'deliveries',
			'emailTemplates',
			'replies',
			'sales',
			'sendLogs',
			'tags',
		]);
	});
});
