import { ShortioSchema } from './schema';

describe('Shortio schema', () => {
	it('declares a semver version', () => {
		expect(ShortioSchema.version).toBeDefined();
		expect(ShortioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ShortioSchema.entities).toBe('object');
		expect(ShortioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ShortioSchema.entities))).toBe(true);
		for (const entity of Object.values(ShortioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
