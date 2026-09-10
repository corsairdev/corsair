import { BonsaiSchema } from './schema';

describe('Bonsai schema', () => {
	it('declares a semver version', () => {
		expect(BonsaiSchema.version).toBeDefined();
		expect(BonsaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BonsaiSchema.entities).toBe('object');
		expect(BonsaiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BonsaiSchema.entities))).toBe(true);
		for (const entity of Object.values(BonsaiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
