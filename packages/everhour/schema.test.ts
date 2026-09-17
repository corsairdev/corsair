import { EverhourSchema } from './schema';

describe('Everhour schema', () => {
	it('declares a semver version', () => {
		expect(EverhourSchema.version).toBeDefined();
		expect(EverhourSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EverhourSchema.entities).toBe('object');
		expect(EverhourSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EverhourSchema.entities))).toBe(true);
		expect(Object.keys(EverhourSchema.entities).sort()).toEqual([
			'clients',
			'platforms',
			'projects',
			'tasks',
			'timeEntries',
			'users',
		]);
		for (const entity of Object.values(EverhourSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
