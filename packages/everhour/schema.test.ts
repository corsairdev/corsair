import { EverhourSchema } from './schema';

describe('Everhour schema', () => {
	it('declares a semver version', () => {
		expect(EverhourSchema.version).toBeDefined();
		expect(EverhourSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EverhourSchema.entities).toBe('object');
		expect(EverhourSchema.entities).not.toBeNull();
		expect(Object.keys(EverhourSchema.entities).sort()).toEqual([
			'clients',
			'expenseCategories',
			'expenses',
			'invoices',
			'platforms',
			'projects',
			'sections',
			'tags',
			'tasks',
			'timeEntries',
			'timecards',
			'users',
			'webhooks',
		]);
		for (const entity of Object.values(EverhourSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
