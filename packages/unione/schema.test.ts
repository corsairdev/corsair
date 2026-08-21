import { UnioneSchema } from './schema';

describe('Unione schema', () => {
	it('declares a semver version', () => {
		expect(UnioneSchema.version).toBeDefined();
		expect(UnioneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UnioneSchema.entities).toBe('object');
		expect(UnioneSchema.entities).not.toBeNull();
		expect(Object.keys(UnioneSchema.entities)).toEqual(
			expect.arrayContaining([
				'templates',
				'webhooks',
				'suppressions',
				'eventDumps',
				'domains',
				'tags',
				'account',
			]),
		);
		for (const entity of Object.values(UnioneSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
