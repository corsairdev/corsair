import { CodaSchema } from './schema';

describe('Coda schema', () => {
	it('declares a semver version', () => {
		expect(CodaSchema.version).toBeDefined();
		expect(CodaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CodaSchema.entities).toBe('object');
		expect(CodaSchema.entities).not.toBeNull();
		expect(Object.keys(CodaSchema.entities).sort()).toEqual([
			'documents',
			'tables',
		]);
		for (const entity of Object.values(CodaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
