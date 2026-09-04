import { PlainSchema } from './schema';

describe('Plain schema', () => {
	it('declares a semver version', () => {
		expect(PlainSchema.version).toBeDefined();
		expect(PlainSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PlainSchema.entities).toBe('object');
		expect(PlainSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PlainSchema.entities))).toBe(true);
		for (const entity of Object.values(PlainSchema.entities)) {
			expect(entity).toBeDefined();
		}
		expect(Object.keys(PlainSchema.entities)).toEqual([
			'customers',
			'threads',
			'companies',
			'tiers',
			'customer_groups',
		]);
	});
});
